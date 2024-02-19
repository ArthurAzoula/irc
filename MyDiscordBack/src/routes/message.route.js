const express = require('express');

const messageController = require('../controller/message.controller');

const router = express.Router();

// GET /messages

router.get('/', messageController.getMessages);

// GET /messages/:id

router.get('/:id', messageController.getMessageById);

// POST /messages

router.post('/', messageController.createMessage);

// PUT /messages/:id

router.put('/:id', messageController.updateMessage);

// DELETE /messages/:id

router.delete('/:id', messageController.deleteMessage);


module.exports = router;