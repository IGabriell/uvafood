import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Play, Pause, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SCENES = [
  {
    id: 1,
    emoji: '🔍',
    bg: 'from-orange-400 to-amber-400',
    title: 'Explore nosso cardápio',
    desc: 'Navegue por dezenas de pratos deliciosos. Use a busca ou filtre por categoria — Combos, Batatas, Grelhados e muito mais!',
    detail: 'Mais de 15 pratos disponíveis com fotos reais e avaliações verificadas de clientes.',
    tag: 'PASSO 1',
  },
  {
    id: 2,
    emoji: '🛒',
    bg: 'from-primary to-orange-500',
    title: 'Monte seu pedido',
    desc: 'Clique em "Pedir" para adicionar ao carrinho. Escolha quantidades, combos e não esqueça da batata com cheddar!',
    detail: 'Seu carrinho fica salvo mesmo se você fechar o app. Sem pressão!',
    tag: 'PASSO 2',
  },
  {
    id: 3,
    emoji: '💳',
    bg: 'from-amber-500 to-yellow-500',
    title: 'Finalize em segundos',
    desc: 'PIX com 5% de desconto, cartão de crédito em até 3x, débito ou dinheiro. Entrega grátis acima de R$ 40!',
    detail: 'Seu pedido é confirmado na hora e o preparo começa imediatamente.',
    tag: 'PASSO 3',
  },
  {
    id: 4,
    emoji: '🗺️',
    bg: 'from-green-500 to-teal-500',
    title: 'Acompanhe no mapa',
    desc: 'Após o pedido, veja seu entregador em tempo real no mapa do Rio de Janeiro. Saiba exatamente quando vai chegar!',
    detail: 'Estimativa precisa, atualizada a cada minuto. Nunca mais fique sem saber onde está seu pedido.',
    tag: 'PASSO 4',
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export function WelcomeVideoModal() {
  const { isAuthenticated, user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const particleRef = useRef<ReturnType<typeof setInterval>>();
  const particleIdRef = useRef(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    const key = `uvafood_welcome_${user?.id ?? 'anon'}`;
    const seen = localStorage.getItem(key);
    if (!seen) setVisible(true);
  }, [isAuthenticated, user]);

  // Auto-advance + progress bar
  useEffect(() => {
    if (!playing || !visible) { clearInterval(timerRef.current); return; }
    const DURATION = 5000;
    const tick = 50;
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += tick;
      setProgress(elapsed / DURATION * 100);
      if (elapsed >= DURATION) {
        elapsed = 0;
        setScene(s => {
          if (s >= SCENES.length - 1) {
            setPlaying(false);
            clearInterval(timerRef.current);
            return s;
          }
          return s + 1;
        });
        setProgress(0);
      }
    }, tick);
    return () => clearInterval(timerRef.current);
  }, [playing, visible, scene]);

  // Particle emitter for active scene
  useEffect(() => {
    if (!visible) return;
    clearInterval(particleRef.current);
    const COLORS = ['#E85D04', '#FF9500', '#FFD60A', '#fff', '#FDBA74'];
    particleRef.current = setInterval(() => {
      const newP: Particle = {
        id: particleIdRef.current++,
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -1 - Math.random() * 2,
        size: 4 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      };
      setParticles(prev => [...prev.slice(-25), newP]);
    }, 200);
    return () => clearInterval(particleRef.current);
  }, [visible, scene]);

  const handleClose = () => {
    const key = `uvafood_welcome_${user?.id ?? 'anon'}`;
    localStorage.setItem(key, '1');
    setVisible(false);
    clearInterval(timerRef.current);
    clearInterval(particleRef.current);
  };

  const handleNext = () => {
    if (scene >= SCENES.length - 1) { handleClose(); return; }
    setScene(s => s + 1);
    setProgress(0);
  };

  if (!visible) return null;
  const current = SCENES[scene];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

      <div className="relative w-full max-w-lg mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Video-player chrome: top bar */}
        <div className="bg-zinc-900 px-4 py-2.5 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded-md h-6 flex items-center px-3">
            <span className="text-zinc-400 text-xs font-mono">uvafood.app/como-usar</span>
          </div>
          <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="size-4" />
          </button>
        </div>

        {/* Scene display */}
        <div className={`bg-gradient-to-br ${current.bg} relative overflow-hidden h-52 flex flex-col items-center justify-center`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-2 border-white"
                style={{
                  width: `${60 + i * 30}px`,
                  height: `${60 + i * 30}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  opacity: 1 - i * 0.1,
                }}
              />
            ))}
          </div>

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p => (
              <div
                key={p.id}
                className="absolute rounded-full animate-ping"
                style={{
                  left: `${p.x + p.vx * 10}%`,
                  top: `${p.y + p.vy * 10}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>

          {/* Tag */}
          <span className="bg-white/25 text-white text-xs font-black px-3 py-1 rounded-full mb-4 tracking-wider">
            {current.tag}
          </span>

          {/* Main emoji */}
          <div
            className="text-7xl mb-3 select-none"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))', animation: 'bounce 1s infinite' }}
          >
            {current.emoji}
          </div>

          {/* Scene nav dots */}
          <div className="flex gap-2">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setScene(i); setProgress(0); }}
                className={`rounded-full transition-all duration-300 ${i === scene ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Text content */}
        <div className="px-7 py-6">
          <h3 className="text-2xl font-black mb-2 leading-tight">{current.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">{current.desc}</p>
          <p className="text-xs text-primary font-semibold">{current.detail}</p>
        </div>

        {/* Controls */}
        <div className="px-7 pb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying(p => !p)}
              className="w-9 h-9 bg-muted hover:bg-secondary rounded-full flex items-center justify-center transition-colors"
            >
              {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </button>
            <Volume2 className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">
              {scene + 1}/{SCENES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="text-sm text-muted-foreground hover:text-foreground font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              Pular
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/30"
            >
              {scene >= SCENES.length - 1 ? 'Começar! 🚀' : 'Próximo'}
              {scene < SCENES.length - 1 && <ChevronRight className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
