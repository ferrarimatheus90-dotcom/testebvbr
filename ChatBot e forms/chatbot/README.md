# Componente Chatbot Flutuante

Este componente adiciona um widget de chat flutuante ao seu site, integrado com um webhook do n8n (padrão).

## Como Instalar

1. **Copie os arquivos:**
   - Copie `chat-floating.css` para a pasta `css/` do seu novo projeto.
   - Copie `chat-floating.js` para a pasta `js/` do seu novo projeto.

2. **Adicione o HTML:**
   - Copie o conteúdo de `chatbot_snippet.html` e cole no seu arquivo HTML (ex: `index.html`), prefencialmente antes da tag de fechamento `</body>`.

3. **Configuração:**
   - Abra o arquivo `js/chat-floating.js` e procure pela variável `this.n8nWebhook`.
   - Substitua a URL existente pela URL do seu próprio webhook do n8n se necessário.

## Personalização

- **Cores**: Edite as variáveis no topo do arquivo `chat-floating.css` (ex: `--chat-primary`).
- **Texto Inicial**: Edite o HTML em `chatbot_snippet.html` na div com classe `message system`.
