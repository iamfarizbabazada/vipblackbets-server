// BACKEND - Routes (routes/ticketRoutes.js)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/tickets', auth, ticketController.createTicket);
router.get('/tickets', auth, ticketController.getTickets);
router.get('/tickets/:ticketId', auth, ticketController.getTicketById);
router.patch('/tickets/:ticketId/status', auth, admin, ticketController.updateTicketStatus);
router.post('/tickets/:ticketId/messages', auth, ticketController.addMessage);
router.get('/admin/tickets', auth, admin, ticketController.getAdminTickets);