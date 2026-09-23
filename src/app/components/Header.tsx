import { Link, NavLink, useNavigate, useSearchParams } from 'react-router';
import { ShoppingBag, UserRound, LogOut, Search, X, Grape, MapPin, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const links = [{ to: '/', label: 'Início' }, { to: '/cardapio', label: 'Cardápio' }, { to: '/combos', label: 'Combos' }, { to: '/pedidos', label: 'Pedidos' }];

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const search = (value: string) => { setParams(value ? { q: value } : {}); if (!location.pathname.startsWith('/cardapio')) navigate('/cardapio' + (value ? `?q=${encodeURIComponent(value)}` : '')); };
  return <header className="sticky top-0 z-50 border-b border-[#4a21130f] bg-[#fffaf5]/95 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-7xl items-center gap-5 px-4 sm:px-6">
      <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="UVAFOOD, início"><span className="flex size-10 items-center justify-center rounded-[14px] bg-[#531b12] text-[#ffdb74] shadow-[0_8px_20px_rgba(83,27,18,.18)] transition-transform group-hover:-rotate-6"><Grape className="size-5" /></span><span className="font-[Fraunces] text-xl font-bold tracking-[-.045em] text-[#35130c]">UVA<span className="text-primary">FOOD</span></span></Link>
      <nav className="hidden items-center gap-5 lg:flex">{links.map(link => <NavLink key={link.to} to={link.to} className={({ isActive }) => `text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{link.label}</NavLink>)}</nav>
      <label className="relative ml-auto hidden max-w-md flex-1 md:block"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={e => search(e.target.value)} placeholder="Qual vai ser o pedido de hoje?" className="h-10 w-full rounded-full border border-border bg-white pl-9 pr-9 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />{query && <button onClick={() => search('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>}</label>
      <div className="flex items-center gap-1.5"><Link to="/carrinho" className="relative flex size-10 items-center justify-center rounded-full border border-border bg-white text-foreground transition hover:border-primary hover:text-primary" aria-label="Carrinho"><ShoppingBag className="size-[18px]" />{totalItems > 0 && <b className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] text-white">{totalItems}</b>}</Link>{isAuthenticated ? <><Link to="/favoritos" className="hidden size-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary sm:grid" aria-label="Favoritos"><Heart className="size-[18px]" /></Link><Link to="/perfil" className="hidden items-center gap-2 rounded-full bg-[#35130c] px-3 py-2 text-xs font-bold text-white sm:flex"><UserRound className="size-4" />{user?.name.split(' ')[0]}</Link><button onClick={() => { logout(); navigate('/'); }} className="grid size-9 place-items-center text-muted-foreground hover:text-primary" aria-label="Sair"><LogOut className="size-4" /></button></> : <Link to="/login" className="rounded-full bg-[#35130c] px-4 py-2 text-sm font-bold text-white transition hover:bg-primary">Entrar</Link>}</div>
    </div><div className="border-t border-border/70 px-4 py-2 text-center text-[11px] font-semibold text-muted-foreground lg:hidden"><MapPin className="mr-1 inline size-3 text-primary" />Entregando na Zona Sul, Rio de Janeiro</div>
  </header>;
}
