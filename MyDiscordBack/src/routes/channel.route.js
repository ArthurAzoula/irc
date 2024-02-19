const express = require('express');

const channelController = require('../controller/channel.controller');

const router = express.Router();

// GET /channels

router.get('/', channelController.getChannels);

// GET /channels/:id/messages

router.get('/:id/messages', channelController.getMessagesByIdChannel);

// GET /channels/:id

router.get('/:id', channelController.getChannelById);

// POST /channels

router.post('/', channelController.createChannel);

// PUT /channels/:id

router.put('/:id', channelController.updateChannel);

// DELETE /channels/:id

router.delete('/:id', channelController.deleteChannel);


module.exports = router;