import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-white border-t border-border/40 pt-16 pb-8">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight">Fixia</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            La plataforma líder para conectar profesionales de confianza con clientes que valoran la calidad.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Compañía</h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Carreras</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/press" className="text-muted-foreground hover:text-primary transition-colors">Prensa</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Servicios</h3>
                        <ul className="space-y-4">
                            <li><Link href="/services/plomeria" className="text-muted-foreground hover:text-primary transition-colors">Plomería</Link></li>
                            <li><Link href="/services/electricidad" className="text-muted-foreground hover:text-primary transition-colors">Electricidad</Link></li>
                            <li><Link href="/services/limpieza" className="text-muted-foreground hover:text-primary transition-colors">Limpieza</Link></li>
                            <li><Link href="/become-a-pro" className="text-muted-foreground hover:text-primary transition-colors">Ser Profesional</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookies</Link></li>
                            <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Centro de Ayuda</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © {new Date().getFullYear()} Fixia Inc. Todos los derechos reservados.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500" /> en Argentina
                    </p>
                </div>
            </div>
        </footer>
    )
}
