import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Grape, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const ok = login(email, password);
      if (ok) {
        toast.success('Bem-vindo de volta! 👋');
        navigate('/');
      } else {
        toast.error('Email ou senha incorretos');
      }
    } else {
      if (!name || !email || !password) { toast.error('Preencha todos os campos'); return; }
      const ok = register(name, email, password);
      if (ok) {
        toast.success('Conta criada! Bom apetite 🎉');
        navigate('/');
      } else {
        toast.error('Email já cadastrado');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/30 mb-4">
            <Grape className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-black">
            UVAFO<span className="text-primary">OD</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLogin ? 'Entre para pedir sua comida favorita' : 'Crie sua conta e comece a pedir'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-muted rounded-xl p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setName(''); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all duration-200 ${
              isLogin ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setName(''); setEmail(''); setPassword(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-black transition-all duration-200 ${
              !isLogin ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Criar conta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
                required={!isLogin}
                className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          {isLogin && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm">
              <p className="font-black text-amber-800 mb-1">🔑 Conta demo</p>
              <p className="text-amber-700">
                <span className="font-semibold">Email:</span> Interfaces@email.com
              </p>
              <p className="text-amber-700">
                <span className="font-semibold">Senha:</span> VeigaAlmeida
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2"
          >
            {isLogin ? 'Entrar agora' : 'Criar minha conta'}
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Ao entrar, você concorda com nossos{' '}
          <span className="text-primary font-semibold cursor-pointer hover:underline">Termos de Uso</span>
        </p>
      </div>
    </div>
  );
}
