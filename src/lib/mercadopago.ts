import MercadoPagoConfig, { Preference, Payment } from 'mercadopago';

if (!process.env.MP_ACCESS_TOKEN) {
    console.warn("MP_ACCESS_TOKEN is not defined in environment variables");
}

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
    options: { timeout: 5000 }
});

export const preference = new Preference(client);
export const payment = new Payment(client);
export default client;
