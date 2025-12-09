import React, { useEffect, useRef } from 'react';
import './CinematicBackground.css';

const CinematicBackground = ({ mode = 'default', intensity = 1 }) => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const atomsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef(null);
    const intensityRef = useRef(intensity); // Use a ref for intensity to avoid re-running useEffect

    useEffect(() => {
        intensityRef.current = intensity;
    }, [intensity]);

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- QUANTUM ATOM CLASS ---
        class Atom {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 200 + 50; // Depth
                this.radius = Math.random() * 40 + 20;
                this.electrons = [];
                const electronCount = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < electronCount; i++) {
                    this.electrons.push({
                        angle: Math.random() * Math.PI * 2,
                        speed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
                        radius: this.radius * (Math.random() * 0.5 + 1),
                        tilt: Math.random() * Math.PI,
                        color: i % 2 === 0 ? '#4b90ff' : '#d96570'
                    });
                }
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.opacity = 0;
                this.state = 'forming'; // forming, stable, decaying
                this.life = 0;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;

                if (this.state === 'forming') {
                    this.opacity += 0.01;
                    if (this.opacity >= 0.8) this.state = 'stable';
                }

                // Wrap around
                if (this.x < -100) this.x = canvas.width + 100;
                if (this.x > canvas.width + 100) this.x = -100;
                if (this.y < -100) this.y = canvas.height + 100;
                if (this.y > canvas.height + 100) this.y = -100;

                // Update electrons
                this.electrons.forEach(e => {
                    e.angle += e.speed;
                });
            }

            draw(ctx, currentIntensity) {
                const scale = 200 / this.z; // Simple perspective
                const alpha = this.opacity * (mode === 'Chemini Advanced' ? 1 : 0.3) * currentIntensity;

                if (alpha <= 0.01) return;

                // Draw Nucleus
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 10 * scale);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.4, `rgba(155, 114, 203, ${alpha})`);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 15 * scale, 0, Math.PI * 2);
                ctx.fill();

                // Draw Electrons and Orbits
                this.electrons.forEach(e => {
                    // Orbit path (ellipse)
                    ctx.beginPath();
                    ctx.ellipse(
                        this.x, this.y,
                        e.radius * scale,
                        e.radius * scale * 0.4, // Flatten for 3D effect
                        e.tilt,
                        0, Math.PI * 2
                    );
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.1})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Electron
                    const ex = this.x + Math.cos(e.angle) * e.radius * scale * Math.cos(e.tilt) - Math.sin(e.angle) * (e.radius * scale * 0.4) * Math.sin(e.tilt);
                    const ey = this.y + Math.cos(e.angle) * e.radius * scale * Math.sin(e.tilt) + Math.sin(e.angle) * (e.radius * scale * 0.4) * Math.cos(e.tilt);

                    ctx.beginPath();
                    ctx.arc(ex, ey, 2 * scale, 0, Math.PI * 2);
                    ctx.fillStyle = e.color;
                    ctx.globalAlpha = alpha; // Apply intensity to electrons
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = e.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1; // Reset
                });
            }
        }

        // --- PARTICLE CLASS ---
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;

                const colors = [
                    { r: 75, g: 144, b: 255 },   // Blue
                    { r: 155, g: 114, b: 203 },  // Purple
                    { r: 217, g: 101, b: 112 },  // Pink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse repulsion
                const dx = mouseRef.current.x - this.x;
                const dy = mouseRef.current.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 2;
                    this.y -= (dy / dist) * force * 2;
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw(ctx, currentIntensity) {
                const alpha = this.opacity * currentIntensity;
                if (alpha <= 0.01) return;

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
                ctx.fill();
            }
        }

        // Initialize
        const init = () => {
            particlesRef.current = [];
            atomsRef.current = [];

            // More particles for cinematic mode
            const isMobile = window.innerWidth < 768;
            const baseCount = mode === 'Chemini Advanced' ? 150 : 60;
            const pCount = isMobile ? Math.floor(baseCount * 0.4) : baseCount;

            for (let i = 0; i < pCount; i++) particlesRef.current.push(new Particle());

            // Atoms only for cinematic mode
            if (mode === 'Chemini Advanced') {
                const atomCount = isMobile ? 4 : 8;
                for (let i = 0; i < atomCount; i++) atomsRef.current.push(new Atom());
            }
        };
        init();

        // Animation Loop
        const animate = () => {
            const currentIntensity = intensityRef.current;

            // Trail effect
            ctx.fillStyle = 'rgba(10, 10, 15, 0.2)'; // Leaves trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Particles
            particlesRef.current.forEach(p => {
                p.update();

                // Big Bang Effect: Scale position from center based on intensity
                // When intensity is 0, everything is at center. When 1, at normal position.
                // We use a non-linear ease for the explosion to make it pop
                const explosionScale = currentIntensity < 1
                    ? Math.pow(currentIntensity, 3) // Cubic ease in for "explosion" feel
                    : 1;

                const cx = canvas.width / 2;
                const cy = canvas.height / 2;

                // Temporarily override position for drawing
                const originalX = p.x;
                const originalY = p.y;

                p.x = cx + (p.x - cx) * explosionScale;
                p.y = cy + (p.y - cy) * explosionScale;

                p.draw(ctx, currentIntensity);

                // Restore position
                p.x = originalX;
                p.y = originalY;
            });

            // Draw Connections (Constellations)
            if (currentIntensity > 0.1) {
                ctx.lineWidth = 0.5;
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const explosionScale = currentIntensity < 1 ? Math.pow(currentIntensity, 3) : 1;

                for (let i = 0; i < particlesRef.current.length; i++) {
                    for (let j = i + 1; j < particlesRef.current.length; j++) {
                        const p1 = particlesRef.current[i];
                        const p2 = particlesRef.current[j];

                        // Calculate exploded positions
                        const p1x = cx + (p1.x - cx) * explosionScale;
                        const p1y = cy + (p1.y - cy) * explosionScale;
                        const p2x = cx + (p2.x - cx) * explosionScale;
                        const p2y = cy + (p2.y - cy) * explosionScale;

                        const dx = p1x - p2x;
                        const dy = p1y - p2y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100) {
                            const alpha = 0.15 * (1 - dist / 100) * currentIntensity;
                            if (alpha > 0) {
                                ctx.beginPath();
                                ctx.strokeStyle = `rgba(75, 144, 255, ${alpha})`;
                                ctx.moveTo(p1x, p1y);
                                ctx.lineTo(p2x, p2y);
                                ctx.stroke();
                            }
                        }
                    }
                }
            }

            // Draw Atoms (Cinematic Mode)
            atomsRef.current.forEach(a => {
                a.update();

                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const explosionScale = currentIntensity < 1 ? Math.pow(currentIntensity, 3) : 1;

                // Temporarily override position
                const originalX = a.x;
                const originalY = a.y;

                a.x = cx + (a.x - cx) * explosionScale;
                a.y = cy + (a.y - cy) * explosionScale;

                a.draw(ctx, currentIntensity);

                // Restore
                a.x = originalX;
                a.y = originalY;
            });

            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, [mode]); // Re-init on mode change. Intensity is handled via ref.

    return (
        <canvas ref={canvasRef} className="cinematic-canvas" />
    );
};

export default CinematicBackground;
