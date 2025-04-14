const express = require('express');
const { getAllUsers, getUserById, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/fetch', getAllUsers)
router.get('/:id', getUserById)
router.put('/update', updateProfile)

module.exports = router;