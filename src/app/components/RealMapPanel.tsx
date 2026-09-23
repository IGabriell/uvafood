import { useEffect, useState } from 'react';
import { Crosshair, MapPin, Navigation, RefreshCw, Search, AlertCircle } from 'lucide-react';

export type Coordinates = { lat: number; lng: number };
const RIO = { lat: -22.9838, lng: -43.2116 };

export function RealMapPanel({ className = '', onLocationChange }: { className?: string; onLocationChange?: (point: Coordinates) => void }) {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied' | 'error'>('idle');
  const [address, setAddress] = useState('');
  const point = position ?? RIO;
  const locate = () => {
    if (!navigator.geolocation) { setStatus('error'); return; }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(({ coords }) => { const next = { lat: coords.latitude, lng: coords.longitude }; setPosition(next); setStatus('idle'); onLocationChange?.(next); }, () => setStatus('denied'), { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  };
  useEffect(() => { locate(); }, []);
  const manualAddress = () => { if (!address.trim()) return; localStorage.setItem('uvafood_address', address.trim()); setStatus('idle'); };
  const src = `https://www.google.com/maps?q=${point.lat},${point.lng}&z=14&output=embed`;
  return <div className={`relative overflow-hidden bg-[#dfeaec] ${className}`}>
    <iframe title="Mapa de entrega" src={src} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-[#35130c] shadow-lg"><MapPin className="size-3.5 text-primary" />{position ? 'Sua localização atual' : 'Rio de Janeiro'}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-[#35130c]/95 px-3 py-2 text-xs font-bold text-white shadow-lg"><Navigation className="size-3.5 text-[#ffdb74]" />Mapa conectado</span></div>
    <div className="absolute bottom-3 right-3 flex flex-col gap-2"><button onClick={locate} className="grid size-11 place-items-center rounded-xl bg-white text-primary shadow-lg transition hover:scale-105" aria-label="Atualizar localização">{status === 'loading' ? <RefreshCw className="size-5 animate-spin" /> : <Crosshair className="size-5" />}</button></div>
    {(status === 'denied' || status === 'error') && <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-xl"><div className="flex gap-3"><AlertCircle className="mt-0.5 size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">Informe seu ponto de entrega</p><p className="mt-0.5 text-xs text-muted-foreground">Permita a localização ou digite um endereço para continuar.</p><div className="mt-3 flex gap-2"><input value={address} onChange={event => setAddress(event.target.value)} onKeyDown={event => event.key === 'Enter' && manualAddress()} placeholder="Rua, número e bairro" className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-xs outline-none focus:border-primary" /><button onClick={manualAddress} className="rounded-lg bg-[#35130c] px-3 text-xs font-bold text-white"><Search className="size-4" /></button></div></div></div></div>}
  </div>;
}
