<?php
function bruno_viana_scripts()
{
    // Enqueue Main Styles
    wp_enqueue_style('bruno-viana-style', get_stylesheet_uri());

    // GSAP
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true);

    // Particles JS
    wp_enqueue_script('particles-js', get_template_directory_uri() . '/js/particles.js', array(), '2.0.0', true);

    // Main App JS
    wp_enqueue_script('bruno-viana-app', get_template_directory_uri() . '/js/app.js', array('gsap', 'particles-js'), '1.0', true);

    // Form Styles & Scripts
    wp_enqueue_style('bruno-viana-form', get_template_directory_uri() . '/css/form.css');
    wp_enqueue_style('bruno-viana-chat', get_template_directory_uri() . '/css/chat-floating.css');

    wp_enqueue_script('bruno-viana-form-js', get_template_directory_uri() . '/js/form.js', array(), '1.0', true);
    wp_enqueue_script('bruno-viana-chat-js', get_template_directory_uri() . '/js/chat-floating.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'bruno_viana_scripts');

function bruno_viana_setup()
{
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'bruno_viana_setup');
?>