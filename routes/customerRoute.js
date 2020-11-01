const express = require('express')

var { verifyToken }  = require('../utils/jwt.utils');

//import customer controllers
const { 
	addCustomer, 
	deleteCustomer,
	getAllCustomers, 
	getCustomer,
	updateCustomer, 

} = require('../controllers/customerController');

const router = express.Router();

//Assign customer controller to route 
router.post('/customer',  addCustomer);
router.get('/customer', getAllCustomers);
router.get('/customer/:id',  getCustomer);
router.put('/customer/:id',  updateCustomer);
router.delete('/customer/:id',  deleteCustomer);

module.exports = router;

