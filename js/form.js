
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('interest-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!contactForm) return;

    const interestSelect = document.getElementById('interest');
    const otherInterestGroup = document.getElementById('other-interest-group');

    // Toggle 'Other' field visibility
    if (interestSelect && otherInterestGroup) {
        interestSelect.addEventListener('change', () => {
            if (interestSelect.value === 'outro') {
                otherInterestGroup.style.display = 'block';
                document.getElementById('other-interest').required = true;
            } else {
                otherInterestGroup.style.display = 'none';
                document.getElementById('other-interest').required = false;
                document.getElementById('other-interest').value = ''; // Clean up
            }
        });
    }

    const n8nWebhook = "https://agente-n8n.qy9sqv.easypanel.host/webhook/form-submit-final";

    // Helper function for retrying requests
    async function sendDataWithRetry(url, data, maxRetries = 3) {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                return response; // Success

            } catch (error) {
                attempt++;
                console.warn(`Attempt ${attempt} failed:`, error);

                if (attempt >= maxRetries) {
                    throw error; // All attempts failed
                }

                // Update button text to show retry status
                submitBtn.innerHTML = `Tentando novamente (${attempt}/${maxRetries})...`;

                // Wait 2 seconds before retrying
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Lockdown button
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.disabled = true;
        formMessage.className = 'form-message'; // Reset classes
        formMessage.style.display = 'none';

        // Gather Data
        const formData = new FormData(contactForm);
        let interestVal = formData.get('interest');

        if (interestVal === 'outro') {
            interestVal = `Outro: ${formData.get('other_interest')}`;
        }

        const data = {
            nome: formData.get('name'),
            email: formData.get('email'),
            whatsapp: formData.get('whatsapp'),
            empresa: formData.get('company'),
            dificuldades: formData.get('challenges'),
            interesse_principal: interestVal,
            source: 'static_form' // To distinguish from chat
        };

        try {
            // Use the retry helper
            await sendDataWithRetry(n8nWebhook, data);

            // Success
            formMessage.textContent = "Obrigado pelo contato! Sua mensagem foi enviada com sucesso para nossa equipe.";
            formMessage.classList.add('success');
            formMessage.style.display = 'block';
            contactForm.reset();

        } catch (error) {
            console.error('Form Final Error:', error);
            formMessage.textContent = "Não foi possível enviar sua mensagem após várias tentativas. Por favor, verifique sua conexão ou chame no WhatsApp.";
            formMessage.classList.add('error');
            formMessage.style.display = 'block';
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
