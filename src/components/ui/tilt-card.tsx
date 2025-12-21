"use client"

import { motion, useTransform, useMotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    style?: React.CSSProperties
}

export function TiltCard({ children, className, onClick, style }: TiltCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left - width / 2);
        mouseY.set(clientY - top - height / 2);
    }

    return (
        <motion.div
            className={cn("relative overflow-hidden", className)}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
            style={{
                ...style,
                transformStyle: "preserve-3d",
                rotateX: useTransform(mouseY, [-300, 300], [10, -10]),
                rotateY: useTransform(mouseX, [-300, 300], [-10, 10]),
            }}
        >
            {children}
        </motion.div>
    );
}
