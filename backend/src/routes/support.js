const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas de suporte exigem autenticação
router.use(authenticateToken);

// Criar ticket
router.post('/', ctrl.createTicket);

// Listar meus tickets
router.get('/my-tickets', ctrl.getMyTickets);

// Detalhes de um ticket (com histórico de mensagens)
router.get('/tickets/:id', ctrl.getTicket);

// Buscar mensagens (polling)
router.get('/tickets/:id/messages', ctrl.getMessages);

// Enviar mensagem em um ticket
router.post('/tickets/:id/messages', ctrl.sendMessage);

// Mudar status (usuário pode fechar, admin pode tudo)
router.patch('/tickets/:id/status', ctrl.updateTicketStatus);

// Assumir ticket (admin/mod)
router.patch('/tickets/:id/assign', ctrl.assignTicket);

module.exports = router;
