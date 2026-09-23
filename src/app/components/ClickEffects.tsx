import { useEffect } from 'react';

interface Burst {
  x: number;
  y: number;
  id: number;
}

const COLORS = ['#E85D04', '#FF9500', '#FFD60A', '#FB923C', '#FDE68A', '#fff'];

function createBurst(x: number, y: number) {
  const container = document.getElementById('click-effects-root');
  if (!container) return;

  // Ripple ring
  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;width:0;height:0;
    border-radius:50%;pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);
    border:2.5px solid #E85D04;
    animation:click-ring 0.5s ease-out forwards;
  `;
  container.appendChild(ring);

  // Second ring
  const ring2 = document.createElement('div');
  ring2.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;width:0;height:0;
    border-radius:50%;pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);
    border:1.5px solid #FF9500;
    animation:click-ring2 0.65s ease-out 0.08s forwards;
  `;
  container.appendChild(ring2);

  // Particles
  const count = 8;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const dist = 30 + Math.random() * 35;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size = 4 + Math.random() * 5;

    const p = document.createElement('div');
    p.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${size}px;height:${size}px;
      border-radius:50%;pointer-events:none;z-index:9999;
      background:${color};
      transform:translate(-50%,-50%);
      animation:click-particle 0.55s ease-out forwards;
      --dx:${dx}px;--dy:${dy}px;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }

  // Flash dot
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:12px;height:12px;border-radius:50%;
    background:white;pointer-events:none;z-index:9999;
    transform:translate(-50%,-50%);
    animation:click-dot 0.3s ease-out forwards;
  `;
  container.appendChild(dot);

  setTimeout(() => { ring.remove(); ring2.remove(); dot.remove(); }, 700);
}

export function ClickEffects() {
  useEffect(() => {
    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes click-ring {
        0%   { width:0;height:0;opacity:0.9; }
        100% { width:80px;height:80px;opacity:0; }
      }
      @keyframes click-ring2 {
        0%   { width:0;height:0;opacity:0.6; }
        100% { width:120px;height:120px;opacity:0; }
      }
      @keyframes click-particle {
        0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
        100% { transform:translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity:0; }
      }
      @keyframes click-dot {
        0%   { transform:translate(-50%,-50%) scale(1);opacity:1; }
        100% { transform:translate(-50%,-50%) scale(3);opacity:0; }
      }
      @keyframes btn-pop {
        0%   { transform:scale(1); }
        40%  { transform:scale(0.93); }
        70%  { transform:scale(1.04); }
        100% { transform:scale(1); }
      }
    `;
    document.head.appendChild(style);

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Only on interactive elements
      const interactive = target.closest('button, a, [role="button"], input, select');
      if (interactive) {
        createBurst(e.clientX, e.clientY);
        // Micro-bounce on buttons
        const btn = target.closest('button, a');
        if (btn && btn instanceof HTMLElement) {
          btn.style.animation = 'none';
          requestAnimationFrame(() => {
            btn.style.animation = 'btn-pop 0.3s ease';
          });
          setTimeout(() => { if (btn) btn.style.animation = ''; }, 300);
        }
      }
    };

    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      style.remove();
    };
  }, []);

  return <div id="click-effects-root" className="fixed inset-0 pointer-events-none z-[9996]" />;
}
