import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Grape, Bot, Minimize2 } from 'lucide-react';

interface Message {
  id: number;
  from: 'user' | 'ai';
  text: string;
  time: string;
}

const QUICK_ACTIONS = [
  '🕐 Status do pedido',
  '🚚 Prazo de entrega',
  '💳 Formas de pagamento',
  '❌ Cancelar pedido',
  '🎁 Promoções',
  '📦 Minha conta',
];

function getTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function generateReply(input: string): string {
  const msg = input.toLowerCase().trim();

  // Greetings
  if (/^(oi|olá|ola|ei|hello|bom dia|boa tarde|boa noite|hey)/.test(msg)) {
    const greets = [
      'Olá! 👋 Que bom ter você aqui no UVAFOOD! Sou a **Uva**, sua assistente virtual. Como posso te ajudar hoje?',
      'Oi! 😊 Seja bem-vindo(a) ao UVAFOOD! Estou aqui para te ajudar com o que precisar. Pode falar!',
    ];
    return greets[Math.floor(Math.random() * greets.length)];
  }

  // Order status
  if (/pedido|status|onde|acompanhar|rastrear/.test(msg)) {
    return '🔍 Para acompanhar seu pedido em tempo real, acesse a aba **"Histórico"** no carrinho. Lá você vê o status atualizado de todos os seus pedidos!\n\nSe o seu pedido está com status **"Em preparo"**, nosso time está trabalhando nele agora. Normalmente leva entre 15 a 25 minutos. 🍳';
  }

  // Delivery time
  if (/prazo|tempo|demora|entrega|quando|minuto|hora/.test(msg)) {
    return '🚀 Nossos prazos de entrega são:\n\n• **Zona Sul/Norte**: 25–35 min\n• **Centro**: 20–30 min\n• **Zona Leste**: 35–45 min\n\nVocê pode ver o tempo estimado ao fazer o pedido. Em dias chuvosos pode haver pequenos atrasos — te avisamos em tempo real! ☔';
  }

  // Payment
  if (/pagamento|pagar|cartão|credito|debito|pix|dinheiro|boleto/.test(msg)) {
    return '💳 Aceitamos as seguintes formas de pagamento:\n\n• **PIX** — desconto de 5% automático! ✨\n• **Cartão de crédito** (até 3x sem juros)\n• **Cartão de débito**\n• **Dinheiro** (troco garantido)\n• **Vale-refeição** (Alelo, Sodexo, VR)\n\nQuer saber mais sobre alguma forma específica?';
  }

  // Cancel
  if (/cancela|cancelar|cancelamento|desistir|devolver/.test(msg)) {
    return '❌ Para cancelar um pedido:\n\n**Dentro de 5 minutos** após confirmar → cancelamento gratuito 100%.\n\n**Após 5 minutos** → entre em contato e faremos o possível para ajudar. Se o pedido já estiver em preparo, oferecemos crédito na próxima compra.\n\nQuer que eu inicie o cancelamento do seu último pedido?';
  }

  // Promotions
  if (/promoç|desconto|cupom|oferta|grátis|gratis|promo/.test(msg)) {
    return '🎁 Promoções ativas agora:\n\n🔥 **UVABEM10** — 10% off no primeiro pedido\n🚚 **Frete grátis** em pedidos acima de R$ 40\n⭐ **Combo fidelidade** — a cada 5 pedidos, 1 grátis!\n🌙 **Happy Hour** 15h–18h → 15% off nos Combos\n\nCopie o cupom e aplique no carrinho! 😉';
  }

  // Account
  if (/conta|perfil|cadastro|senha|email|login/.test(msg)) {
    return '👤 Para gerenciar sua conta:\n\n• **Alterar senha**: Configurações → Segurança\n• **Atualizar endereço**: Configurações → Endereços\n• **Ver histórico**: Carrinho → aba Histórico\n• **Excluir conta**: Configurações → Privacidade\n\nPrecisa de ajuda com alguma dessas opções?';
  }

  // Food / menu
  if (/cardápio|menu|comida|prato|lanche|pizza|hamburguer|burger|salada|batata/.test(msg)) {
    return '🍽️ Nosso cardápio tem diversas opções deliciosas:\n\n🍔 **Lanches** — X-Bacon Gourmet, Sanduíche Especial\n🎁 **Combos** — Combo X-Bacon, Combo Família e mais!\n🍟 **Batatas** — Clássica, com Cheddar, Rústica\n🥩 **Grelhados** — Salmão, Frutos do Mar\n🥗 **Saladas** e muito mais!\n\nUse a busca no topo da tela para encontrar o que procura 🔍';
  }

  // Problem / complaint
  if (/problema|errado|faltou|faltando|ruim|péssimo|atrasou|não chegou|horrivel|reclamaç/.test(msg)) {
    return 'Puxa, sinto muito por isso! 😔 Sua experiência é muito importante para nós.\n\nPara resolver rapidinho:\n\n1. Me conte **o que aconteceu** com seu pedido\n2. Vou verificar no sistema e acionar a equipe\n3. Você receberá uma solução em até **10 minutos**\n\nCan confirmar o número do pedido (ex: #123456)?';
  }

  // Allergy / dietary
  if (/alergi|glúten|lactose|vegano|vegan|vegetarian|dieta|ingrediente/.test(msg)) {
    return '🌱 Temos opções para diversas dietas:\n\n• **Veganos/Vegetarianos**: Salada Caesar (sem anchovas), Prato do Chef (confirme no chat)\n• **Sem glúten**: Pratos grelhados, saladas — confirme no pedido\n• **Intolerância à lactose**: Batata Clássica e Rústica são livres!\n\n⚠️ Sempre informe sua restrição no campo de observações do pedido para segurança máxima.';
  }

  // Thanks
  if (/obrigad|valeu|brigad|thanks|grat/.test(msg)) {
    return 'Fico feliz em ajudar! 😊🍇 Se precisar de mais alguma coisa, é só chamar. Bom apetite! 🍽️✨';
  }

  // Goodbye
  if (/tchau|bye|ate mais|até mais|xau|flw/.test(msg)) {
    return 'Tchau tchau! 👋 Foi um prazer te atender. Qualquer coisa, estamos aqui 24 horas por dia. Bom apetite! 🍔🍟';
  }

  // Default
  const defaults = [
    'Hmm, deixa eu entender melhor... 🤔 Pode me dar mais detalhes sobre o que você precisa? Estou aqui para ajudar com pedidos, entregas, pagamentos e muito mais!',
    'Não entendi completamente, mas não se preocupe! 😊 Pode reformular a pergunta ou escolher uma das opções rápidas abaixo que eu te ajudo na hora!',
    'Que boa pergunta! 💡 Para te dar a melhor resposta, pode me contar mais detalhes? Atendo pedidos, dúvidas sobre entrega, pagamento, cardápio e muito mais.',
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: 'ai',
      text: 'Olá! 👋 Sou a **Uva**, assistente virtual do UVAFOOD! Estou aqui para te ajudar com pedidos, entregas, pagamentos e muito mais. Como posso te ajudar? 🍇',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      inputRef.current?.focus();
    }
  }, [open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: 'user', text: text.trim(), time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      const reply = generateReply(text);
      const aiMsg: Message = { id: Date.now() + 1, from: 'ai', text: reply, time: getTime() };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
      if (!open) setUnread(n => n + 1);
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Render markdown-style bold
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9997] w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <MessageCircle className="size-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-black rounded-full size-5 flex items-center justify-center animate-bounce">
              {unread}
            </span>
          )}
          <span className="absolute right-16 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            Central de Ajuda IA 🤖
          </span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-[9997] w-[380px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300 ${
            minimized ? 'h-16' : 'h-[560px]'
          }`}
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-amber-500 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Grape className="size-5 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm">Uva — Assistente UVAFOOD</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-white/80 text-xs">Online agora</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(m => !m)} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Minimize2 className="size-4" />
              </button>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/30 to-background">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.from === 'ai' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="size-4 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                          msg.from === 'user'
                            ? 'bg-primary text-white rounded-tr-sm'
                            : 'bg-white border border-border rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {renderText(msg.text)}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <Bot className="size-4 text-white" />
                    </div>
                    <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick actions */}
              <div className="px-3 py-2 border-t border-border overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-1">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action}
                      onClick={() => sendMessage(action)}
                      className="shrink-0 text-xs bg-secondary hover:bg-primary hover:text-white text-foreground font-semibold px-3 py-1.5 rounded-full border border-border hover:border-primary transition-all duration-200 whitespace-nowrap"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-white flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 shrink-0"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
