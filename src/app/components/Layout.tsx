import { Outlet, NavLink } from 'react-router';
import { House, BookOpen, ShoppingBag, UserRound } from 'lucide-react';
import { Header } from './Header';
import { WaterCursor } from './WaterCursor';
import { AIChat } from './AIChat';
import { AddressModal } from './AddressModal';
import { WelcomeVideoModal } from './WelcomeVideoModal';
import { ClickEffects } from './ClickEffects';
const mobile = [{ to: '/', label: 'Início', icon: House }, { to: '/cardapio', label: 'Cardápio', icon: BookOpen }, { to: '/carrinho', label: 'Pedido', icon: ShoppingBag }, { to: '/perfil', label: 'Perfil', icon: UserRound }];
export function Layout() { return <div className="min-h-screen bg-background pb-20 md:pb-0"><WaterCursor /><ClickEffects /><AddressModal /><WelcomeVideoModal /><Header /><Outlet /><AIChat /><nav className="fixed bottom-0 z-40 flex w-full justify-around border-t border-border bg-[#fffaf5]/95 px-2 py-2 backdrop-blur md:hidden">{mobile.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-w-14 flex-col items-center gap-1 rounded-xl px-3 py-1 text-[10px] font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}><Icon className="size-5" />{label}</NavLink>)}</nav></div>; }
