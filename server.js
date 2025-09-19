const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_51S92pfPJWKcUaANNnbriZSparNvLFwHvQ7GxLX9HWkRh9NS01hRxxkDHFMu0fzLlcHgknntBheOJiF1kGdufYoVN00q8Cr0QnR');

app.use(express.static('.'));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
    try {
        // Para este exemplo, o valor está fixo no servidor.
        // Em um aplicativo real, você calcularia o valor com base no carrinho de compras.
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Valor em centavos (ex: R$ 10,00)
            currency: 'brl',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
