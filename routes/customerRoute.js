const express = require('express')

const app = express()
//call controllers
const { 
	addCustomer, 
	deleteCustomer,
	getAllCustomers, 
	getCustomer,
	updateCustomer, 

} = require('../controllers/customerController');

const router = express.Router();

router.post('/customer',  addCustomer);
router.get('/customer',  getAllCustomers);
router.get('/customer/:id',  getCustomer);
router.put('/customer/:id',  updateCustomer);
router.delete('/customer/:id',  deleteCustomer);

module.exports = router;

