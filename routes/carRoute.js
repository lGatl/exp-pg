const express = require('express')

const app = express()
//call controllers
const { 
	addCar, 
	deleteCar,
	getAllCars, 
	getCar,
	getCarsByOrderId,
	updateCar
	  } = require('../controllers/carController');

const router = express.Router();

router.post('/car',  addCar);
router.get('/car',  getAllCars);
router.get('/car/:id',  getCar);
router.get('/car/order/:order_id', getCarsByOrderId);
router.put('/car/:id',  updateCar);
router.delete('/car/:id',  deleteCar);

module.exports = router;
