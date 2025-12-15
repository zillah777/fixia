"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Share, PlusSquare, MoreVertical, Download, Menu } from "lucide-react"
import { useState, useEffect } from "react"

export function PWAInstallGuide({ trigger }: { trigger?: React.ReactNode }) {
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        setIsIOS(isIosDevice)
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="link" size="sm" className="text-xs text-muted-foreground">
                        ¿Cómo instalar?
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Instalar Fixia</DialogTitle>
                    <DialogDescription>
                        Sigue estos pasos para agregar Fixia a tu pantalla de inicio y usarla como una app nativa.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue={isIOS ? "ios" : "android"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="ios">iOS (iPhone/iPad)</TabsTrigger>
                        <TabsTrigger value="android">Android</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ios" className="space-y-4 py-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <Share className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">1. Toca el botón Compartir</h4>
                                <p className="text-xs text-muted-foreground">Busca el icono de compartir en la barra inferior de Safari.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <PlusSquare className="h-6 w-6 text-stone-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">2. Selecciona "Agregar a Inicio"</h4>
                                <p className="text-xs text-muted-foreground">Desliza hacia abajo en el menú hasta encontrar esta opción.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <span className="font-bold text-blue-500 text-lg px-1">Add</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">3. Confirma tocando "Agregar"</h4>
                                <p className="text-xs text-muted-foreground">¡Listo! Fixia aparecerá en tu pantalla de inicio.</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="android" className="space-y-4 py-4">
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <MoreVertical className="h-6 w-6 text-stone-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">1. Abre el menú del navegador</h4>
                                <p className="text-xs text-muted-foreground">Toca los tres puntos en la esquina superior derecha de Chrome.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <Download className="h-6 w-6 text-stone-900 dark:text-white" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">2. Toca "Instalar aplicación"</h4>
                                <p className="text-xs text-muted-foreground">O selecciona "Agregar a la pantalla principal".</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg">
                                <span className="font-bold text-stone-900 dark:text-white text-sm px-1">Instalar</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">3. Confirma la instalación</h4>
                                <p className="text-xs text-muted-foreground">Fixia se instalará y aparecerá en tu lista de apps.</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
