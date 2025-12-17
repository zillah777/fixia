import { NextResponse } from "next/server"
import DOMPurify from "isomorphic-dompurify"
import { z } from "zod"

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Zod schema for validation
const contactSchema = z.object({
    name: z.string().trim().min(2, "Nombre debe tener al menos 2 caracteres").max(50, "Nombre muy largo"),
    lastname: z.string().trim().min(2, "Apellido debe tener al menos 2 caracteres").max(50, "Apellido muy largo"),
    email: z.string().email("Email inválido"),
    subject: z.string().trim().min(5, "Asunto debe tener al menos 5 caracteres").max(100, "Asunto muy largo"),
    message: z.string().trim().min(10, "Mensaje debe tener al menos 10 caracteres").max(5000, "Mensaje muy largo"),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate with Zod
        const validation = contactSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0]?.message || "Datos inválidos" },
                { status: 400 }
            )
        }

        const { name, lastname, email, subject, message } = validation.data

        // SECURITY: Sanitize all user inputs to prevent XSS in email
        const sanitizedName = DOMPurify.sanitize(name)
        const sanitizedLastname = DOMPurify.sanitize(lastname)
        const sanitizedEmail = DOMPurify.sanitize(email)
        const sanitizedSubject = DOMPurify.sanitize(subject)
        const sanitizedMessage = DOMPurify.sanitize(message)

        // SECURITY: Escape HTML entities in message for safe display
        const escapedMessage = sanitizedMessage
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/\n/g, "<br>")

        const resendKey = process.env.RESEND_API_KEY
        if (!resendKey) {
            console.error("[CONTACT] RESEND_API_KEY not configured")
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
                subject: `[Contacto] ${sanitizedSubject}`,
                html: `
                    <h2>Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${sanitizedName} ${sanitizedLastname}</p>
                    <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
                    <p><strong>Asunto:</strong> ${sanitizedSubject}</p>
                    <hr>
                    <p><strong>Mensaje:</strong></p>
                    <p>${escapedMessage}</p>
                `
            })
        })

        if (!emailResponse.ok) {
            const errorText = await emailResponse.text()
            console.error("[CONTACT] Resend API error:", errorText)
            return NextResponse.json(
                { error: "Error al enviar el email" },
                { status: 500 }
            )
        }

        console.log(`[CONTACT] Email received from ${sanitizedEmail}`)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[CONTACT_ERROR]", error)
        return NextResponse.json(
            { error: "Error al procesar el formulario" },
            { status: 500 }
        )
    }
}
