'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Expanded set of math symbols for a richer animation
    const mathSymbols = ['π', '∫', '∑', '∞', '√', 'Δ', 'λ', 'Ω', '∂', '∇', 'ℝ', '∈', '⊆', '≡', '≤', '≥'];

    useEffect(() => {
        // Mark as client-side mounted to avoid hydration mismatch
        setMounted(true);

        // Shorter loading time for better UX
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Only render on client to avoid hydration mismatch
    if (!mounted) return null;

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {/* Wider animation area */}
                    <div className="relative h-60 w-60 flex items-center justify-center">
                        {/* Subtle radial gradient */}
                        <div className="absolute inset-0 opacity-40 bg-gradient-radial from-blue-500/5 to-transparent dark:from-blue-400/5"></div>

                        {/* Orbiting symbols with wider orbit */}
                        {mathSymbols.map((symbol, index) => {
                            // Calculate parameters based on index for consistency
                            const delay = index * 0.08; // Slightly faster delays
                            const duration = 2.2 + (index % 4) * 0.3; // Slightly faster durations
                            const angle = (index / mathSymbols.length) * 360;
                            const orbitSize = 70 + (index % 3) * 10; // Larger, varied orbits

                            return (
                                <motion.div
                                    key={index}
                                    className="absolute text-blue-600/60 dark:text-blue-400/60 font-serif"
                                    style={{ fontSize: '22px' }}
                                    initial={{
                                        opacity: 0,
                                        rotate: angle,
                                        x: 0,
                                        y: 0
                                    }}
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        rotate: [angle, angle + 360],
                                        x: [0, Math.cos(angle * Math.PI / 180) * orbitSize, 0],
                                        y: [0, Math.sin(angle * Math.PI / 180) * orbitSize, 0]
                                    }}
                                    transition={{
                                        duration: duration,
                                        delay: delay,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {symbol}
                                </motion.div>
                            );
                        })}

                        {/* Central pulsing symbol */}
                        <motion.div
                            className="text-blue-700 dark:text-blue-300 font-serif z-10"
                            style={{ fontSize: '32px' }}
                            animate={{
                                scale: [0.9, 1.1, 0.9],
                                opacity: [0.8, 1, 0.8],
                                rotateY: [0, 360]
                            }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            ∞
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}