

const express = require('express');

const anonymousController = require('../controller/anonymous.controller');

const router = express.Router();

// GET /anonymous
router.get('/', anonymousController.getAnonymous);

// GET /anonymous/:id
router.get('/:id', anonymousController.getAnonymousById);

// POST /anonymous
router.post('/', anonymousController.createAnonymous);

// PUT /anonymous/:id
router.put('/:id', anonymousController.updateAnonymous);

// DELETE /anonymous/:id
router.delete('/:id', anonymousController.deleteAnonymous);

module.exports = router;