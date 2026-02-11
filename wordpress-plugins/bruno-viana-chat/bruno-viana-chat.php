<?php
/**
 * Plugin Name: Bruno Viana Chat
 * Description: Adiciona o chat "Agente de IA" como widget flutuante.
 * Version: 2.0
 * Author: Antigravity
 */

function bruno_viana_chat_enqueue_assets()
{
    wp_enqueue_style('bruno-chat-style', plugin_dir_url(__FILE__) . 'assets/chat.css');
    wp_enqueue_script('bruno-chat-script', plugin_dir_url(__FILE__) . 'assets/chat.js', array(), '2.0', true);
}
add_action('wp_enqueue_scripts', 'bruno_viana_chat_enqueue_assets');

function bruno_viana_chat_shortcode()
{
    ob_start();
    ?>
    <!-- Floating Chat Widget Container -->
    <div id="bruno-chat-widget">
        <!-- Chat Window (Hidden by default) -->
        <div id="bruno-chat-window" class="chat-window">
            <div class="chat-header">
                <div class="header-info">
                    <div class="avatar-circle">
                        <span class="avatar-emoji">🤖</span>
                    </div>
                    <div class="header-text">
                        <span class="bot-name">Agente de IA</span>
                        <span class="bot-status">Online agora</span>
                    </div>
                </div>
                <button id="close-chat-btn" class="close-btn">&times;</button>
            </div>

            <div class="chat-body" id="chat-body">
                <div class="message system">
                    Olá! Sou a IA do Bruno Viana.
                    <br>Posso te ajudar a escalar suas vendas?
                    <br><strong>Qual é o seu nome?</strong>
                </div>
            </div>

            <div class="chat-input-area">
                <input type="text" id="userInput" placeholder="Digite sua resposta..." autocomplete="off">
                <button id="sendBtn" class="btn-send">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Floating Toggle Button -->
        <button id="bruno-chat-toggle" class="chat-toggle-btn">
            <span class="toggle-icon">💬</span>
            <span class="toggle-text">Dúvidas?</span>
        </button>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('bruno_chat', 'bruno_viana_chat_shortcode');
