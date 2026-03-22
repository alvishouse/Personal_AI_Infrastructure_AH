<?php
/*
 * PAI Newsletter Post Type + Brevo Integration
 * Install via WPCode → Add Snippet → PHP Snippet → Run Everywhere
 *
 * AFTER SAVING: Go to Settings → Permalinks → Save Changes (flushes rewrite rules)
 * SENDER: Verify newsletter@alvishouse.io is authenticated in Brevo before sending
 */

// ── CONFIGURATION ─────────────────────────────────────────────────────────────

if ( ! defined( 'BREVO_API_KEY' ) ) {
	define( 'BREVO_API_KEY', 'BREVO_API_KEY_REDACTED_SEE_ENV' );
}
if ( ! defined( 'BREVO_LIST_ID' ) ) {
	define( 'BREVO_LIST_ID', 4 );
}

define( 'PAI_NL_SENDER_NAME',  'Alvis House' );
define( 'PAI_NL_SENDER_EMAIL', 'alvis@alvishouse.io' );

// ── 1. CUSTOM POST TYPE ───────────────────────────────────────────────────────

add_action( 'init', 'pai_register_newsletter_cpt' );

function pai_register_newsletter_cpt() {
	register_post_type( 'newsletter', array(
		'labels' => array(
			'name'               => 'Newsletters',
			'singular_name'      => 'Newsletter',
			'add_new'            => 'Add New Issue',
			'add_new_item'       => 'Add New Issue',
			'edit_item'          => 'Edit Issue',
			'view_item'          => 'View Issue',
			'all_items'          => 'All Issues',
			'search_items'       => 'Search Newsletters',
			'not_found'          => 'No newsletter issues found.',
			'not_found_in_trash' => 'No newsletter issues found in trash.',
		),
		'public'        => true,
		'show_in_rest'  => true,
		'has_archive'   => true,
		'rewrite'       => array( 'slug' => 'newsletter' ),
		'menu_icon'     => 'dashicons-email-alt',
		'menu_position' => 6,
		'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
	) );
}

// ── 2. META FIELDS ────────────────────────────────────────────────────────────

add_action( 'init', 'pai_register_newsletter_meta' );

function pai_register_newsletter_meta() {
	$auth = function() { return current_user_can( 'edit_posts' ); };

	$string_fields = array(
		'newsletter_subject'           => 'Email subject line',
		'newsletter_preheader'         => 'Email preheader / preview text',
		'newsletter_brevo_campaign_id' => 'Brevo campaign ID (auto-set on publish)',
		'newsletter_send_status'       => 'Campaign state: draft | ready | sent',
		'newsletter_sent_at'           => 'ISO timestamp when campaign was sent',
	);

	foreach ( $string_fields as $key => $desc ) {
		register_post_meta( 'newsletter', $key, array(
			'show_in_rest'      => true,
			'single'            => true,
			'type'              => 'string',
			'description'       => $desc,
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => $auth,
		) );
	}

	register_post_meta( 'newsletter', 'newsletter_issue_number', array(
		'show_in_rest'      => true,
		'single'            => true,
		'type'              => 'integer',
		'description'       => 'Issue number',
		'default'           => 0,
		'sanitize_callback' => 'absint',
		'auth_callback'     => $auth,
	) );
}

// ── 3. CREATE BREVO CAMPAIGN ON PUBLISH ───────────────────────────────────────

add_action( 'publish_newsletter', 'pai_create_brevo_campaign', 10, 2 );

function pai_create_brevo_campaign( $post_id, $post ) {
	// Only create once — skip if campaign already exists
	if ( get_post_meta( $post_id, 'newsletter_brevo_campaign_id', true ) ) {
		return;
	}

	$subject   = get_post_meta( $post_id, 'newsletter_subject', true );
	$preheader = get_post_meta( $post_id, 'newsletter_preheader', true );
	$issue_num = (int) get_post_meta( $post_id, 'newsletter_issue_number', true );
	$post_url  = get_permalink( $post_id );
	$title     = get_the_title( $post_id );

	if ( empty( $subject ) ) {
		$subject = $title;
	}

	$excerpt = trim( $post->post_excerpt );
	if ( empty( $excerpt ) ) {
		$excerpt = wp_trim_words( strip_shortcodes( wp_strip_all_tags( $post->post_content ) ), 50, '...' );
	}

	$issue_label = $issue_num > 0 ? 'Issue #' . $issue_num : '';
	$html        = pai_newsletter_email_html( $title, $excerpt, $preheader, $post_url, $issue_label );

	$response = wp_remote_post( 'https://api.brevo.com/v3/emailCampaigns', array(
		'headers' => array(
			'accept'       => 'application/json',
			'content-type' => 'application/json',
			'api-key'      => BREVO_API_KEY,
		),
		'body'    => wp_json_encode( array(
			'name'        => 'Newsletter: ' . $title,
			'subject'     => $subject,
			'sender'      => array(
				'name'  => PAI_NL_SENDER_NAME,
				'email' => PAI_NL_SENDER_EMAIL,
			),
			'type'        => 'classic',
			'htmlContent' => $html,
			'recipients'  => array( 'listIds' => array( BREVO_LIST_ID ) ),
		) ),
		'timeout' => 20,
	) );

	if ( is_wp_error( $response ) ) {
		error_log( '[PAI Newsletter] Brevo error: ' . $response->get_error_message() );
		return;
	}

	$code    = wp_remote_retrieve_response_code( $response );
	$payload = json_decode( wp_remote_retrieve_body( $response ), true );

	if ( $code === 201 && ! empty( $payload['id'] ) ) {
		update_post_meta( $post_id, 'newsletter_brevo_campaign_id', (string) $payload['id'] );
		update_post_meta( $post_id, 'newsletter_send_status', 'ready' );
	} else {
		error_log( '[PAI Newsletter] Brevo campaign creation failed (' . $code . '): ' . wp_remote_retrieve_body( $response ) );
	}
}

// ── 4. EMAIL HTML TEMPLATE ────────────────────────────────────────────────────

function pai_newsletter_email_html( $title, $excerpt, $preheader, $post_url, $issue_label ) {
	$preview_text = $preheader ? $preheader : $excerpt;
	$preview_text = esc_html( substr( $preview_text, 0, 150 ) );
	$padding      = str_repeat( '&zwnj;&nbsp;', 40 );
	$issue_header = $issue_label
		? 'The Alvis House Newsletter &middot; ' . esc_html( $issue_label )
		: 'The Alvis House Newsletter';

	$html  = '<!DOCTYPE html>';
	$html .= '<html lang="en">';
	$html .= '<head>';
	$html .= '<meta charset="UTF-8">';
	$html .= '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
	$html .= '<title>' . esc_html( $title ) . '</title>';
	$html .= '</head>';
	$html .= '<body style="margin:0;padding:0;background-color:#ffffff;">';

	// Hidden preheader
	$html .= '<div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">';
	$html .= $preview_text . $padding;
	$html .= '</div>';

	// View in browser
	$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	$html .= '<tr><td align="center" style="padding:12px 0;font-family:Arial,sans-serif;font-size:11px;color:#999999;">';
	$html .= '<a href="{{mirror}}" style="color:#999999;text-decoration:underline;">View in browser</a>';
	$html .= '</td></tr></table>';

	// Main wrapper
	$html .= '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">';
	$html .= '<tr><td align="center" style="padding:0 24px;">';

	// Content table
	$html .= '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">';
	$html .= '<tr><td style="padding:40px 0 24px;">';

	// Issue label
	$html .= '<p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888888;">';
	$html .= $issue_header;
	$html .= '</p>';

	// Title
	$html .= '<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;line-height:1.3;color:#1a1a1a;font-weight:normal;">';
	$html .= esc_html( $title );
	$html .= '</h1>';

	// Excerpt
	$html .= '<p style="margin:0 0 32px;font-family:Georgia,serif;font-size:17px;line-height:1.7;color:#333333;">';
	$html .= esc_html( $excerpt );
	$html .= '</p>';

	// CTA button
	$html .= '<table cellpadding="0" cellspacing="0" border="0">';
	$html .= '<tr><td align="center" bgcolor="#1a1a1a" style="border-radius:4px;">';
	$html .= '<a href="' . esc_url( $post_url ) . '" style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:4px;">';
	$html .= 'Read the full issue &rarr;';
	$html .= '</a></td></tr></table>';

	$html .= '</td></tr>';

	// Footer
	$html .= '<tr><td style="padding:32px 0 0;border-top:1px solid #e8e8e8;">';
	$html .= '<p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#999999;">';
	$html .= 'You\'re receiving this because you subscribed to The Alvis House Newsletter.';
	$html .= '</p>';
	$html .= '<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999999;">';
	$html .= '<a href="{{unsubscribe}}" style="color:#999999;text-decoration:underline;">Unsubscribe</a>';
	$html .= '</p>';
	$html .= '</td></tr>';

	$html .= '</table>';  // content table
	$html .= '</td></tr></table>';  // main wrapper
	$html .= '</body></html>';

	return $html;
}

// ── 5. ADMIN METABOX ──────────────────────────────────────────────────────────

add_action( 'add_meta_boxes', 'pai_newsletter_add_metabox' );

function pai_newsletter_add_metabox() {
	add_meta_box(
		'pai_newsletter_brevo',
		'Newsletter & Brevo',
		'pai_newsletter_metabox_render',
		'newsletter',
		'side',
		'high'
	);
}

function pai_newsletter_metabox_render( $post ) {
	wp_nonce_field( 'pai_newsletter_save', 'pai_newsletter_nonce' );

	$subject     = get_post_meta( $post->ID, 'newsletter_subject', true );
	$preheader   = get_post_meta( $post->ID, 'newsletter_preheader', true );
	$issue_num   = get_post_meta( $post->ID, 'newsletter_issue_number', true );
	$campaign_id = get_post_meta( $post->ID, 'newsletter_brevo_campaign_id', true );
	$status      = get_post_meta( $post->ID, 'newsletter_send_status', true );
	$sent_at     = get_post_meta( $post->ID, 'newsletter_sent_at', true );

	if ( ! $status ) {
		$status = 'draft';
	}

	echo '<p>';
	echo '<label style="font-weight:600;display:block;margin-bottom:4px;">Subject Line</label>';
	echo '<input type="text" name="newsletter_subject" value="' . esc_attr( $subject ) . '" style="width:100%;" placeholder="55% more output. Zero new hires.">';
	echo '</p>';

	echo '<p>';
	echo '<label style="font-weight:600;display:block;margin-bottom:4px;">Preheader</label>';
	echo '<input type="text" name="newsletter_preheader" value="' . esc_attr( $preheader ) . '" style="width:100%;" placeholder="Why your competitor stopped asking...">';
	echo '<span style="font-size:11px;color:#777;">Preview text shown in inbox (~90 chars)</span>';
	echo '</p>';

	echo '<p>';
	echo '<label style="font-weight:600;display:block;margin-bottom:4px;">Issue #</label>';
	echo '<input type="number" name="newsletter_issue_number" value="' . esc_attr( $issue_num ) . '" style="width:70px;" min="1">';
	echo '</p>';

	echo '<hr style="margin:12px 0;border:0;border-top:1px solid #ddd;">';

	$status_map = array(
		'draft' => '<span style="color:#777;">&#9898; Draft &mdash; campaign created on publish</span>',
		'ready' => '<span style="color:#b45309;">&#128993; Ready to send</span>',
		'sent'  => '<span style="color:#15803d;">&#128994; Sent</span>',
	);
	$status_display = isset( $status_map[ $status ] ) ? $status_map[ $status ] : esc_html( $status );

	echo '<p><strong>Status:</strong><br>' . $status_display . '</p>';

	if ( $campaign_id ) {
		echo '<p style="font-size:12px;color:#777;">Brevo ID: ' . esc_html( $campaign_id );
		if ( $sent_at ) {
			echo '<br>Sent: ' . esc_html( date_i18n( 'M j, Y g:i a', strtotime( $sent_at ) ) );
		}
		echo '</p>';
	}

	if ( $status === 'ready' ) {
		$send_nonce = wp_create_nonce( 'pai_brevo_send_' . $post->ID );
		echo '<p style="margin:0;">';
		echo '<button type="button" id="pai-brevo-send" class="button button-primary"';
		echo ' data-post="' . esc_attr( $post->ID ) . '"';
		echo ' data-nonce="' . esc_attr( $send_nonce ) . '">';
		echo 'Send to Subscribers';
		echo '</button>';
		echo '<br><span id="pai-send-msg" style="font-size:12px;margin-top:6px;display:none;"></span>';
		echo '</p>';
		echo '<script>';
		echo 'document.getElementById("pai-brevo-send").addEventListener("click",function(){';
		echo 'var btn=this,msg=document.getElementById("pai-send-msg");';
		echo 'btn.disabled=true;btn.textContent="Sending...";';
		echo 'msg.style.display="block";msg.style.color="#555";msg.textContent="Contacting Brevo...";';
		echo 'var fd=new FormData();';
		echo 'fd.append("action","pai_brevo_send");';
		echo 'fd.append("post_id",btn.dataset.post);';
		echo 'fd.append("nonce",btn.dataset.nonce);';
		echo 'fetch(ajaxurl,{method:"POST",body:fd})';
		echo '.then(function(r){return r.json();})';
		echo '.then(function(r){';
		echo 'if(r.success){msg.style.color="#15803d";msg.textContent="Sent! Reload to update status.";}';
		echo 'else{msg.style.color="#b91c1c";msg.textContent="Error: "+(r.data||"Check PHP error log.");btn.disabled=false;btn.textContent="Retry Send";}';
		echo '})';
		echo '.catch(function(){msg.style.color="#b91c1c";msg.textContent="Request failed.";btn.disabled=false;btn.textContent="Retry Send";});';
		echo '});';
		echo '</script>';
	} elseif ( $status === 'sent' ) {
		echo '<p style="color:#15803d;font-weight:600;">&#10003; Campaign delivered.</p>';
	} else {
		echo '<p style="font-size:12px;color:#777;">Fill fields above, then publish to auto-create the Brevo campaign draft.</p>';
	}
}

// ── 6. SAVE METABOX FIELDS ────────────────────────────────────────────────────

add_action( 'save_post_newsletter', 'pai_newsletter_save_meta' );

function pai_newsletter_save_meta( $post_id ) {
	if ( ! isset( $_POST['pai_newsletter_nonce'] ) ) {
		return;
	}
	if ( ! wp_verify_nonce( $_POST['pai_newsletter_nonce'], 'pai_newsletter_save' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['newsletter_subject'] ) ) {
		update_post_meta( $post_id, 'newsletter_subject', sanitize_text_field( $_POST['newsletter_subject'] ) );
	}
	if ( isset( $_POST['newsletter_preheader'] ) ) {
		update_post_meta( $post_id, 'newsletter_preheader', sanitize_text_field( $_POST['newsletter_preheader'] ) );
	}
	if ( isset( $_POST['newsletter_issue_number'] ) ) {
		update_post_meta( $post_id, 'newsletter_issue_number', absint( $_POST['newsletter_issue_number'] ) );
	}
}

// ── 7. AJAX: SEND CAMPAIGN ────────────────────────────────────────────────────

add_action( 'wp_ajax_pai_brevo_send', 'pai_brevo_send_handler' );

function pai_brevo_send_handler() {
	$post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
	$nonce   = isset( $_POST['nonce'] ) ? $_POST['nonce'] : '';

	if ( ! $post_id || ! wp_verify_nonce( $nonce, 'pai_brevo_send_' . $post_id ) ) {
		wp_send_json_error( 'Invalid request.' );
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		wp_send_json_error( 'Permission denied.' );
	}

	$campaign_id = get_post_meta( $post_id, 'newsletter_brevo_campaign_id', true );
	if ( empty( $campaign_id ) ) {
		wp_send_json_error( 'No Brevo campaign found. Publish the post first.' );
	}

	$response = wp_remote_post(
		'https://api.brevo.com/v3/emailCampaigns/' . $campaign_id . '/sendNow',
		array(
			'headers' => array(
				'accept'  => 'application/json',
				'api-key' => BREVO_API_KEY,
			),
			'body'    => '',
			'timeout' => 20,
		)
	);

	if ( is_wp_error( $response ) ) {
		wp_send_json_error( 'Connection error: ' . $response->get_error_message() );
	}

	$code = wp_remote_retrieve_response_code( $response );

	if ( $code === 204 ) {
		update_post_meta( $post_id, 'newsletter_send_status', 'sent' );
		update_post_meta( $post_id, 'newsletter_sent_at', gmdate( 'c' ) );
		wp_send_json_success( 'Campaign sent.' );
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );
	wp_send_json_error( isset( $body['message'] ) ? $body['message'] : 'Brevo returned HTTP ' . $code );
}
