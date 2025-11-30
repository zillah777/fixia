import { Resend } from 'resend';

let resendInstance: Resend | null = null;

const getResend = () => {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured - emails will not be sent');
      // Return a mock instance that won't throw during build
      return {
        emails: {
          send: async () => {
            throw new Error('RESEND_API_KEY is not configured');
          }
        }
      } as any;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const confirmLink = `${appUrl}/api/verify?token=${token}`;
  const resend = getResend();
  const emailFrom = process.env.EMAIL_FROM || 'Fixia <onboarding@resend.dev>';

  try {
    const data = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: 'Verifica tu cuenta - Fixia',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Bienvenido a Fixia</h1>
          <p style="color: #666; font-size: 16px;">Gracias por registrarte. Para activar tu cuenta y comenzar a usar la plataforma, por favor verifica tu correo electrónico.</p>
          <div style="margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verificar Cuenta</a>
          </div>
          <p style="color: #999; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resend = getResend();
  const emailFrom = process.env.EMAIL_FROM || 'Fixia <onboarding@resend.dev>';

  try {
    const data = await resend.emails.send({
      from: emailFrom,
      to: [email],
      subject: '¡Bienvenido a Fixia!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">¡Hola, ${name}!</h1>
          <p style="color: #666; font-size: 16px;">Estamos muy contentos de que te hayas unido a Fixia. Ahora eres parte de la comunidad líder en servicios del hogar.</p>
          <p style="color: #666; font-size: 16px;">Explora los servicios, encuentra profesionales o publica tus propias habilidades.</p>
          <div style="margin: 30px 0;">
            <a href="${appUrl}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ir al Dashboard</a>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};
