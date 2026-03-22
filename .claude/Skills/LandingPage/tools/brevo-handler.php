<?php
/**
 * Brevo (Sendinblue) Subscription Handler
 *
 * Handles AJAX form submission from custom HTML landing pages.
 * Add this code via WPCode plugin (recommended) or functions.php.
 *
 * HOW TO INSTALL:
 * 1. Install "WPCode – Insert Headers and Footers + Custom Code Snippets" plugin
 * 2. WPCode → Add Snippet → PHP Snippet
 * 3. Paste this entire file contents
 * 4. Set: Run Everywhere → Save
 *
 * BREVO SETUP:
 * - API Key: Get from Brevo → Account → SMTP & API → API Keys → V3
 * - List ID: 4 (existing newsletter list)
 * - Double opt-in: disabled (matches current Elementor setting)
 *
 * TESTING:
 * curl -X POST https://alvishouse.io/wp-admin/admin-ajax.php \
 *   -d "action=brevo_subscribe&first_name=Test&email=test@example.com"
 */

// ── CONFIGURATION ────────────────────────────────────────────────────────────

if ( ! defined( 'BREVO_API_KEY' ) ) {
    define( 'BREVO_API_KEY', 'BREVO_API_KEY_REDACTED_SEE_ENV' );
}
if ( ! defined( 'BREVO_LIST_ID' ) ) {
    define( 'BREVO_LIST_ID', 4 );
}

// ── AJAX HANDLER (logged-in + non-logged-in users) ───────────────────────────

add_action('wp_ajax_brevo_subscribe',        'alvis_brevo_subscribe');
add_action('wp_ajax_nopriv_brevo_subscribe', 'alvis_brevo_subscribe');

function alvis_brevo_subscribe() {
    // Sanitize inputs
    $first_name = sanitize_text_field($_POST['first_name'] ?? '');
    $email      = sanitize_email($_POST['email'] ?? '');

    // Validate
    if (empty($email) || !is_email($email)) {
        wp_send_json_error('Please enter a valid email address.');
    }

    // Call Brevo API
    $response = wp_remote_post('https://api.brevo.com/v3/contacts', [
        'headers' => [
            'accept'       => 'application/json',
            'content-type' => 'application/json',
            'api-key'      => BREVO_API_KEY,
        ],
        'body' => json_encode([
            'email'            => $email,
            'attributes'       => [
                'FIRSTNAME' => $first_name,
            ],
            'listIds'          => [BREVO_LIST_ID],
            'updateEnabled'    => true,   // Update existing contacts, don't error
        ]),
        'timeout' => 15,
    ]);

    // Handle API errors
    if (is_wp_error($response)) {
        wp_send_json_error('Connection error. Please try again.');
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    // 201 = created, 204 = updated (both are success)
    if ($code === 201 || $code === 204) {
        wp_send_json_success('Subscribed successfully.');
    }

    // Handle Brevo-specific errors
    $brevo_message = $body['message'] ?? 'Subscription failed. Please try again.';

    // Contact already exists and subscribed — treat as success
    if (str_contains($brevo_message, 'Contact already exist')) {
        wp_send_json_success('You\'re already on the list!');
    }

    wp_send_json_error($brevo_message);
}
