
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

    const n8nWebhook = "https://agente-n8n.qy9sqv.easypanel.host/webhook/lp-bruno-viana";

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
            name: formData.get('name'),
            contact: formData.get('contact'),
            company: formData.get('company'),
            interest: interestVal,
            source: 'static_form' // To distinguish from chat
        };

        try {
            const response = await fetch(n8nWebhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Success
                formMessage.textContent = "Recebemos seu interesse! Entraremos em contato em breve.";
                formMessage.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error('Erro no envio');
            }
        } catch (error) {
            console.error('Form Error:', error);
            formMessage.textContent = "Houve um erro ao enviar. Por favor, tente novamente ou chame no chat.";
            formMessage.classList.add('error');
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});
