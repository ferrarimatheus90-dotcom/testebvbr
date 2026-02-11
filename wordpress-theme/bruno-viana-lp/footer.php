<footer class="footer">
    <div class="container">
        <p>&copy;
            <?php echo date('Y'); ?> Bruno Viana. Todos os direitos reservados.
        </p>
    </div>
</footer>

<div id="particles-js" class="global-bg-effect"></div>

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
                <br>Estou aqui para tirar suas dúvidas sobre <strong>Consultoria</strong>, <strong>Mentoria</strong>
                e <strong>IA</strong>.
                <br>Como posso ajudar hoje?
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

<?php wp_footer(); ?>
</body>

</html>