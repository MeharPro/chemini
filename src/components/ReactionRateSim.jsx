import React, { useEffect, useRef, useState } from 'react';
import { Flame, Beaker, Play, RotateCcw } from 'lucide-react';

const ReactionRateSim = () => {
    const canvasRef = useRef(null);
    const [temperature, setTemperature] = useState(50); // 0 to 100
    const [concentration, setConcentration] = useState(50); // Number of particles
    const [collisions, setCollisions] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    const particlesRef = useRef([]);
    const requestRef = useRef();

    // Particle Class
    class SimParticle {
        constructor(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = 4;
            this.color = Math.random() > 0.5 ? '#4b90ff' : '#d96570'; // Reactant A or B
            this.mass = 1;
        }

        update(temp, width, height) {
            const speedMultiplier = 0.5 + (temp / 100) * 2; // Speed based on temperature

            this.x += this.vx * speedMultiplier;
            this.y += this.vy * speedMultiplier;

            // Wall collisions
            if (this.x < this.radius) { this.x = this.radius; this.vx *= -1; }
            if (this.x > width - this.radius) { this.x = width - this.radius; this.vx *= -1; }
            if (this.y < this.radius) { this.y = this.radius; this.vy *= -1; }
            if (this.y > height - this.radius) { this.y = height - this.radius; this.vy *= -1; }
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            // Glow
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const initSimulation = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const count = 10 + Math.floor((concentration / 100) * 40);
        particlesRef.current = [];
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(new SimParticle(canvas.width, canvas.height));
        }
        setCollisions(0);
    };

    useEffect(() => {
        initSimulation();
    }, [concentration]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let lastTime = Date.now();
        let collisionCount = 0;

        const animate = () => {
            if (!isRunning) return;

            // Clear
            ctx.fillStyle = 'rgba(20, 21, 22, 0.3)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and Draw Particles
            particlesRef.current.forEach(p => {
                p.update(temperature, canvas.width, canvas.height);
                p.draw(ctx);
            });

            // Check Collisions (Naive O(N^2) for small N is fine)
            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < p1.radius + p2.radius) {
                        // Simple elastic collision response
                        // Just reverse velocities for visual effect simplicity
                        /* 
                           A proper physics engine would conserve momentum, 
                           but swapping velocities is good enough for a visual demo 
                           of "more heat = more chaos"
                        */
                        const tempVx = p1.vx;
                        const tempVy = p1.vy;
                        p1.vx = p2.vx;
                        p1.vy = p2.vy;
                        p2.vx = tempVx;
                        p2.vy = tempVy;

                        // Separate particles to prevent sticking
                        const overlap = (p1.radius + p2.radius - dist) / 2;
                        const nx = dx / dist;
                        const ny = dy / dist;
                        p1.x += nx * overlap;
                        p1.y += ny * overlap;
                        p2.x -= nx * overlap;
                        p2.y -= ny * overlap;

                        // React! (Flash effect)
                        if (p1.color !== p2.color) {
                            collisionCount++;
                            ctx.beginPath();
                            ctx.arc((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, 10, 0, Math.PI * 2);
                            ctx.fillStyle = '#fff';
                            ctx.fill();
                        }
                    }
                }
            }

            // Periodically update React state for UI (not every frame to save perf)
            if (Date.now() - lastTime > 1000) {
                setCollisions(prev => prev + collisionCount);
                collisionCount = 0;
                lastTime = Date.now();
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        if (isRunning) {
            requestRef.current = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(requestRef.current);
    }, [temperature, concentration, isRunning]);

    return (
        <div className="reaction-sim-container" style={{
            background: 'rgba(30, 31, 32, 0.8)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(168, 199, 250, 0.2)',
            fontFamily: 'Arial, sans-serif',
            color: '#e3e3e3'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#a8c7fa' }}>Interactive Collision Theory</h3>
                <div style={{ fontSize: '12px' }}>Collisions/sec: <span style={{ color: '#d96570', fontWeight: 'bold' }}>{collisions}</span></div>
            </div>

            <canvas
                ref={canvasRef}
                width={300}
                height={180}
                style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: '8px',
                    background: '#111',
                    marginBottom: '16px',
                    cursor: 'crosshair'
                }}
            />

            <div className="controls" style={{ display: 'grid', gap: '12px' }}>
                <div className="control-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Flame size={14} color="#d96570" /> Temperature</span>
                        <span>{temperature}°C</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={temperature}
                        onChange={(e) => setTemperature(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#d96570' }}
                    />
                </div>

                <div className="control-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Beaker size={14} color="#4b90ff" /> Concentration</span>
                        <span>{concentration}%</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={concentration}
                        onChange={(e) => setConcentration(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#4b90ff' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        style={{
                            flex: 1,
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                    >
                        {isRunning ? 'Pause' : <><Play size={14} /> Play</>}
                    </button>
                    <button
                        onClick={() => { setCollisions(0); initSimulation(); }}
                        style={{
                            flex: 1,
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                        }}
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReactionRateSim;
