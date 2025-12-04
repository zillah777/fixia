import React from "react";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-6">
                    Última actualización: {new Date().toLocaleDateString('es-AR')}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
                    <p>
                        Bienvenido a Fixia. Al acceder a nuestro sitio web y utilizar nuestros servicios,
                        aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos detenidamente.
                        Si no estás de acuerdo con estos términos, no debes utilizar nuestra plataforma.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Definiciones</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>&quot;Plataforma&quot;:</strong> Se refiere al sitio web y aplicación de Fixia.</li>
                        <li><strong>&quot;Usuario&quot;:</strong> Cualquier persona que acceda a la Plataforma.</li>
                        <li><strong>&quot;Cliente&quot;:</strong> Usuario que solicita servicios.</li>
                        <li><strong>&quot;Profesional&quot;:</strong> Usuario que ofrece servicios.</li>
                        <li><strong>&quot;Servicio&quot;:</strong> Cualquier tarea, trabajo o prestación ofrecida por un Profesional.</li>
                        <li><strong>&quot;Match&quot;:</strong> Conexión establecida entre un Cliente y un Profesional.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Uso del Servicio</h2>
                    <p className="mb-4">
                        Fixia actúa como un intermediario que conecta a Clientes con Profesionales.
                        No somos responsables directos de la calidad, seguridad o legalidad de los servicios prestados por los Profesionales,
                        aunque nos esforzamos por mantener altos estándares de calidad mediante nuestro sistema de verificación y reseñas.
                    </p>
                    <p className="mb-4">
                        <strong>Los Usuarios se comprometen a:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Proporcionar información veraz y actualizada</li>
                        <li>No utilizar la plataforma para actividades ilegales o fraudulentas</li>
                        <li>Respetar los derechos de propiedad intelectual</li>
                        <li>Mantener un comportamiento respetuoso con otros usuarios</li>
                        <li>No compartir credenciales de acceso con terceros</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Cuentas y Seguridad</h2>
                    <p className="mb-4">
                        Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
                        Notifícanos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
                    </p>
                    <p>
                        Nos reservamos el derecho de suspender o cancelar cuentas que violen estos términos
                        o que presenten actividad sospechosa.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Pagos y Suscripciones</h2>
                    <p className="mb-4">
                        Los Profesionales pueden estar sujetos a tarifas de suscripción para acceder a ciertas funcionalidades.
                        Los pagos se procesan de forma segura a través de MercadoPago.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Las suscripciones se renuevan automáticamente a menos que se cancelen</li>
                        <li>Los reembolsos se manejan caso por caso según nuestra política</li>
                        <li>Fixia no es responsable de disputas de pago entre Clientes y Profesionales</li>
                        <li>Todos los precios están expresados en pesos argentinos (ARS)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Responsabilidades del Profesional</h2>
                    <p className="mb-4">Los Profesionales se comprometen a:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Contar con las licencias y permisos necesarios para prestar sus servicios</li>
                        <li>Cumplir con las leyes laborales y fiscales aplicables</li>
                        <li>Mantener un seguro de responsabilidad civil cuando sea requerido</li>
                        <li>Responder de manera oportuna a las solicitudes de los Clientes</li>
                        <li>Proporcionar servicios de calidad profesional</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">7. Responsabilidades del Cliente</h2>
                    <p className="mb-4">Los Clientes se comprometen a:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Proporcionar información precisa sobre el servicio requerido</li>
                        <li>Permitir acceso seguro al lugar donde se prestará el servicio</li>
                        <li>Pagar los servicios acordados de manera oportuna</li>
                        <li>Dejar reseñas honestas y constructivas</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
                    <p className="mb-4">
                        Fixia no será responsable por:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Daños o pérdidas resultantes de servicios prestados por Profesionales</li>
                        <li>Disputas entre Clientes y Profesionales</li>
                        <li>Interrupciones del servicio por mantenimiento o causas de fuerza mayor</li>
                        <li>Pérdida de datos o contenido generado por usuarios</li>
                        <li>Daños indirectos, incidentales o consecuentes</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">9. Propiedad Intelectual</h2>
                    <p>
                        Todo el contenido de la plataforma (diseño, código, logos, textos) es propiedad de Fixia
                        y está protegido por leyes de propiedad intelectual. Los usuarios conservan los derechos
                        sobre el contenido que publican (fotos de portafolio, descripciones), pero otorgan a Fixia
                        una licencia para usar dicho contenido en la plataforma.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">10. Resolución de Disputas</h2>
                    <p className="mb-4">
                        En caso de disputas entre usuarios, recomendamos intentar resolverlas de manera amistosa.
                        Fixia puede actuar como mediador, pero no está obligado a hacerlo.
                    </p>
                    <p>
                        Para disputas legales, se aplicará la legislación argentina y serán competentes
                        los tribunales de la Ciudad de Rawson, Chubut.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">11. Cancelación de Cuenta</h2>
                    <p>
                        Los usuarios pueden cancelar su cuenta en cualquier momento desde la configuración.
                        Fixia se reserva el derecho de cancelar cuentas que violen estos términos.
                        Los datos se conservarán según nuestra Política de Privacidad.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">12. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
                        El uso continuado de la plataforma después de las modificaciones constituye aceptación de los nuevos términos.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">13. Contacto</h2>
                    <p>
                        Para preguntas sobre estos términos, contáctanos en:{' '}
                        <a href="mailto:legal@fixia.app" className="text-primary hover:underline">
                            legal@fixia.app
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
