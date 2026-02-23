# Componente de Formulário

Este componente adiciona um formulário de contato integrado com um webhook do n8n.

## Como Instalar

1. **Copie os arquivos:**
   - Copie `form.css` para a pasta `css/` do seu novo projeto.
   - Copie `form.js` para a pasta `js/` do seu novo projeto.

2. **Adicione o HTML:**
   - Copie o conteúdo de `form_snippet.html` e cole onde deseja que o formulário apareça (dentro do `<body>`).

3. **Configuração:**
   - Abra o arquivo `js/form.js` e procure pela variável `n8nWebhook`.
   - Substitua a URL existente pela URL do seu próprio webhook do n8n (POST) que receberá os dados.

## Personalização

- **Campos:** Você pode adicionar ou remover campos no HTML (`form_snippet.html`). Se fizer isso, lembre-se de atualizar o `js/form.js` na parte que coleta os dados (`const data = { ... }`).
- **Estilos:** Edite `form.css` para ajustar cores e espaçamentos.
