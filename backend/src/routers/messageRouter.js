const express = require('express');
const { getAllMessages, sendMessage } = require('../controllers/messageController');
const { upload, setUploadType } = require('../middlewares/multerMiddleware');

const router = express.Router();

router.get('/fetch/:id', getAllMessages)
router.post('/send/:id', sendMessage)

module.exports = router