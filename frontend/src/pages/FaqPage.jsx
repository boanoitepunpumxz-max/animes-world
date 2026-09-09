import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { RiArrowDownSLine } from 'react-icons/ri';
import MainLayout from '../components/layout/MainLayout';

const FAQS = [
  { q: 'O ANIMES WORLD é gratuito?', a: 'Sim! O acesso à plataforma é totalmente gratuito.' },
  { q: 'Como faço para criar uma conta?', a: 'Clique em "Criar conta" na tela inicial e preencha o formulário com seu nome de usuário, e-mail e senha.' },
  { q: 'Como adiciono um anime à minha lista?', a: 'Na página de cada anime, clique no botão "Minha Lista" e escolha o status (Assistindo, Quero assistir, etc.).' },
  { q: 'Posso continuar assistindo de onde parei?', a: 'Sim! O sistema salva seu progresso automaticamente. Na Home você verá a seção "Continue Assistindo".' },
  { q: 'Como funciona o sistema de histórico?', a: 'Cada episódio que você assiste é registrado automaticamente. Acesse /historico para ver tudo.' },
  { q: 'Por que alguns episódios não têm vídeo?', a: 'O catálogo de metadados é populado automaticamente, mas os vídeos são configurados pelo administrador. Entre em contato pelo suporte.' },
  { q: 'Como altero minha senha?', a: 'Acesse Configurações > Alterar Senha, informe a senha atual e a nova senha.' },
  { q: 'Posso usar em celular?', a: 'Sim! O ANIMES WORLD é totalmente responsivo e funciona perfeitamente em dispositivos móveis.' },
  { q: 'Como denuncio um problema com um anime?', a: 'Use a página de Suporte e selecione a categoria correspondente. Nossa equipe irá analisar.' },
  { q: 'Meus dados ficam salvos se eu sair da conta?', a: 'Sim. Seu histórico, progresso, favoritos e lista ficam salvos na sua conta.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`aw-card overflow-hidden transition-all ${open ? 'border-aw-purple/30' : ''}`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="text-sm font-semibold text-aw-text pr-4">{q}</span>
        <RiArrowDownSLine className={`text-aw-muted flex-shrink-0 transition-transform ${open ? 'rotate-180 text-aw-purple' : ''}`} size={20} />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-aw-border">
          <p className="text-sm text-aw-muted leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <MainLayout>
      <Helmet><title>FAQ — ANIMES WORLD</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-2xl font-black text-white mb-2">❓ Perguntas Frequentes</h1>
        <p className="text-aw-muted text-sm mb-8">Respostas rápidas para as dúvidas mais comuns.</p>
        <div className="space-y-3">
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </MainLayout>
  );
}
