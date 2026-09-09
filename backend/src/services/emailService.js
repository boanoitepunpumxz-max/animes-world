const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

async function sendPasswordReset(email, username, token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  if (process.env.NODE_ENV === 'development') {
    console.log(`\n📧 [DEV] Reset de senha para ${email}`);
    console.log(`   Link: ${resetUrl}\n`);
    return;
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'ANIMES WORLD <noreply@animesworld.com>',
    to: email,
    subject: 'Redefinição de senha — ANIMES WORLD',
    html: `
      <div style="background:#0d0d0d;color:#fff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;border-radius:12px;">
        <h1 style="color:#a855f7;text-align:center;">AW</h1>
        <h2 style="text-align:center;">ANIMES WORLD</h2>
        <p>Olá, <strong>${username}</strong>!</p>
        <p>Recebemos uma solicitação de redefinição de senha para sua conta.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Redefinir Senha
          </a>
        </div>
        <p style="color:#888;font-size:12px;">Este link expira em 2 horas. Se você não solicitou isto, ignore este e-mail.</p>
        <hr style="border-color:#333;margin:24px 0;" />
        <p style="color:#555;text-align:center;font-size:11px;">© ANIMES WORLD — YOUR ANIME. OUR WORLD.</p>
      </div>
    `,
  });
}

async function sendWelcome(email, username) {
  if (process.env.NODE_ENV === 'development') return;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'ANIMES WORLD <noreply@animesworld.com>',
    to: email,
    subject: 'Bem-vindo ao ANIMES WORLD!',
    html: `
      <div style="background:#0d0d0d;color:#fff;padding:40px;font-family:sans-serif;max-width:600px;margin:0 auto;border-radius:12px;">
        <h1 style="color:#a855f7;text-align:center;">AW</h1>
        <h2 style="text-align:center;">ANIMES WORLD</h2>
        <p>Olá, <strong>${username}</strong>! 🎉</p>
        <p>Bem-vindo(a) ao <strong>ANIMES WORLD</strong> — sua nova casa para animes.</p>
        <p>Agora você pode:</p>
        <ul>
          <li>Explorar nosso catálogo completo</li>
          <li>Adicionar animes à sua lista</li>
          <li>Acompanhar seu progresso</li>
          <li>Receber notificações de novos episódios</li>
        </ul>
        <div style="text-align:center;margin:32px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Começar a Assistir
          </a>
        </div>
        <p style="color:#555;text-align:center;font-size:11px;">© ANIMES WORLD — YOUR ANIME. OUR WORLD.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordReset, sendWelcome };
