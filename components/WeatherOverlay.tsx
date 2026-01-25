
import React, { useEffect, useRef } from 'react';
import { WeatherType } from '../types';

interface WeatherOverlayProps {
    type: WeatherType;
    time: number;
}

interface Particle {
    x: number;
    y: number;
    speed: number;
    size: number;
    drift: number;
    opacity: number;
    length: number;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ type, time }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const handleResize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        let particles: Particle[] = [];
        
        const createParticle = (isInitial = false): Particle => {
            const size = type === 'snow' ? Math.random() * 3 + 1 : Math.random() * 1.5 + 0.5;
            const opacityMod = time > 80 || time < 20 ? 0.3 : 0.6; // Slightly less visible at night for realism
            return {
                x: Math.random() * w,
                y: isInitial ? Math.random() * h : -20,
                speed: type === 'snow' ? Math.random() * 1.5 + 1 : Math.random() * 15 + 20,
                size: size,
                drift: type === 'snow' ? Math.random() * 2 - 1 : (Math.random() * 0.5 - 0.25),
                opacity: (Math.random() * 0.4 + 0.1) * opacityMod,
                length: type === 'rain' ? Math.random() * 20 + 20 : 0
            };
        };

        const initParticles = () => {
            const count = type === 'rain' ? 150 : type === 'snow' ? 200 : 0;
            particles = Array.from({ length: count }, () => createParticle(true));
        };

        initParticles();

        const loop = () => {
            ctx.clearRect(0, 0, w, h);
            
            if (type === 'clear') return;

            particles.forEach((p, i) => {
                p.y += p.speed;
                p.x += p.drift;
                
                if (type === 'rain') {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + p.drift * 2, p.y + p.length);
                    ctx.strokeStyle = `rgba(186, 230, 253, ${p.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                } else if (type === 'snow') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity + 0.2})`;
                    ctx.fill();
                }

                if (p.y > h + 50) {
                    particles[i] = createParticle();
                }
            });
            
            animationFrameId = requestAnimationFrame(loop);
        };
        
        loop();
        
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [type, time]);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-1000" 
            style={{ opacity: type === 'clear' ? 0 : 1 }}
        />
    );
};

export default WeatherOverlay;
