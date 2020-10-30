const express = require('express')

const app = express()
//call controllers
const { 
	addOrder, 
	deleteOrder,
	getAllOrders, 
	getOrder,
	getOrdersByCustomerId,
	updateOrder  
} = require('../controllers/orderController');

const router = express.Router();

router.post('/order',  addOrder);
router.delete('/order/:id', deleteOrder);
router.get('/order',  getAllOrders);
router.get('/order/:id',  getOrder);
router.get('/order/customer/:customer_id',  getOrdersByCustomerId);
router.put('/order/:id',  updateOrder);


module.exports = router;
