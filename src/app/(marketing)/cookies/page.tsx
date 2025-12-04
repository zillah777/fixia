import React from "react";

export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-6">
                    Última actualización: {new Date().toLocaleDateString('es-AR')}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">¿Qué son las cookies?</h2>
                    <p>
                        Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web.
                        Se utilizan ampliamente para hacer que los sitios web funcionen de manera más eficiente y proporcionar
                        información a los propietarios del sitio.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">¿Cómo usamos las cookies?</h2>
                    <p className="mb-4">
                        Fixia utiliza cookies para:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Funcionalidad esencial:</strong> Mantener tu sesión activa y recordar tus preferencias</li>
                        <li><strong>Seguridad:</strong> Proteger tu cuenta y prevenir fraudes</li>
                        <li><strong>Análisis:</strong> Entender cómo usas la plataforma para mejorarla</li>
                        <li><strong>Personalización:</strong> Recordar tus preferencias de idioma y tema</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Tipos de cookies que utilizamos</h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">1. Cookies Estrictamente Necesarias</h3>
                        <p className="mb-2">
                            Estas cookies son esenciales para que puedas navegar por el sitio web y usar sus funciones.
                            Sin estas cookies, no podríamos proporcionar servicios básicos.
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><code>session_token</code> - Mantiene tu sesión activa</li>
                            <li><code>csrf_token</code> - Protección contra ataques CSRF</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">2. Cookies de Preferencias</h3>
                        <p className="mb-2">
                            Estas cookies permiten que el sitio web recuerde tus elecciones y proporcione funciones mejoradas.
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><code>theme</code> - Recuerda si prefieres modo oscuro o claro</li>
                            <li><code>language</code> - Recuerda tu idioma preferido</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">3. Cookies de Análisis</h3>
                        <p className="mb-2">
                            Estas cookies nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><code>_ga</code> - Google Analytics (si está habilitado)</li>
                            <li><code>analytics_consent</code> - Registro de tu consentimiento para análisis</li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Cookies de terceros</h2>
                    <p className="mb-4">
                        Algunos de nuestros socios pueden establecer cookies en tu dispositivo cuando usas Fixia:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>MercadoPago:</strong> Para procesar pagos de forma segura</li>
                        <li><strong>Cloudinary:</strong> Para optimizar la carga de imágenes</li>
                        <li><strong>Google Analytics:</strong> Para análisis de uso (solo con tu consentimiento)</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Gestión de cookies</h2>
                    <p className="mb-4">
                        Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies
                        que ya están en tu dispositivo y puedes configurar la mayoría de los navegadores para evitar
                        que se coloquen.
                    </p>
                    <p className="mb-4">
                        <strong>Para gestionar cookies en tu navegador:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                        <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
                        <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
                        <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Ten en cuenta que si deshabilitas las cookies, algunas funciones del sitio pueden no funcionar correctamente.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Tu consentimiento</h2>
                    <p>
                        Al usar nuestro sitio web, aceptas el uso de cookies de acuerdo con esta política.
                        Si no aceptas el uso de estas cookies, desactívalas siguiendo las instrucciones de tu navegador
                        o abstente de usar el sitio.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Cambios en esta política</h2>
                    <p>
                        Podemos actualizar esta Política de Cookies ocasionalmente. Te notificaremos sobre cambios
                        significativos publicando la nueva política en esta página y actualizando la fecha de
                        &quot;Última actualización&quot;.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
                    <p>
                        Si tienes preguntas sobre nuestra Política de Cookies, contáctanos en:{' '}
                        <a href="mailto:privacy@fixia.app" className="text-primary hover:underline">
                            privacy@fixia.app
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
