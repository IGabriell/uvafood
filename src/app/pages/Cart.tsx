import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Minus, Plus, Trash2, Clock, CheckCircle, Bike, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  'Entregue': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  'Em preparo': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  'A caminho': { icon: Bike, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
};

export function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, orderHistory, checkout } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'cart' | 'history'>('cart');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [payment, setPayment] = useState('Pix');
  const delivery = totalPrice >= 40 ? 0 : 6.9;
  const discount = couponApplied ? Math.min(totalPrice * 0.1, 12) : 0;
  const finalTotal = Math.max(0, totalPrice + delivery - discount);


  const handleCheckout = () => {
    if (items.length === 0) { toast.error('Seu carrinho está vazio'); return; }
    checkout(finalTotal);
    toast.success('Pedido realizado! Acompanhe no mapa 🗺️');
    navigate('/rastrear');
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold mb-6 group transition-colors"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao cardápio
        </button>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setTab('cart')}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all duration-200 relative ${
              tab === 'cart'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🛒 Carrinho
            {items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs font-black rounded-full size-5 flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all duration-200 ${
              tab === 'history'
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📋 Histórico
            {orderHistory.length > 0 && (
              <span className="ml-1.5 bg-muted-foreground/20 text-muted-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                {orderHistory.length}
              </span>
            )}
          </button>
        </div>

        {/* Cart tab */}
        {tab === 'cart' && (
          <>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-7xl mb-4">🛒</div>
                <h2 className="text-2xl font-black mb-2">Carrinho vazio</h2>
                <p className="text-muted-foreground mb-6 text-sm max-w-xs">
                  Explore nosso cardápio e adicione os pratos que você ama!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/30"
                >
                  Ver cardápio
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Items */}
                <div className="lg:col-span-3 space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl border border-border p-4 flex gap-4 group hover:border-primary/30 transition-colors">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-base leading-tight mb-0.5">{item.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{item.description}</p>
                        <p className="text-lg font-black text-primary">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-foreground disabled:opacity-40"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
                    <h2 className="font-black text-lg mb-4">Resumo do pedido</h2>
                    <div className="space-y-2.5 mb-4">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate mr-2">{item.name} ×{item.quantity}</span>
                          <span className="font-semibold shrink-0">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mb-4 rounded-xl bg-secondary/70 p-3">
                      <p className="mb-2 text-xs font-bold text-foreground">Cupom de desconto</p>
                      <div className="flex gap-2"><input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="BEMVINDO" className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary" /><button onClick={() => { if (coupon === 'BEMVINDO') { setCouponApplied(true); toast.success('Cupom aplicado: 10% OFF'); } else toast.error('Use BEMVINDO para testar'); }} className="rounded-lg bg-[#35130c] px-3 text-xs font-bold text-white">Aplicar</button></div>
                    </div>
                    <div className="mb-4"><p className="mb-2 text-xs font-bold text-foreground">Pagamento</p><div className="flex gap-2">{['Pix','Cartão','Dinheiro'].map(option => <button key={option} onClick={() => setPayment(option)} className={`rounded-lg border px-2.5 py-2 text-xs font-bold ${payment === option ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>{option}</button>)}</div><p className="mt-2 text-xs text-muted-foreground">Entrega em Ipanema · Rua Visconde de Pirajá, 420</p></div>
                    <div className="border-t border-border pt-4 mb-5">
                      <div className="flex justify-between text-sm mb-1.5 text-muted-foreground">
                        <span>Subtotal</span>
                        <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1.5 text-green-600"><span className="font-semibold">🚚 Entrega</span><span className="font-bold">{delivery ? `R$ ${delivery.toFixed(2).replace('.', ',')}` : 'Grátis'}</span></div>
                      {couponApplied && <div className="flex justify-between text-sm mb-1.5 text-green-600"><span>Desconto BEMVINDO</span><span>- R$ {discount.toFixed(2).replace('.', ',')}</span></div>}
                      <div className="flex justify-between font-black text-lg mt-3"><span>Total</span><span className="text-primary">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/30 text-base"
                    >
                      Fazer pedido 🚀
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full mt-2 text-muted-foreground hover:text-foreground text-sm font-semibold py-2.5 rounded-xl transition-colors hover:bg-muted"
                    >
                      Continuar comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <>
            {orderHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-7xl mb-4">📋</div>
                <h2 className="text-2xl font-black mb-2">Nenhum pedido ainda</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Faça seu primeiro pedido e acompanhe seu histórico aqui!
                </p>
                <button
                  onClick={() => setTab('cart')}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/30"
                >
                  Ver carrinho
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {orderHistory.map(order => {
                  const cfg = STATUS_CONFIG[order.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={order.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <div>
                          <span className="font-black text-base">{order.id}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                          <Icon className="size-3.5" />
                          {order.status}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2 mb-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                              </div>
                              <span className="text-sm font-black text-primary shrink-0">
                                R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-border">
                          <span className="text-sm text-muted-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)} {order.items.length === 1 ? 'item' : 'itens'}</span>
                          <span className="font-black text-lg text-primary">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>

    </>
  );
}
