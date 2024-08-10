const express = require('express');
const router = express.Router();
const { createUser, getUser, getUserById, updateUser, deleteUser } = require('../controller/userController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload'); 

router.post('/create', auth, role(['Admin']), upload.single('photo'), createUser);
router.get('/get', auth, role(['Admin', 'User']), getUser);
router.get('/get/:id', auth, role(['Admin', 'User']), getUserById);
router.patch('/update/:id', auth, role(['Admin']), upload.single('photo'), updateUser);
router.delete('/delete/:id', auth, role(['Admin']), deleteUser);

module.exports = router;
