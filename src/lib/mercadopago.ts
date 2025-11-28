import MercadoPagoConfig, { Preference } from 'mercadopago';

const accessToken = process.env.MP_ACCESS_TOKEN || '';

const client = new MercadoPagoConfig({ accessToken });

export const createPreference = async (title: string, price: number) => {
    const preference = new Preference(client);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return await preference.create({
        body: {
            items: [
                {
                    id: 'subscription-pro',
                    title: title,
                    quantity: 1,
                    unit_price: price,
                    currency_id: 'ARS',
                },
            ],
            back_urls: {
                success: `${appUrl}/dashboard/subscription/success`,
                failure: `${appUrl}/dashboard/subscription/failure`,
                pending: `${appUrl}/dashboard/subscription/pending`,
            },
            auto_return: 'approved',
        },
    });
};
