import React from "react";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-6">
                    Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Información que Recopilamos</h2>
                    <p>Recopilamos información que nos proporcionas directamente, como:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Información de registro (nombre, email, contraseña).</li>
                        <li>Información de perfil (foto, biografía, ubicación).</li>
                        <li>Datos de transacciones y pagos.</li>
                        <li>Comunicaciones con otros usuarios a través de la plataforma.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Uso de la Información</h2>
                    <p>Utilizamos tu información para:</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Proporcionar, mantener y mejorar nuestros servicios.</li>
                        <li>Procesar transacciones y enviar notificaciones relacionadas.</li>
                        <li>Conectar a Clientes con Profesionales relevantes.</li>
                        <li>Detectar y prevenir fraudes.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Compartir Información</h2>
                    <p>
                        No vendemos tu información personal. Solo compartimos información con terceros en las siguientes circunstancias:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Con proveedores de servicios (ej. procesamiento de pagos).</li>
                        <li>Para cumplir con obligaciones legales.</li>
                        <li>Con tu consentimiento explícito.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Seguridad de Datos</h2>
                    <p>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado,
                        pérdida o alteración.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Contacto</h2>
                    <p>
                        Si tienes preguntas sobre esta política, contáctanos en <a href="mailto:privacy@fixia.app" className="text-primary hover:underline">privacy@fixia.app</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
