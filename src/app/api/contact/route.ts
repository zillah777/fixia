import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { name, lastname, email, subject, message } = await request.json()

        // Validate required fields
        if (!name || !lastname || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Todos los campos son requeridos" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 400 }
            )
        }

        // Send email using Resend
        const resendKey = process.env.RESEND_API_KEY
        if (!resendKey) {
            console.error("RESEND_API_KEY is not configured")
            return NextResponse.json(
                { error: "Servicio de email no configurado" },
                { status: 500 }
            )
        }

        const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendKey}`
            },
            body: JSON.stringify({
                from: "Fixia Contacto <noreply@fixia.app>",
                to: "soporte@fixia.app",
                subject: `[Contacto] ${subject}`,
                html: `
                    <h2>Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${name} ${lastname}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Asunto:</strong> ${subject}</p>
                    <hr>
                    <p><strong>Mensaje:</strong></p>
                    <p>${message.replace(/\n/g, "<br>")}</p>
                `
            })
        })

        if (!emailResponse.ok) {
            console.error("Resend API error:", await emailResponse.text())
            return NextResponse.json(
                { error: "Error al enviar el email" },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in contact form:", error)
        return NextResponse.json(
            { error: "Error al procesar el formulario" },
            { status: 500 }
        )
    }
}
