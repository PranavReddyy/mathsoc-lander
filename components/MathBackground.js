"use client";

import React, { useEffect, useRef } from 'react';

export function MathBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set canvas to full window size
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };

        // Resize initially and on window resize
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Math symbols
        const symbols = [
            'π', '∫', '∑', '√', 'e', '∞', 'Δ', 'λ', 'θ', 'Ω', '∂', '≈', '≠', '±', '∇', 'φ',
            '∈', '∀', '∃', 'α', 'β', 'γ', '∏', '⊂', '⊃'
        ];

        // Simple particles
        const particles = [];
        const particleCount = Math.min(window.innerWidth / 15, 60);

        // Create symbol particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 22 + 18, // Larger symbols (was 14 + 10)
                speedX: (Math.random() - 0.5) * 0.4,
                speedY: (Math.random() - 0.5) * 0.4,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                opacity: Math.random() * 0.3 + 0.1,
                hue: Math.random() * 40 + 210 // Blue to purple range
            });
        }

        // Connection parameters
        const connectionDistance = 150;
        const connectionOpacity = 0.05;

        // Animation loop
        const animate = () => {
            // Clear canvas completely
            ctx.fillStyle = document.documentElement.classList.contains('dark')
                ? 'rgba(0, 0, 0, 1)'
                : 'rgba(255, 255, 255, 1)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            // Make sure connections are more visible
            const connectionOpacity = 0.3; // Slightly increased from 0.05

            // Draw connections between nearby particles - fix the drawing
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * connectionOpacity;
                        ctx.beginPath(); // Begin a new path for each connection
                        ctx.strokeStyle = document.documentElement.classList.contains('dark')
                            ? `rgba(100, 150, 255, ${opacity})`
                            : `rgba(30, 80, 200, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke(); // Stroke each connection individually
                    }
                }
            }
            ctx.stroke();

            // Update and draw particles
            particles.forEach(particle => {
                // Move particles
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Wrap around edges
                if (particle.x < -50) particle.x = window.innerWidth + 50;
                if (particle.x > window.innerWidth + 50) particle.x = -50;
                if (particle.y < -50) particle.y = window.innerHeight + 50;
                if (particle.y > window.innerHeight + 50) particle.y = -50;

                // Draw the symbol
                const isDark = document.documentElement.classList.contains('dark');
                const hue = isDark ? particle.hue : particle.hue - 20;
                const sat = isDark ? '80%' : '70%';
                const light = isDark ? '70%' : '40%';

                ctx.fillStyle = `hsla(${hue}, ${sat}, ${light}, ${particle.opacity})`;
                ctx.font = `${particle.size}px "Times New Roman", serif`;
                ctx.fillText(particle.symbol, particle.x, particle.y);
            });

            animationFrameId = window.requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}