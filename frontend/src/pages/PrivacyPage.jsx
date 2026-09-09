import { Helmet } from 'react-helmet-async';
import MainLayout from '../components/layout/MainLayout';

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-aw-text mb-3 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full inline-block" style={{ background: 'linear-gradient(#a855f7,#ec4899)' }} />
        {title}
      </h2>
      <div className="text-sm text-aw-muted leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <MainLayout>
      <Helmet><title>Política de Privacidade — ANIMES WORLD</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Política de Privacidade</h1>
          <p className="text-xs text-aw-dim">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="aw-card p-6 md:p-8">
          <Section title="1. Dados que Coletamos">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-aw-text">Dados de conta:</strong> nome de usuário, endereço de e-mail e senha (armazenada em hash criptográfico)</li>
              <li><strong className="text-aw-text">Dados de uso:</strong> histórico de visualizações, progresso, favoritos e lista de animes</li>
              <li><strong className="text-aw-text">Dados técnicos:</strong> endereço IP, user agent, logs de acesso (para segurança)</li>
              <li><strong className="text-aw-text">Cookies:</strong> para manter sua sessão ativa e preferências</li>
            </ul>
          </Section>
          <Section title="2. Como Usamos Seus Dados">
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fornecer e melhorar o serviço</li>
              <li>Salvar seu progresso e preferências</li>
              <li>Garantir a segurança da sua conta</li>
              <li>Enviar notificações (quando habilitado)</li>
              <li>Detectar e prevenir abusos e acessos não autorizados</li>
            </ul>
          </Section>
          <Section title="3. Logs de Segurança e IPs">
            <p>Por razões de segurança, registramos endereços IP e informações de acesso. Esses dados são utilizados exclusivamente para proteção contra invasões, fraudes e acessos não autorizados. Não são compartilhados com terceiros.</p>
          </Section>
          <Section title="4. Compartilhamento de Dados">
            <p>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto quando:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Exigido por lei ou ordem judicial</li>
              <li>Necessário para proteger nossos direitos legais</li>
            </ul>
          </Section>
          <Section title="5. Cookies">
            <p>Utilizamos cookies essenciais para manter sua sessão ativa. Não utilizamos cookies de rastreamento de terceiros para publicidade.</p>
          </Section>
          <Section title="6. Retenção de Dados">
            <p>Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta, todos os dados pessoais são removidos dos nossos servidores em até 30 dias.</p>
          </Section>
          <Section title="7. Seus Direitos">
            <p>Você tem o direito de:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Exportar seu histórico e dados</li>
            </ul>
            <p>Para exercer esses direitos, acesse nossas <a href="/configuracoes" className="text-aw-purple hover:underline">Configurações</a> ou entre em contato pelo <a href="/suporte" className="text-aw-purple hover:underline">Suporte</a>.</p>
          </Section>
          <Section title="8. Segurança">
            <p>Utilizamos práticas modernas de segurança, incluindo criptografia de senhas, HTTPS, proteção contra CSRF e rate limiting. Nenhum sistema é 100% seguro — recomendamos o uso de senhas fortes e únicas.</p>
          </Section>
          <Section title="9. Contato">
            <p>Em caso de dúvidas sobre esta política, entre em contato através da nossa página de <a href="/suporte" className="text-aw-purple hover:underline">Suporte</a>.</p>
          </Section>
        </div>
      </div>
    </MainLayout>
  );
}
