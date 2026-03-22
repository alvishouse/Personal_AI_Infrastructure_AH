<?php
/**
 * Plugin Name: PAI Title Format Meta Fields
 * Plugin URI: https://alvishouse.io
 * Description: Registers custom meta fields for blog post title formatting (eyebrow text, subtitle, author title, read time)
 * Version: 1.0.0
 * Author: Alvis Lazarus
 * Author URI: https://alvishouse.io
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: pai-meta-fields
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Custom Meta Fields for Title Format
 */
add_action('init', 'pai_register_title_format_meta_fields');

function pai_register_title_format_meta_fields() {

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
