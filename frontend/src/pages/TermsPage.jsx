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

export default function TermsPage() {
  return (
    <MainLayout>
      <Helmet><title>Termos de Uso — ANIMES WORLD</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Termos de Uso</h1>
          <p className="text-xs text-aw-dim">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="aw-card p-6 md:p-8">
          <Section title="1. Aceitação dos Termos">
            <p>Ao acessar ou usar a plataforma ANIMES WORLD, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço.</p>
          </Section>
          <Section title="2. Elegibilidade">
            <p>Você deve ter pelo menos 13 anos para criar uma conta. Ao criar uma conta, você declara que as informações fornecidas são verídicas.</p>
          </Section>
          <Section title="3. Conta de Usuário">
            <p>Você é responsável por manter a confidencialidade das suas credenciais de acesso. Notifique-nos imediatamente em caso de acesso não autorizado.</p>
            <p>É proibido criar contas falsas, usar dados de terceiros ou tentar acessar contas de outros usuários.</p>
          </Section>
          <Section title="4. Uso Permitido">
            <p>A plataforma ANIMES WORLD é destinada exclusivamente ao uso pessoal e não comercial. É proibido:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Reproduzir, redistribuir ou vender o conteúdo da plataforma</li>
              <li>Usar ferramentas automatizadas para scraping ou extração de dados</li>
              <li>Tentar comprometer a segurança ou estabilidade da plataforma</li>
              <li>Publicar conteúdo ilegal, ofensivo ou que viole direitos de terceiros</li>
            </ul>
          </Section>
          <Section title="5. Propriedade Intelectual">
            <p>Os metadados de animes são fornecidos pela AniList API sob suas respectivas licenças. A marca ANIMES WORLD, incluindo logo, design e identidade visual, é propriedade exclusiva da plataforma.</p>
          </Section>
          <Section title="6. Modificações do Serviço">
            <p>Reservamo-nos o direito de modificar, suspender ou encerrar o serviço a qualquer momento, com ou sem aviso prévio.</p>
          </Section>
          <Section title="7. Limitação de Responsabilidade">
            <p>A plataforma é fornecida "como está". Não nos responsabilizamos por danos diretos, indiretos ou consequentes decorrentes do uso do serviço.</p>
          </Section>
          <Section title="8. Rescisão">
            <p>Podemos suspender ou encerrar sua conta em caso de violação destes termos, sem aviso prévio.</p>
          </Section>
          <Section title="9. Contato">
            <p>Para dúvidas sobre estes termos, entre em contato através da nossa página de <a href="/suporte" className="text-aw-purple hover:underline">Suporte</a>.</p>
          </Section>
        </div>
      </div>
    </MainLayout>
  );
}
