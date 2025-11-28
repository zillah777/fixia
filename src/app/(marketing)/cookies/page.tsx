export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
                <p className="text-lg text-muted-foreground">
                    Última actualización: {new Date().toLocaleDateString()}
                </p>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las cookies?</h2>
                    <p className="text-muted-foreground">
                        Las cookies son pequeños archivos de texto que los sitios web que visitas guardan en tu ordenador o dispositivo móvil. Permiten que el sitio web recuerde tus acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) durante un período de tiempo, para que no tengas que volver a introducirlas cada vez que regreses al sitio o navegues de una página a otra.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. ¿Cómo utilizamos las cookies?</h2>
                    <p className="text-muted-foreground">
                        Utilizamos cookies para:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>Mantener tu sesión iniciada.</li>
                        <li>Recordar tus preferencias y configuraciones.</li>
                        <li>Entender cómo utilizas nuestro sitio web para mejorarlo.</li>
                        <li>Personalizar el contenido y los anuncios que ves.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Tipos de cookies que utilizamos</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-lg">Cookies esenciales</h3>
                            <p className="text-muted-foreground">Necesarias para el funcionamiento básico del sitio.</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Cookies de rendimiento</h3>
                            <p className="text-muted-foreground">Nos ayudan a entender cómo interactúan los visitantes con el sitio.</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Cookies funcionales</h3>
                            <p className="text-muted-foreground">Permiten recordar tus preferencias.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
