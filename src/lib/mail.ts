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

const getAppUrl = () => {
  // Use the configured URL from environment, or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const appUrl = getAppUrl();
  const confirmLink = `${appUrl}/auth/verify-email?token=${token}`;
  const resend = getResend();

  try {
    const html = generateVerificationEmailHTML(confirmLink);
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: 'Verifica tu cuenta - Fixia',
      html,
    });
    console.log('[EMAIL_DEBUG] Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

const generateVerificationEmailHTML = (confirmLink: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Verifica tu cuenta - Fixia</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        img { border: 0; display: block; }
        p, h1, h2, h3 { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        @media only screen and (max-width: 640px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 16px !important; }
        }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .bg-light { background-color: #1a1a18 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757; letter-spacing: -0.5px;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">¡Bienvenido a Fixia!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #141413;">Gracias por registrarte. Para activar tu cuenta y comenzar a usar la plataforma, por favor verifica tu correo electrónico.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #d97757; border-radius: 8px; text-align: center;">
                                                    <a href="${confirmLink}" style="background-color: #d97757; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Verificar Cuenta</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px 0 0 0; border-top: 1px solid #b0aea5;">
                                    <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #b0aea5;">Si no creaste esta cuenta, puedes ignorar este correo de forma segura.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

export const sendWelcomeEmail = async (email: string, name: string) => {
  const appUrl = getAppUrl();
  const resend = getResend();

  try {
    const html = generateWelcomeEmailHTML(name, appUrl);
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: '¡Bienvenido a Fixia!',
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
};

const generateWelcomeEmailHTML = (name: string, appUrl: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>¡Bienvenido a Fixia!</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        p, h1, h2, h3 { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        @media only screen and (max-width: 640px) { .container { width: 100% !important; } }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">¡Hola, ${name}!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 20px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #141413;">Estamos muy contentos de que te hayas unido a Fixia. Ahora eres parte de la comunidad líder en servicios del hogar.</p>
                                    <p style="margin: 12px 0 0 0; font-size: 16px; line-height: 1.6; color: #141413;">Explora los servicios, encuentra profesionales o publica tus propias habilidades.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #d97757; border-radius: 8px; text-align: center;">
                                                    <a href="${appUrl}/dashboard" style="background-color: #d97757; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Ir al Dashboard</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const appUrl = getAppUrl();
  const resetLink = `${appUrl}/(auth)/reset-password/${token}`;
  const resend = getResend();

  try {
    const html = generatePasswordResetEmailHTML(resetLink);
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: 'Recupera tu contraseña - Fixia',
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
};

const generatePasswordResetEmailHTML = (resetLink: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Recupera tu contraseña - Fixia</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        p, h1, h2, h3 { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        @media only screen and (max-width: 640px) { .container { width: 100% !important; } }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">Recuperación de Contraseña</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #141413;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #d97757; border-radius: 8px; text-align: center;">
                                                    <a href="${resetLink}" style="background-color: #d97757; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Restablecer Contraseña</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- WARNING BOX -->
                            <tr>
                                <td style="padding: 24px; background-color: #e8e6dc; border-left: 4px solid #d97757; margin-top: 20px;">
                                    <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6; color: #141413;"><strong>⚠️ Seguridad:</strong> Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                                    <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">Este enlace expirará en 1 hora.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

export const sendRegistrationConfirmation = async (email: string, name: string, role: 'CLIENT' | 'PROFESSIONAL') => {
  const appUrl = getAppUrl();
  const resend = getResend();

  const roleText = role === 'CLIENT' ? 'cliente' : 'profesional';
  const nextSteps = role === 'CLIENT'
    ? 'Explora los servicios disponibles y encuentra al profesional perfecto para tus necesidades.'
    : 'Completa tu perfil, agrega tu portafolio y comienza a recibir solicitudes de clientes.';

  try {
    const html = generateRegistrationConfirmationHTML(name, roleText, nextSteps, appUrl, role);
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: `¡Registro Exitoso en Fixia! - ${role === 'CLIENT' ? 'Cliente' : 'Profesional'}`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error };
  }
};

const generateRegistrationConfirmationHTML = (name: string, roleText: string, nextSteps: string, appUrl: string, role: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>¡Registro Exitoso en Fixia!</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        p, h1, h2, h3, li { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        ul { margin: 0; padding-left: 20px; }
        li { margin: 8px 0; }
        @media only screen and (max-width: 640px) { .container { width: 100% !important; } }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">¡Bienvenido a Fixia, ${name}!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 20px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #141413;">Tu cuenta como <strong>${roleText}</strong> ha sido creada exitosamente.</p>
                                    <p style="margin: 12px 0 0 0; font-size: 16px; line-height: 1.6; color: #141413;">${nextSteps}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #d97757; border-radius: 8px; text-align: center;">
                                                    <a href="${appUrl}/dashboard" style="background-color: #d97757; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Ir al Dashboard</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- NEXT STEPS BOX -->
                            <tr>
                                <td style="padding: 24px; background-color: #e8e6dc; border-left: 4px solid #788c5d; margin-top: 20px;">
                                    <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #141413; font-weight: 600;">Próximos Pasos:</h3>
                                    <ul style="margin: 0; padding-left: 20px; color: #141413; line-height: 1.8; font-size: 14px;">
                                        ${role === 'PROFESSIONAL' ? `
                                            <li>Completa tu perfil profesional</li>
                                            <li>Agrega fotos de tus trabajos al portafolio</li>
                                            <li>Configura tus servicios y tarifas</li>
                                            <li>¡Comienza a recibir solicitudes!</li>
                                        ` : `
                                            <li>Busca profesionales por categoría</li>
                                            <li>Lee las reseñas de otros clientes</li>
                                            <li>Solicita servicios fácilmente</li>
                                            <li>Chatea directamente con profesionales</li>
                                        `}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

export const sendMatchNotification = async (
  email: string,
  clientName: string,
  professionalName: string,
  serviceName: string,
  matchId: string
) => {
  const appUrl = getAppUrl();
  const matchLink = `${appUrl}/dashboard/matches`;
  const resend = getResend();

  try {
    const html = generateMatchNotificationHTML(clientName, professionalName, serviceName, matchLink);
    const data = await resend.emails.send({
      from: 'Fixia <notifications@fixia.app>',
      to: [email],
      subject: `¡Nuevo Match! - ${serviceName}`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending match notification email:', error);
    return { success: false, error };
  }
};

const generateMatchNotificationHTML = (clientName: string, professionalName: string, serviceName: string, matchLink: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>¡Nuevo Match en Fixia!</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        p, h1, h2, h3 { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        @media only screen and (max-width: 640px) { .container { width: 100% !important; } }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">¡Tienes un Nuevo Match! 🎉</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 20px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #141413;"><strong>${clientName}</strong> y <strong>${professionalName}</strong> han hecho match para el servicio de <strong>${serviceName}</strong>.</p>
                                    <p style="margin: 12px 0 0 0; font-size: 16px; line-height: 1.6; color: #141413;">Ahora pueden chatear directamente para coordinar los detalles del servicio.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #788c5d; border-radius: 8px; text-align: center;">
                                                    <a href="${matchLink}" style="background-color: #788c5d; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Ver Match y Chatear</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- SUCCESS BOX -->
                            <tr>
                                <td style="padding: 24px; background-color: #e8e6dc; border-left: 4px solid #788c5d; margin-top: 20px;">
                                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #141413;"><strong>💡 Consejo:</strong> Responde rápido para asegurar el servicio. Los profesionales activos tienen más éxito en la plataforma.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

export const sendAppointmentReminder = async (
  email: string,
  userName: string,
  serviceName: string,
  appointmentDate: Date,
  professionalName: string
) => {
  const appUrl = getAppUrl();
  const dashboardLink = `${appUrl}/dashboard/requests`;
  const resend = getResend();

  const formattedDate = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(appointmentDate);

  try {
    const html = generateAppointmentReminderHTML(userName, serviceName, professionalName, formattedDate, dashboardLink);
    const data = await resend.emails.send({
      from: 'Fixia <notifications@fixia.app>',
      to: [email],
      subject: `Recordatorio: ${serviceName} - Mañana`,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
    return { success: false, error };
  }
};

const generateAppointmentReminderHTML = (userName: string, serviceName: string, professionalName: string, formattedDate: string, dashboardLink: string) => `
<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Recordatorio de Cita - Fixia</title>
    <style>
        body { margin: 0; padding: 16px; background-color: #faf9f5; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; width: 100%; }
        td { border-collapse: collapse; padding: 0; vertical-align: top; }
        p, h1, h2, h3 { margin: 0; padding: 0; }
        a { text-decoration: none; color: #d97757; }
        @media only screen and (max-width: 640px) { .container { width: 100% !important; } }
        @media (prefers-color-scheme: dark) {
            body { background-color: #141413 !important; }
            .text-dark { color: #faf9f5 !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 16px; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
        <tbody>
            <!-- HEADER -->
            <tr>
                <td style="padding: 24px 20px; background-color: #faf9f5; text-align: center;">
                    <p style="margin: 0; font-size: 24px; font-weight: 700; color: #d97757;">Fixia</p>
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 32px 20px; background-color: #faf9f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="padding: 0 0 24px 0;">
                                    <h1 style="margin: 0; font-size: 28px; line-height: 1.3; color: #141413; font-weight: 700;">Recordatorio de Cita 📅</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 20px 0;">
                                    <p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #141413;">Hola ${userName},</p>
                                    <p style="margin: 12px 0 0 0; font-size: 16px; line-height: 1.6; color: #141413;">Te recordamos que tienes una cita programada:</p>
                                </td>
                            </tr>
                            <!-- INFO BOX -->
                            <tr>
                                <td style="padding: 24px; background-color: #e8e6dc; border: 1px solid #b0aea5; border-radius: 8px; margin: 20px 0;">
                                    <p style="margin: 8px 0; font-size: 14px; color: #141413;"><strong>📌 Servicio:</strong> ${serviceName}</p>
                                    <p style="margin: 8px 0; font-size: 14px; color: #141413;"><strong>👤 Profesional:</strong> ${professionalName}</p>
                                    <p style="margin: 8px 0; font-size: 14px; color: #141413;"><strong>🕐 Fecha y Hora:</strong> ${formattedDate}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 0;">
                                    <table role="presentation" cellpadding="0" cellspacing="0">
                                        <tbody>
                                            <tr>
                                                <td style="background-color: #d97757; border-radius: 8px; text-align: center;">
                                                    <a href="${dashboardLink}" style="background-color: #d97757; color: #faf9f5; display: inline-block; font-size: 16px; font-weight: 600; line-height: 48px; text-align: center; text-decoration: none; width: 280px; mso-padding-alt: 12px 24px;">Ver Detalles de la Cita</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <!-- REMINDER TEXT -->
                            <tr>
                                <td style="padding: 24px 0 0 0; border-top: 1px solid #b0aea5;">
                                    <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #b0aea5;">Si necesitas cancelar o reprogramar, por favor contacta al profesional lo antes posible.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <!-- FOOTER -->
            <tr>
                <td style="padding: 32px 20px; background-color: #141413; text-align: center;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #b0aea5;">© 2025 Fixia. Todos los derechos reservados. | <a href="https://fixia.app/privacy" style="color: #b0aea5;">Privacidad</a> | <a href="https://fixia.app/terms" style="color: #b0aea5;">Términos</a></p>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;
