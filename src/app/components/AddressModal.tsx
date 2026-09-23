import { useState, useEffect } from 'react';
import { MapPin, Search, X, Navigation, ChevronRight, Grape } from 'lucide-react';

const RIO_NEIGHBORHOODS = [
  'Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca', 'Botafogo',
  'Flamengo', 'Laranjeiras', 'Santa Teresa', 'Centro', 'Lapa',
  'Tijuca', 'Maracanã', 'Recreio', 'Jacarepaguá', 'Campo Grande',
  'Méier', 'Engenho Novo', 'Ilha do Governador', 'Urca', 'Glória',
];

const POPULAR = ['Copacabana', 'Ipanema', 'Barra da Tijuca', 'Botafogo', 'Centro'];

export function AddressModal() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<'search' | 'detail'>('search');
  const [query, setQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('uvafood_address');
    if (!saved) setVisible(true);
  }, []);

  const filtered = query.length > 0
    ? RIO_NEIGHBORHOODS.filter(n => n.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelectNeighborhood = (n: string) => {
    setSelectedNeighborhood(n);
    setStep('detail');
    setQuery('');
  };

  const handleDetect = () => {
    if (!navigator.geolocation) { setDetecting(false); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const detected = `Localização atual (${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`;
        localStorage.setItem('uvafood_address', detected);
        localStorage.setItem('uvafood_coordinates', JSON.stringify({ lat: coords.latitude, lng: coords.longitude }));
        setDetecting(false);
        setVisible(false);
      },
      () => { setDetecting(false); setQuery(''); }
    );
  };

  const handleSave = () => {
    const addr = `${street ? street + ', ' : ''}${number ? number + ' — ' : ''}${selectedNeighborhood}, Rio de Janeiro`;
    localStorage.setItem('uvafood_address', addr);
    setVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem('uvafood_address', 'Rio de Janeiro, RJ');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary via-orange-500 to-amber-400 px-7 pt-8 pb-12 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 top-8 w-20 h-20 bg-white/10 rounded-full" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Grape className="size-5 text-white" />
            </div>
            <span className="font-black text-lg">UVAFOOD</span>
          </div>
          <h2 className="text-2xl font-black leading-tight mb-1">Onde você está?</h2>
          <p className="text-white/80 text-sm">
            Informe seu endereço para ver os restaurantes disponíveis na sua região 📍
          </p>
        </div>

        {/* Content pulled up over header */}
        <div className="relative -mt-6 bg-white rounded-t-3xl px-7 pt-6 pb-8">
          {step === 'search' ? (
            <>
              {/* GPS button */}
              <button
                onClick={handleDetect}
                disabled={detecting}
                className="w-full flex items-center gap-3 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-2xl p-4 mb-5 transition-all group"
              >
                <div className={`w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 ${detecting ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`}>
                  <Navigation className="size-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-black text-sm text-foreground">
                    {detecting ? 'Detectando sua localização...' : 'Usar minha localização atual'}
                  </p>
                  <p className="text-xs text-muted-foreground">Via GPS do seu dispositivo</p>
                </div>
                {!detecting && <ChevronRight className="size-4 text-muted-foreground ml-auto" />}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-semibold">ou busque seu bairro</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Search input */}
              <div className="relative mb-5">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Ex: Copacabana, Ipanema..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-muted border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Search results */}
              {filtered.length > 0 && (
                <div className="border border-border rounded-2xl overflow-hidden mb-4 shadow-sm">
                  {filtered.slice(0, 5).map((n, i) => (
                    <button
                      key={n}
                      onClick={() => handleSelectNeighborhood(n)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary text-left transition-colors ${i > 0 ? 'border-t border-border' : ''}`}
                    >
                      <MapPin className="size-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold">{n}</span>
                      <span className="text-xs text-muted-foreground ml-auto">Rio de Janeiro, RJ</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular areas */}
              {!query && (
                <>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-3">Regiões populares</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map(n => (
                      <button
                        key={n}
                        onClick={() => handleSelectNeighborhood(n)}
                        className="flex items-center gap-1.5 bg-secondary hover:bg-primary hover:text-white text-sm font-bold px-3.5 py-2 rounded-full border border-border hover:border-primary transition-all duration-200"
                      >
                        <MapPin className="size-3.5" />
                        {n}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button onClick={handleSkip} className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pular por agora
              </button>
            </>
          ) : (
            <>
              {/* Step 2: Detail address */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <MapPin className="size-5 text-primary shrink-0" />
                <div>
                  <p className="font-black text-sm">{selectedNeighborhood}</p>
                  <p className="text-xs text-muted-foreground">Rio de Janeiro, RJ</p>
                </div>
                <button onClick={() => setStep('search')} className="ml-auto text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Rua / Avenida</label>
                  <input
                    type="text"
                    placeholder="Ex: Av. Atlântica"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-wider mb-1.5 block">Número</label>
                  <input
                    type="text"
                    placeholder="Ex: 1702 Apto 301"
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/30 text-base"
              >
                Confirmar endereço ✓
              </button>
              <button onClick={handleSkip} className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                Usar apenas o bairro
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
