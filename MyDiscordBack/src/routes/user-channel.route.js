const express = require('express');

const userChannelController = require('../controller/user-channel.controller');

const router = express.Router();

// GET /user-channels

router.get('/', userChannelController.getUserChannels);

// GET /user-channels/:id

router.get('/:id', userChannelController.getUserChannelById);

// GET /user-channels/user/:id

router.get('/user/:id', userChannelController.getAllUserChannelsByUserId);

// GET /user-channels/user/:id/channels

router.get('/user/:id/channels', userChannelController.getAllChannelsByUserId);

// GET /user-channels/channel/:id

router.get('/channel/:id', userChannelController.getAllUserChannelsByChannelId);

// GET /user-channels/channel/:id/user/:id

router.get('/channel/:channelId/user/:userId', userChannelController.getUserChannelByUserIdAndChannelId);

// POST /user-channels

router.post('/', userChannelController.createUserChannel);

// PUT /user-channels/:id

router.put('/:id', userChannelController.updateUserChannel);

// PUT /user-channels/:id/nickname

router.put('/:id/nickname', userChannelController.updateUserNickname);

// DELETE /user-channels/:id

router.delete('/:id', userChannelController.deleteUserChannel);

module.exports = router;