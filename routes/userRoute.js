const express = require('express')

//import user controllers
const { 
	register, 
	login,
	getUserProfile,
	updateUserProfile,
	deleteUser,
	getAllUsers, 
	getUser,
} = require('../controllers/userController');

const router = express.Router();

//Assign user controller to route 
router.post('/user/register/',  register);
router.get('/user/login/',  login);
router.get('/user/me/',  getUserProfile);
router.put('/user/me/', updateUserProfile);
router.delete('/user/:id', deleteUser);
router.get('/user',  getAllUsers);
router.get('/user/:id',  getUser);

module.exports = router;
