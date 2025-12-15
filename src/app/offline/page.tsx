import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 dark:bg-stone-950 p-4 text-center">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
                <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-full mb-6">
                    <WifiOff className="h-10 w-10 text-stone-400" />
                </div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Sin conexión</h1>
                <p className="text-stone-500 dark:text-stone-400 mb-8">
                    Parece que no tienes internet. Revisa tu conexión e intenta nuevamente.
                </p>
                <Button asChild className="w-full">
                    <Link href="/">Intentar recargar</Link>
                </Button>
            </div>
        </div>
    );
}
