//Import
const {pool} = require('../config')
const { getUserId } = require('../utils/jwt.utils');
const extendCommonController = require('./commonController');

/*====================================
Preparation of all the functions that interact with the car table of the database
======================================*/

//----------Insert a new car------------
const addCar = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { name,order_id } = request.body

	//Chech parameters
	if ( !name || !order_id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( typeof name !== 'string' || name.length === 0 || isNaN(order_id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}
	// Insert postgreSQL database request
	pool.query(
		'INSERT INTO "CAR" (name,order_id) VALUES ($1, $2)',
		[name,order_id],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot add Car' });
			}
			response.status(201).json({status: 'success', message: 'Car added.'})
		},
	)
}

//-------Find cars by order id--------
const getCarsByOrderId = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { order_id } = request.params;

		 //Chech parameter
	if ( !order_id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( isNaN(order_id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}

		// Select postgreSQL database request
	pool.query('SELECT * FROM "CAR" WHERE ("order_id" = $1)', 
		[order_id],
		(error, results) => {
		if (error) {
			return response.status(500).json({ 'error': 'cannot find Cars by Order ID' });
		}
		if(results&&results.rows){
			return response.status(200).json(results.rows)
		}
		response.status(404).json({ 'error': 'not found Cars by Order ID ' });
	})
}

//------Update one car found by ID-------
const updateCar = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { name, order_id } = request.body
	const id = request.params.id;

	//Chech parameter
	if ( !name || !id || !order_id ) {
		return response.status(400).json({ 'error': 'missing parameters' });
	}
	if ( isNaN(id) || typeof name !=="string" || isNaN(order_id) ) {
		return response.status(400).json({ 'error': 'bad parameters' });
	}

	// Update postgreSQL database request
	pool.query(
		'UPDATE "CAR" SET name = $2, order_id = $3  WHERE ("ID" = $1)',
		[id,name,order_id],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot update Car' });
			}
			response.status(201).json({status: 'success', message: 'Car updates.'})
		},
	)
}

//export Function => (will be import in ../routes/carRoute)
module.exports = {//Export customer cars
	//add commons coltrollers for car
	...extendCommonController("car"),
	//add car controllers
	addCar,
	getCarsByOrderId,
	updateCar
};




