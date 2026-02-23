# Kit de Arquivos Reutilizáveis

Este diretório contém os componentes isolados do **Chatbot** e do **Formulário** para serem facilmente reutilizados em novos projetos.

## Estrutura

- **chatbot/**: Contém todos os arquivos necessários para o widget de chat flutuante.
  - `chatbot_snippet.html`: Código HTML para colar no seu site.
  - `chat-floating.css`: Estilos do chat.
  - `chat-floating.js`: Lógica do chat (inclui configuração do Webhook).
  - `README.md`: Instruções específicas.

- **formulario/**: Contém todos os arquivos necessários para o formulário de contato.
  - `form_snippet.html`: Código HTML do formulário.
  - `form.css`: Estilos do formulário.
  - `form.js`: Lógica de envio (inclui configuração do Webhook).
  - `README.md`: Instruções específicas.

## Guia Rápido

1. Copie a pasta do componente desejado (ou apenas os arquivos dentro dela) para o seu novo projeto.
2. Siga as instruções no `README.md` de cada pasta para integrar o HTML, CSS e JS.
3. **Importante:** Lembre-se de configurar as URLs dos Webhooks do n8n nos arquivos `.js` para que os dados sejam enviados para o lugar certo no novo projeto.
