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
  // Always force production URL if we are in production mode, ignoring potentially bad env vars
  if (process.env.NODE_ENV === 'production') {
    return 'https://fixia.app';
  }
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const appUrl = getAppUrl();
  const confirmLink = `${appUrl}/api/verify?token=${token}`;
  const resend = getResend();

  try {
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
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
    console.log('[EMAIL_DEBUG] Verification email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error };
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const appUrl = getAppUrl();
  const resend = getResend();

  try {
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
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

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const appUrl = getAppUrl();
  const resetLink = `${appUrl}/reset-password?token=${token}`;
  const resend = getResend();

  try {
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: 'Recupera tu contraseña - Fixia',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Recuperación de Contraseña</h1>
          <p style="color: #666; font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Restablecer Contraseña</a>
          </div>
          <p style="color: #999; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p style="color: #999; font-size: 12px;">Este enlace expirará en 1 hora.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
};

export const sendRegistrationConfirmation = async (email: string, name: string, role: 'CLIENT' | 'PROFESSIONAL') => {
  const appUrl = getAppUrl();
  const resend = getResend();

  const roleText = role === 'CLIENT' ? 'cliente' : 'profesional';
  const nextSteps = role === 'CLIENT'
    ? 'Explora los servicios disponibles y encuentra al profesional perfecto para tus necesidades.'
    : 'Completa tu perfil, agrega tu portafolio y comienza a recibir solicitudes de clientes.';

  try {
    const data = await resend.emails.send({
      from: 'Fixia <onboarding@fixia.app>',
      to: [email],
      subject: `¡Registro Exitoso en Fixia! - ${role === 'CLIENT' ? 'Cliente' : 'Profesional'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">¡Bienvenido a Fixia, ${name}!</h1>
          <p style="color: #666; font-size: 16px;">Tu cuenta como <strong>${roleText}</strong> ha sido creada exitosamente.</p>
          <p style="color: #666; font-size: 16px;">${nextSteps}</p>
          <div style="margin: 30px 0;">
            <a href="${appUrl}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ir al Dashboard</a>
          </div>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 30px;">
            <h3 style="color: #333; margin-top: 0;">Próximos Pasos:</h3>
            <ul style="color: #666; line-height: 1.8;">
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
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error };
  }
};

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
    const data = await resend.emails.send({
      from: 'Fixia <notifications@fixia.app>',
      to: [email],
      subject: `¡Nuevo Match! - ${serviceName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">¡Tienes un Nuevo Match! 🎉</h1>
          <p style="color: #666; font-size: 16px;"><strong>${clientName}</strong> y <strong>${professionalName}</strong> han hecho match para el servicio de <strong>${serviceName}</strong>.</p>
          <p style="color: #666; font-size: 16px;">Ahora pueden chatear directamente para coordinar los detalles del servicio.</p>
          <div style="margin: 30px 0;">
            <a href="${matchLink}" style="background-color: #10b981; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver Match y Chatear</a>
          </div>
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin-top: 20px;">
            <p style="color: #166534; margin: 0; font-size: 14px;"><strong>💡 Consejo:</strong> Responde rápido para asegurar el servicio. Los profesionales activos tienen más éxito en la plataforma.</p>
          </div>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending match notification email:', error);
    return { success: false, error };
  }
};

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
    const data = await resend.emails.send({
      from: 'Fixia <notifications@fixia.app>',
      to: [email],
      subject: `Recordatorio: ${serviceName} - Mañana`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Recordatorio de Cita 📅</h1>
          <p style="color: #666; font-size: 16px;">Hola ${userName},</p>
          <p style="color: #666; font-size: 16px;">Te recordamos que tienes una cita programada:</p>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Servicio:</strong> ${serviceName}</p>
            <p style="margin: 5px 0;"><strong>Profesional:</strong> ${professionalName}</p>
            <p style="margin: 5px 0;"><strong>Fecha y Hora:</strong> ${formattedDate}</p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${dashboardLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver Detalles de la Cita</a>
          </div>
          <p style="color: #999; font-size: 14px;">Si necesitas cancelar o reprogramar, por favor contacta al profesional lo antes posible.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
    return { success: false, error };
  }
};
