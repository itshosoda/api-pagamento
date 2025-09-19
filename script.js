document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('pk_test_51S92pfPJWKcUaANNAu2Xh4lmGDH1Dmn6KLAty6zYnP3cyCx0yQjYFPsVM9P3ZacZYehlTZMGAg5n7QPERR46thB800iuHrksmj');

    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    const form = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-button');
    const cardErrors = document.getElementById('card-errors');
    const paymentStatusContainer = document.getElementById('payment-status-container');
    const paymentStatus = document.getElementById('payment-status');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        cardErrors.textContent = '';
        paymentStatus.textContent = '';
        paymentStatusContainer.classList.add('hidden');

        try {
            // Fetch the client secret from your server
            const response = await fetch('/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // You can pass amount, currency, etc. here
                    // For this example, we'll use a fixed amount on the server
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent.');
            }

            const { clientSecret } = await response.json();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                cardErrors.textContent = error.message;
                submitButton.disabled = false;
            } else {
                if (paymentIntent.status === 'succeeded') {
                    paymentStatus.textContent = 'Pagamento realizado com sucesso!';
                    paymentStatusContainer.classList.remove('hidden');
                    form.classList.add('hidden'); // Optionally hide the form
                }
            }
        } catch (err) {
            cardErrors.textContent = 'Ocorreu um erro ao processar o pagamento. Tente novamente.';
            submitButton.disabled = false;
        }
    });
});
