import { useState } from 'react';
import { Star, ThumbsUp, Camera, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  foodPhoto: string;
  dish: string;
  time: string;
  likes: number;
  verified: boolean;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Ana Carolina',
    avatar: 'AC',
    rating: 5,
    comment: 'Simplesmente INCRÍVEL! O X-Bacon chegou quentinho, o queijo derretido perfeito. Já é o terceiro pedido esse mês 😍 A batata com cheddar então... impossível parar de comer!',
    foodPhoto: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop&auto=format',
    dish: 'Combo X-Bacon',
    time: 'há 2 dias',
    likes: 47,
    verified: true,
  },
  {
    id: 2,
    name: 'Rafael Mendes',
    avatar: 'RM',
    rating: 5,
    comment: 'Melhor entrega de comida que já fiz! Chegou em 28 minutos, ainda quentinho. O Salmão Grelhado estava no ponto perfeito, tempero impecável. Super recomendo!',
    foodPhoto: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&auto=format',
    dish: 'Salmão Grelhado',
    time: 'há 3 dias',
    likes: 31,
    verified: true,
  },
  {
    id: 3,
    name: 'Mariana Silva',
    avatar: 'MS',
    rating: 5,
    comment: 'A batata com cheddar é DIVINA. Cremosa por dentro, crocante por fora. Já virei fã! A embalagem também é muito caprichada, chegou tudo organizadinho. 10/10 ⭐',
    foodPhoto: 'https://images.unsplash.com/photo-1639744210631-209fce3e256c?w=400&h=300&fit=crop&auto=format',
    dish: 'Batata com Cheddar',
    time: 'há 5 dias',
    likes: 63,
    verified: true,
  },
  {
    id: 4,
    name: 'Pedro Alves',
    avatar: 'PA',
    rating: 4,
    comment: 'Pedido chegou rápido e bem quentinho. O Prato Brasileiro trouxe aquele sabor caseiro que a gente ama. Arroz, feijão, farofa na medida certa. Voltarei com certeza!',
    foodPhoto: 'https://images.unsplash.com/photo-1751890893837-d43f80a5baf8?w=400&h=300&fit=crop&auto=format',
    dish: 'Prato Brasileiro',
    time: 'há 1 semana',
    likes: 22,
    verified: true,
  },
  {
    id: 5,
    name: 'Juliana Costa',
    avatar: 'JC',
    rating: 5,
    comment: 'Fiz o Jantar Romântico pra comemorar nosso aniversário e foi perfeito! A apresentação dos pratos é lindíssima. O atendimento pelo chat foi super atencioso também 💕',
    foodPhoto: 'https://images.unsplash.com/photo-1731941465921-eb4285693713?w=400&h=300&fit=crop&auto=format',
    dish: 'Jantar Romântico',
    time: 'há 1 semana',
    likes: 89,
    verified: true,
  },
  {
    id: 6,
    name: 'Carlos Eduardo',
    avatar: 'CE',
    rating: 5,
    comment: 'O Combo Família foi show! Pedi pra um churrasco em casa e todo mundo adorou. Hambúrgueres bem montados, batatas crocantes. Entregou exatamente como a foto. 🔥',
    foodPhoto: 'https://images.unsplash.com/photo-1457460866886-40ef8d4b42a0?w=400&h=300&fit=crop&auto=format',
    dish: 'Combo Família',
    time: 'há 2 semanas',
    likes: 41,
    verified: true,
  },
];

const AVATAR_COLORS = [
  'bg-orange-500', 'bg-amber-500', 'bg-red-500',
  'bg-rose-500', 'bg-yellow-500', 'bg-pink-500',
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size === 'sm' ? 'size-3.5' : 'size-4'} ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const [page, setPage] = useState(0);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const perPage = 3;
  const totalPages = Math.ceil(REVIEWS.length / perPage);
  const visible = REVIEWS.slice(page * perPage, page * perPage + perPage);

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const fiveStars = REVIEWS.filter(r => r.rating === 5).length;

  const toggleLike = (id: number) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-14 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                ⭐ Avaliações reais
              </span>
            </div>
            <h2 className="text-3xl font-black mb-2">O que nossos clientes<br />estão dizendo</h2>
            <p className="text-muted-foreground text-sm">Fotos e comentários verificados de pedidos reais</p>
          </div>
          {/* Stats */}
          <div className="flex items-center gap-6 bg-white rounded-2xl px-6 py-4 border border-border shadow-sm">
            <div className="text-center">
              <p className="text-4xl font-black text-primary">{avgRating}</p>
              <StarRating rating={5} size="md" />
              <p className="text-xs text-muted-foreground mt-1">{REVIEWS.length} avaliações</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="space-y-1.5">
              {[5, 4, 3].map(stars => {
                const count = REVIEWS.filter(r => r.rating === stars).length;
                const pct = Math.round((count / REVIEWS.length) * 100);
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-3">{stars}</span>
                    <Star className="size-3 text-amber-400 fill-amber-400" />
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-muted-foreground w-6">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {visible.map(review => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Food photo */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={review.foodPhoto}
                  alt={review.dish}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <Camera className="size-3.5 text-white/80" />
                  <span className="text-white text-xs font-bold">{review.dish}</span>
                </div>
                <div className="absolute top-3 right-3">
                  <StarRating rating={review.rating} />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 ${AVATAR_COLORS[review.id % AVATAR_COLORS.length]}`}>
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-black text-sm">{review.name}</p>
                        {review.verified && (
                          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full font-bold">
                            ✓ Verificado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{review.time}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground leading-relaxed line-clamp-3 mb-4">
                  "{review.comment}"
                </p>

                <button
                  onClick={() => toggleLike(review.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all duration-200 px-3 py-1.5 rounded-full ${
                    likedIds.has(review.id)
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <ThumbsUp className={`size-3.5 ${likedIds.has(review.id) ? 'fill-primary' : ''}`} />
                  {review.likes + (likedIds.has(review.id) ? 1 : 0)} útil
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i === page ? 'bg-primary scale-125' : 'bg-border hover:bg-primary/40'
              }`}
            />
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
