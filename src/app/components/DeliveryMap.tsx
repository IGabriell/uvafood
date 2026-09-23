import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Clock, CheckCircle, Star, Phone, ChevronRight } from 'lucide-react';
import type { Order } from '../contexts/CartContext';

interface Props {
  order: Order | null;
  onClose: () => void;
  embedded?: boolean;
}

const STATUSES = [
  { label: 'Pedido confirmado', icon: '✅', done: true },
  { label: 'Em preparo na cozinha', icon: '👨‍🍳', done: true },
  { label: 'Saiu para entrega', icon: '🛵', done: false, active: true },
  { label: 'Chegando em breve', icon: '📍', done: false },
];

// Rio de Janeiro SVG Map Data
// ViewBox: 0 0 700 480
// Centered around Zona Sul (Copacabana/Ipanema area)

// Main land polygon (simplified Rio coastline, Zona Sul focus)
const LAND = `
  M 0,0 L 700,0 L 700,480 L 0,480 Z
`;

// Ocean (south Atlantic)
const OCEAN = `
  M 0,370 Q 150,350 300,355 Q 420,360 540,345 Q 620,338 700,340
  L 700,480 L 0,480 Z
`;

// Guanabara Bay (upper right)
const BAY = `
  M 560,0 Q 640,40 680,100 Q 700,150 690,200 Q 670,240 640,250
  Q 610,255 580,240 Q 550,225 540,200 Q 530,170 545,140
  Q 555,110 570,80 Q 580,40 560,0 Z
`;

// Lagoa Rodrigo de Freitas (iconic oval lake)
const LAGOA_CX = 370, LAGOA_CY = 310, LAGOA_RX = 55, LAGOA_RY = 35;

// Mountains/hills
const MOUNTAINS = [
  // Corcovado (Cristo Redentor)
  `M 300,200 Q 315,160 330,150 Q 345,140 360,155 Q 370,165 365,185 Q 355,200 340,205 Q 320,208 300,200 Z`,
  // Pão de Açúcar peninsula hill
  `M 580,240 Q 590,215 610,205 Q 625,200 635,215 Q 640,228 630,245 Q 615,255 590,255 Z`,
  // Dois Irmãos hill
  `M 210,330 Q 222,305 238,298 Q 252,293 260,308 Q 265,320 255,335 Q 240,342 222,338 Z`,
  // Morro do Leme
  `M 490,320 Q 500,302 514,298 Q 525,296 530,310 Q 532,322 522,332 Q 508,336 494,330 Z`,
];

// Streets (main avenues)
const STREETS = [
  // Av. Atlântica (coastal road - bottom curve)
  { d: 'M 120,368 Q 200,355 280,350 Q 370,348 450,350 Q 510,352 565,348', stroke: '#FFFFFF', w: 3 },
  // Av. Nossa Senhora de Copacabana
  { d: 'M 120,372 Q 200,362 290,358 Q 380,356 460,358 Q 510,360 560,355', stroke: '#FFFFFF', w: 2 },
  // Av. Epitácio Pessoa (around Lagoa)
  { d: 'M 320,310 Q 340,285 370,275 Q 400,270 425,285 Q 445,300 445,320 Q 440,345 415,355 Q 390,360 365,350 Q 340,340 325,320 Z', stroke: '#FFFFFF', w: 2, fill: 'none' },
  // Av. Vieira Souto (Ipanema)
  { d: 'M 220,365 Q 300,356 380,355 Q 440,355 490,357', stroke: '#FBBF24', w: 2 },
  // Túnel Rebouças
  { d: 'M 300,240 Q 310,280 315,310', stroke: '#FCD34D', w: 2, dashed: true },
  // Av. das Américas direction (to Barra)
  { d: 'M 60,360 Q 100,355 150,358 Q 190,360 220,368', stroke: '#FFFFFF', w: 2 },
];

// Neighborhood labels
const LABELS = [
  { x: 480, y: 370, text: 'Copacabana', size: 11, bold: true },
  { x: 340, y: 375, text: 'Ipanema', size: 11, bold: true },
  { x: 210, y: 372, text: 'Leblon', size: 10 },
  { x: 80, y: 368, text: 'Barra da Tijuca', size: 9 },
  { x: 370, y: 310, text: 'Lagoa', size: 9 },
  { x: 250, y: 260, text: 'Tijuca', size: 9 },
  { x: 450, y: 220, text: 'Botafogo', size: 9 },
  { x: 570, y: 200, text: 'Flamengo', size: 9 },
  { x: 610, y: 140, text: 'Centro', size: 9 },
  { x: 320, y: 175, text: 'Corcovado 🏔', size: 9 },
  { x: 598, y: 228, text: 'Pão de Açúcar ⛰', size: 9 },
];

// Delivery route: Restaurant (Copacabana) → User (Ipanema)
const RESTAURANT = { x: 505, y: 363 };
const USER = { x: 345, y: 368 };
const ROUTE_D = `M ${RESTAURANT.x},${RESTAURANT.y} Q 460,352 420,358 Q 390,362 ${USER.x},${USER.y}`;

export function DeliveryMap({ order, onClose, embedded = false }: Props) {
  const activeOrder = order ?? { id: '#RIO202', items: [], total: 0, date: '', status: 'A caminho' as const };
  const [scooterPos, setScooterPos] = useState(0); // 0..1 along route
  const [eta, setEta] = useState(28);
  const [statusIdx, setStatusIdx] = useState(1);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 12000; // 12s full trip

  useEffect(() => {
    if (!order) return;
    startRef.current = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startRef.current) / DURATION, 1);
      setScooterPos(t);
      setEta(Math.max(0, Math.round(28 * (1 - t))));
      if (t > 0.5) setStatusIdx(2);
      if (t > 0.9) setStatusIdx(3);
      if (t < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [order]);

  // Compute scooter x,y along the bezier curve
  // Q control point: 440, 352
  const bx = (t: number) => {
    const p0x = RESTAURANT.x, p1x = 440, p2x = USER.x;
    return (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x;
  };
  const by = (t: number) => {
    const p0y = RESTAURANT.y, p1y = 352, p2y = USER.y;
    return (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y;
  };

  const scooterX = bx(scooterPos);
  const scooterY = by(scooterPos);


  const address = localStorage.getItem('uvafood_address') || 'Ipanema, Rio de Janeiro';

  return (
    <div className={embedded ? "h-full w-full" : "fixed inset-0 z-[9990] flex items-center justify-center"}>
      {!embedded && <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />}

      <div className={embedded ? "h-full w-full overflow-hidden bg-white" : "relative w-full max-w-2xl mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-100 uppercase tracking-wider">Rastreando ao vivo</span>
            </div>
            <h2 className="text-xl font-black">Pedido {activeOrder.id} a caminho! 🛵</h2>
            <p className="text-green-100 text-sm">{address}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black">{eta}</div>
            <div className="text-green-100 text-xs font-semibold">min restantes</div>
          </div>
          {!embedded && <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl p-2 transition-colors">
            <X className="size-5" />
          </button>}
        </div>

        {/* SVG Map */}
        <div className="relative bg-sky-100 overflow-hidden" style={{ height: '300px' }}>
          <svg viewBox="0 0 700 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            {/* Ocean */}
            <path d={OCEAN} fill="#60A5FA" opacity="0.8" />
            {/* Ocean shimmer */}
            <path d={OCEAN} fill="none" stroke="#93C5FD" strokeWidth="1" opacity="0.5" />

            {/* Land */}
            <rect x="0" y="0" width="700" height="480" fill="#D4EDDA" />
            <path d={OCEAN} fill="#60A5FA" />

            {/* Bay */}
            <path d={BAY} fill="#7DD3FC" />
            <path d={BAY} fill="none" stroke="#93C5FD" strokeWidth="1.5" />

            {/* Lagoa Rodrigo de Freitas */}
            <ellipse cx={LAGOA_CX} cy={LAGOA_CY} rx={LAGOA_RX} ry={LAGOA_RY} fill="#7DD3FC" />
            <ellipse cx={LAGOA_CX} cy={LAGOA_CY} rx={LAGOA_RX} ry={LAGOA_RY} fill="none" stroke="#93C5FD" strokeWidth="1.5" />

            {/* Mountains */}
            {MOUNTAINS.map((d, i) => (
              <path key={i} d={d} fill={i === 0 ? '#16A34A' : '#22C55E'} />
            ))}

            {/* Streets */}
            {STREETS.map((s, i) => (
              <path
                key={i} d={s.d}
                stroke={s.stroke} strokeWidth={s.w} fill={s.fill ?? 'none'}
                strokeDasharray={s.dashed ? '5,4' : undefined}
                opacity="0.85"
              />
            ))}

            {/* Beach strip */}
            <path d="M 100,370 Q 200,358 300,357 Q 400,357 500,358 Q 560,358 600,350" stroke="#FCD34D" strokeWidth="4" fill="none" opacity="0.7" />

            {/* Neighborhood labels */}
            {LABELS.map((l, i) => (
              <text
                key={i} x={l.x} y={l.y}
                textAnchor="middle"
                fontSize={l.size}
                fontWeight={l.bold ? '800' : '600'}
                fill="#1E3A5F"
                opacity="0.85"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {l.text}
              </text>
            ))}

            {/* Route path (drawn) */}
            <path
              d={ROUTE_D}
              fill="none"
              stroke="#E85D04"
              strokeWidth="3"
              strokeDasharray="8,5"
              opacity="0.7"
            />
            {/* Animated route progress */}
            <path
              d={ROUTE_D}
              fill="none"
              stroke="#E85D04"
              strokeWidth="4"
              strokeDasharray="200"
              strokeDashoffset={200 - 200 * scooterPos}
              opacity="0.9"
            />

            {/* Restaurant pin */}
            <g transform={`translate(${RESTAURANT.x}, ${RESTAURANT.y})`}>
              <circle cx="0" cy="0" r="14" fill="#E85D04" opacity="0.2" />
              <circle cx="0" cy="0" r="9" fill="#E85D04" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fill="white">🍔</text>
            </g>
            <text x={RESTAURANT.x} y={RESTAURANT.y - 18} textAnchor="middle" fontSize="9" fontWeight="700" fill="#E85D04" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Restaurante
            </text>

            {/* User location pin */}
            <g transform={`translate(${USER.x}, ${USER.y})`}>
              <circle cx="0" cy="-2" r="16" fill="#22C55E" opacity="0.2">
                <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="-2" r="9" fill="#16A34A" />
              <text x="0" y="2" textAnchor="middle" fontSize="10" fill="white">🏠</text>
            </g>
            <text x={USER.x} y={USER.y - 22} textAnchor="middle" fontSize="9" fontWeight="700" fill="#16A34A" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Seu endereço
            </text>

            {/* Animated scooter */}
            {scooterPos > 0 && scooterPos < 1 && (
              <g transform={`translate(${scooterX}, ${scooterY})`}>
                <circle cx="0" cy="-4" r="16" fill="white" opacity="0.95" />
                <circle cx="0" cy="-4" r="16" fill="none" stroke="#E85D04" strokeWidth="2" />
                <text x="0" y="0" textAnchor="middle" fontSize="14">🛵</text>
              </g>
            )}

            {/* Cristo Redentor icon */}
            <text x="330" y="150" textAnchor="middle" fontSize="16">✝️</text>
          </svg>

          {/* Map overlay: ETA badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" />
              <span className="font-black text-sm">{eta > 0 ? `${eta} min` : 'Chegando!'}</span>
            </div>
          </div>

          {/* Compass */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow text-xs font-black text-slate-600">
            N
          </div>
        </div>

        {/* Status timeline */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between relative">
            <div className="absolute top-3.5 left-3.5 right-3.5 h-0.5 bg-muted" />
            <div
              className="absolute top-3.5 left-3.5 h-0.5 bg-primary transition-all duration-1000"
              style={{ width: `${(statusIdx / (STATUSES.length - 1)) * 100}%` }}
            />
            {STATUSES.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-500 ${
                  i <= statusIdx
                    ? i === statusIdx
                      ? 'bg-primary border-primary text-white scale-110'
                      : 'bg-white border-primary'
                    : 'bg-muted border-border'
                }`}>
                  {i < statusIdx ? <CheckCircle className="size-4 text-primary" /> : <span>{s.icon}</span>}
                </div>
                <p className={`text-[10px] text-center leading-tight font-semibold ${i <= statusIdx ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary + entregador */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Entregador */}
            <div className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-xl shrink-0">
                🛵
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entregador</p>
                <p className="font-black text-sm">Carlos M.</p>
                <div className="flex items-center gap-1">
                  <Star className="size-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold">4.95</span>
                </div>
              </div>
            </div>

            {/* Pedido */}
            <div className="bg-secondary rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Pedido {activeOrder.id}</p>
              <p className="font-black text-primary text-lg">R$ {order.total.toFixed(2).replace('.', ',')}</p>
              <p className="text-xs text-muted-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)} itens</p>
            </div>
          </div>

          {/* Items preview */}
          <div className="space-y-2 mb-5">
            {order.items.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold flex-1 truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-xs text-muted-foreground">+{order.items.length - 3} mais itens</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 flex-1 justify-center bg-muted hover:bg-secondary text-sm font-bold py-3 rounded-2xl transition-colors border border-border hover:border-primary">
              <Phone className="size-4" />
              Ligar para entregador
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 flex-1 justify-center bg-primary hover:bg-primary/90 text-white text-sm font-black py-3 rounded-2xl transition-all hover:scale-[1.02] shadow-md shadow-primary/30"
            >
              Feito!
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
