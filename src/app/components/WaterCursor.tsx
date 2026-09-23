import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  type: 'move' | 'click';
}

export function WaterCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const frameRef = useRef<number>(0);
  const lastDropRef = useRef(0);
  const cursorRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastDropRef.current < 60) return;
      lastDropRef.current = now;
      dropsRef.current.push({
        x: e.clientX, y: e.clientY,
        radius: 0,
        maxRadius: 12 + Math.random() * 10,
        opacity: 0.35,
        speed: 0.6 + Math.random() * 0.4,
        type: 'move',
      });
    };

    const onClick = (e: MouseEvent) => {
      for (let i = 0; i < 4; i++) {
        dropsRef.current.push({
          x: e.clientX, y: e.clientY,
          radius: 0,
          maxRadius: 30 + i * 22,
          opacity: 0.55 - i * 0.08,
          speed: 1.4 + i * 0.4,
          type: 'click',
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cursor glow dot
      const { x, y } = cursorRef.current;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 14);
      grad.addColorStop(0, 'rgba(232, 93, 4, 0.25)');
      grad.addColorStop(1, 'rgba(232, 93, 4, 0)');
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw ripples
      dropsRef.current = dropsRef.current.filter(d => d.opacity > 0.01);
      for (const drop of dropsRef.current) {
        drop.radius += drop.speed;
        drop.opacity *= 0.965;

        const progress = drop.radius / drop.maxRadius;
        const alpha = drop.opacity * (1 - progress * 0.5);

        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);

        if (drop.type === 'click') {
          ctx.strokeStyle = `rgba(232, 93, 4, ${alpha})`;
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = `rgba(255, 149, 0, ${alpha * 0.8})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Inner shimmer for move drops
        if (drop.type === 'move' && drop.radius < 8) {
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 100, ${alpha * 0.3})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
