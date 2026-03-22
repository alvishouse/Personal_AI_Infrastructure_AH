<?php
/**
 * Register Custom Meta Fields for Title Format
 *
 * Add this to your WordPress theme's functions.php file
 * or create a custom plugin with this code.
 *
 * This enables REST API access to eyebrow_text, subtitle,
 * author_title, and read_time meta fields.
 */

add_action('init', 'register_title_format_meta_fields');

function register_title_format_meta_fields() {

    // Register eyebrow_text meta field
    register_post_meta('post', 'eyebrow_text', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'description' => 'Eyebrow text displayed above post title (uppercase)',
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    // Register subtitle meta field
    register_post_meta('post', 'subtitle', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'description' => 'Subtitle displayed below post title (italic)',
        'default' => '',
        'sanitize_callback' => 'sanitize_textarea_field',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    // Register author_title meta field
    register_post_meta('post', 'author_title', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'description' => 'Author title/role (e.g., "AI Readiness Consultant")',
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));

    // Register read_time meta field
    register_post_meta('post', 'read_time', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'description' => 'Estimated reading time in minutes',
        'default' => '5',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}

/**
 * Usage in Elementor:
 *
 * 1. Eyebrow Text Widget (Text Editor):
 *    Dynamic Tags → Post Custom Field → eyebrow_text
 *
 * 2. Subtitle Widget (Text Editor):
 *    Dynamic Tags → Post Custom Field → subtitle
 *
 * 3. Author Meta Widget (Custom HTML):
 *    <p class="post-meta">
 *      By <strong><?php the_author(); ?></strong>
 *      | <?php echo get_post_meta(get_the_ID(), 'author_title', true); ?>
 *      | <?php echo get_the_date('F Y'); ?>
 *      | <?php echo get_post_meta(get_the_ID(), 'read_time', true); ?> min read
 *    </p>
 */
