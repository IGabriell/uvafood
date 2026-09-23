import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ShoppingCart, Plus, Star, Flame, Clock, Tag, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';
import { ReviewsSection } from '../components/ReviewsSection';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { StorefrontSection } from '../components/StorefrontSection';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<string, string> = {
  'Todos': '🍽️',
  'Combos': '🎁',
  'Batatas': '🍟',
  'Lanches': '🍔',
  'Pratos': '🍛',
  'Grelhados': '🥩',
  'Saladas': '🥗',
  'Petiscos': '🫕',
  'Especiais': '✨',
};

const FEATURED_IDS = ['c1', 'c2', '1'];
const COMBO_IDS = new Set(['c1', 'c2', 'c3']);

export function Home() {
  const { isAuthenticated } = useAuth();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProduct, setActiveProduct] = useState<typeof products[number] | null>(null);
  useEffect(() => { const update = () => setScrollProgress(Math.min(window.scrollY / 520, 1)); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('uvafood_favorites') ?? '[]'));
  const toggleFavorite = (id: string) => setFavorites(current => { const next = current.includes(id) ? current.filter(value => value !== id) : [...current, id]; localStorage.setItem('uvafood_favorites', JSON.stringify(next)); toast.success(current.includes(id) ? 'Removido dos favoritos' : 'Salvo nos favoritos'); return next; });

  const searchQuery = searchParams.get('q') ?? '';
  const selectedCategory = searchParams.get('cat') ?? 'Todos';

  const setCategory = (cat: string) => {
    const next: Record<string, string> = {};
    if (cat !== 'Todos') next.cat = cat;
    if (searchQuery) next.q = searchQuery;
    setSearchParams(next);
  };

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let list = selectedCategory === 'Todos' ? products : products.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const cartItemIds = new Set(items.map(i => i.id));

  const handleAddToCart = (product: typeof products[0]) => {
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar ao carrinho 🔐');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} adicionado! 🎉`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="sticky top-0 -z-0 relative min-h-[480px] overflow-hidden bg-[#35130c] text-white" style={{ opacity: 1 - scrollProgress * .28 }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&h=900&fit=crop&auto=format')", transform: `scale(${1 + scrollProgress * .13}) translateY(${scrollProgress * 8}%)` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#35130c] via-[#35130c]/85 to-[#35130c]/20" />
        <div className="absolute inset-0 opacity-[0.08] select-none pointer-events-none">
          <span className="absolute top-3 left-6 text-7xl">🍕</span>
          <span className="absolute top-14 right-20 text-6xl">🍔</span>
          <span className="absolute bottom-3 left-1/3 text-5xl">🥗</span>
          <span className="absolute bottom-6 right-1/4 text-6xl">🍟</span>
          <span className="absolute top-8 left-1/2 text-5xl">🎁</span>
        </div>
        <div className="container relative mx-auto flex min-h-[480px] items-center px-4 py-14" style={{ transform: `translateY(${scrollProgress * -50}px)` }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="size-5 text-yellow-300" />
            <span className="text-sm font-bold text-yellow-200 uppercase tracking-wider">Entregas em até 40 min</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 leading-tight">
            Comida boa,<br />na sua porta 🚀
          </h1>
          <p className="text-white/80 text-base max-w-md mb-5">
            Os melhores pratos e combos da cidade, entregues com carinho e rapidez.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-sm">
              <Star className="size-4 text-yellow-300 fill-yellow-300" />
              <span className="font-bold">4.9 estrelas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-sm">
              <Clock className="size-4" />
              <span className="font-semibold">25–45 min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-sm">
              <Tag className="size-4 text-yellow-300" />
              <span className="font-semibold">Frete grátis &gt; R$ 40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Combos destaque banner */}
      {selectedCategory === 'Todos' && !searchQuery && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <p className="font-black text-foreground">Combos com desconto especial!</p>
                <p className="text-sm text-muted-foreground">Economize até 30% nos combos completos</p>
              </div>
            </div>
            <button
              onClick={() => setCategory('Combos')}
              className="bg-primary hover:bg-primary/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-primary/30 shrink-0"
            >
              Ver combos
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Search result label */}
        {searchQuery && (
          <div className="mb-5 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Resultados para</span>
            <span className="bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full">"{searchQuery}"</span>
            <span className="text-sm text-muted-foreground">— {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'itens'}</span>
          </div>
        )}

        {/* Category filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-white text-foreground border border-border hover:border-primary hover:text-primary hover:bg-secondary hover:scale-105'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] ?? '🍽️'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map(product => {
              const inCart = cartItemIds.has(product.id);
              const isFeatured = FEATURED_IDS.includes(product.id);
              const isCombo = COMBO_IDS.has(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {isCombo && (
                        <span className="bg-primary text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                          🎁 Combo
                        </span>
                      )}
                      {isFeatured && !isCombo && (
                        <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                          🔥 Destaque
                        </span>
                      )}
                    </div>
                    <button aria-label="Salvar nos favoritos" onClick={(event) => { event.stopPropagation(); toggleFavorite(product.id); }} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-primary shadow-sm transition hover:scale-110">
                      <Heart className={`size-4 ${favorites.includes(product.id) ? 'fill-primary' : ''}`} />
                    </button>
                    {isCombo && <div className="absolute right-3 top-14"><span className="bg-white/95 text-primary text-xs font-black px-2 py-1 rounded-full shadow-sm">-20%</span></div>}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-black text-base leading-tight">{product.name}</h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full shrink-0">
                        {CATEGORY_ICONS[product.category] ?? '🍽️'}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xl font-black text-primary leading-tight">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </p>
                        {isCombo && (
                          <p className="text-xs text-muted-foreground line-through">
                            R$ {(product.price * 1.25).toFixed(2).replace('.', ',')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(event) => { event.stopPropagation(); handleAddToCart(product); }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 active:scale-95 ${
                          inCart
                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/30'
                            : 'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/30 hover:scale-105'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <ShoppingCart className="size-4" />
                            <span className="hidden sm:inline">No carrinho</span>
                          </>
                        ) : (
                          <>
                            <Plus className="size-4" />
                            <span>Pedir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black mb-2">Nenhum prato encontrado</h3>
            <p className="text-muted-foreground text-sm">
              Tente outra busca ou selecione uma categoria diferente
            </p>
          </div>
        )}
      </div>

      {/* Reviews section */}
      <ReviewsSection />

      {activeProduct && <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} onAdd={handleAddToCart} />}
      <StorefrontSection />
      {/* Footer strip */}
      <div className="bg-foreground text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-black mb-1">UVAFO<span className="text-primary">OD</span></div>
          <p className="text-white/50 text-sm">🍇 Sabor e qualidade na sua porta</p>
        </div>
      </div>
    </div>
  );
}
