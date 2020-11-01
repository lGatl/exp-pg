const express = require('express')


//import car controllers
const { 
	addCar, 
	deleteCar,
	getAllCars, 
	getCar,
	getCarsByOrderId,
	updateCar
} = require('../controllers/carController');

const router = express.Router();

//Assign car controller to route 
router.post('/car',  addCar);
router.get('/car',  getAllCars);
router.get('/car/:id',  getCar);
router.get('/car/order/:order_id', getCarsByOrderId);
router.put('/car/:id',  updateCar);
router.delete('/car/:id',  deleteCar);

//export routes
module.exports = router;
