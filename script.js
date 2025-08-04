document.addEventListener('DOMContentLoaded', () => {
    const n8nInput = document.getElementById('n8nInput');
    const sendToN8nButton = document.getElementById('sendToN8n');
    const n8nReturn = document.getElementById('n8nReturn');
    const errorMessage = document.getElementById('errorMessage');

    // **BELANGRIJK: VERVANG DIT DOOR JOUW N8N WEBHOOK URL**
    const N8N_WEBHOOK_URL = 'https://arnoldvandel.app.n8n.cloud/webhook-test/ce572106-c45e-4ef5-a6c8-02a488d95969'; 

    sendToN8nButton.addEventListener('click', async () => {
        const inputValue = n8nInput.value.trim();
        n8nReturn.value = 'Bezig met versturen...';
        errorMessage.textContent = ''; // Clear previous errors

        if (!inputValue) {
            errorMessage.textContent = 'Voer alstublieft tekst in om te versturen.';
            n8nReturn.value = '';
            return;
        }

        if (N8N_WEBHOOK_URL === 'JOUW_N8N_WEBHOOK_URL_HIER' || !N8N_WEBHOOK_URL.startsWith('http')) {
            errorMessage.textContent = 'Fout: Configureer de N8N_WEBHOOK_URL in script.js.';
            n8nReturn.value = '';
            return;
        }

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: inputValue }),
            });

            if (!response.ok) {
                // Probeer de foutmelding van n8n te parsen indien beschikbaar
                let errorData = await response.text();
                try {
                    errorData = JSON.parse(errorData);
                } catch (e) {
                    // Not a JSON response
                }
                throw new Error(`HTTP fout! Status: ${response.status}. Antwoord: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            
            // Controleer of 'myField' bestaat in de ontvangen data
            if (data && typeof data.myField !== 'undefined') {
                n8nReturn.value = data.myField; // Toon alleen de waarde van 'myField'
            } else {
                n8nReturn.value = 'Geen "myField" gevonden in het antwoord.';
                console.warn('Antwoord van n8n bevat geen "myField":', data);
            }
        } catch (error) {
            console.error('Fout bij versturen naar n8n:', error);
            errorMessage.textContent = `Er is een fout opgetreden: ${error.message}`;
            n8nReturn.value = 'Fout bij communicatie met n8n.';
        }
    });
});
