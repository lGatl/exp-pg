const express = require('express')

//import user controllers
const { 
	register, 
	login,
	getUserProfile,
	updateUserProfile
	  } = require('../controllers/userController');

const router = express.Router();

//Assign user controller to route 
router.post('/user/register/',  register);
router.get('/user/login/',  login);
router.get('/user/me/',  getUserProfile);
router.put('/user/me/', updateUserProfile);

module.exports = router;
