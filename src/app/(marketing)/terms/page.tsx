import React from "react";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="lead text-xl text-muted-foreground mb-6">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
                    <p>
                        Bienvenido a Fixia. Al acceder a nuestro sitio web y utilizar nuestros servicios,
                        aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos detenidamente.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">2. Definiciones</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>"Plataforma":</strong> Se refiere al sitio web y aplicación de Fixia.</li>
                        <li><strong>"Usuario":</strong> Cualquier persona que acceda a la Plataforma.</li>
                        <li><strong>"Cliente":</strong> Usuario que solicita servicios.</li>
                        <li><strong>"Profesional":</strong> Usuario que ofrece servicios.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">3. Uso del Servicio</h2>
                    <p>
                        Fixia actúa como un intermediario que conecta a Clientes con Profesionales.
                        No somos responsables directos de la calidad, seguridad o legalidad de los servicios prestados por los Profesionales,
                        aunque nos esforzamos por mantener altos estándares de calidad mediante nuestro sistema de verificación y reseñas.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">4. Cuentas y Seguridad</h2>
                    <p>
                        Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
                        Notifícanos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">5. Pagos y Suscripciones</h2>
                    <p>
                        Los Profesionales pueden estar sujetos a tarifas de suscripción para acceder a ciertas funcionalidades.
                        Los pagos se procesan de forma segura a través de MercadoPago.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">6. Modificaciones</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
                    </p>
                </section>
            </div>
        </div>
    );
}
