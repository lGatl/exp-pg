//Import
const {pool} = require('../config')
const { getUserId } = require('../utils/jwt.utils');
const extendCommonController = require('./commonController');

/*========================================
Preparation of all the functions that interact with the order table of the database
==========================================*/


//----------Insert a new order------------
const addOrder = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


	const {name,customer_id} = request.body

	 //Chech parameters
	if ( !name || !customer_id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( typeof name !== 'string' || name.length === 0 || isNaN(customer_id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}

	// Insert postgreSQL database request
	pool.query(
		'INSERT INTO "ORDER" (name, customer_id) VALUES ($1,$2)',
		[name, customer_id],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot add Order' });
			}
			response.status(201).json({status: 'success', message: 'Order added.'})
		},
	)
}

//-------Find orders by customer id--------
const getOrdersByCustomerId = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


	const { customer_id } = request.params;

		 //Chech parameter
	if ( !customer_id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( isNaN(customer_id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}

	// Select postgreSQL database request
	pool.query('SELECT * FROM "ORDER" WHERE ("customer_id" = $1)', 
		[customer_id],
		(error, results) => {
		if (error) {
			return response.status(500).json({ 'error': 'cannot find Orders by Customer ID' });
		}
		if(results&&results.rows){
			return response.status(200).json(results.rows)
		}
		response.status(404).json({ 'error': 'not found Orders by Customer ID ' });
	})
}


//------Update one order found by ID-------
const updateOrder = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


	const { name, customer_id } = request.body;
	const id = request.params.id;

	//Chech parameter
	if ( !name  || !id || !customer_id ) {
		return response.status(400).json({ 'error': 'missing parameters' });
	}
	if ( isNaN(id) || typeof name !=="string" || isNaN(order_id) ) {
		return response.status(400).json({ 'error': 'bad parameters' });
	}

	// Update postgreSQL database request
	pool.query(
		'UPDATE "ORDER" SET name = $2, customer_id = $3 WHERE ("ID" = $1)',
		[id,name, customer_id],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot update Order' });
			}
			response.status(201).json({status: 'success', message: 'Order updates.'})
		},
	)
}

//export Function => (will be import in ../routes/orderRoute)
module.exports = {//Export order controllers
	//add common controllers for order
	...extendCommonController("order"),
	//add order controllers
	addOrder,
	getOrdersByCustomerId,
	updateOrder
};



