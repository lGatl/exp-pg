//Import
const { pool } = require('../config')
const { getUserId } = require('../utils/jwt.utils');
const extendCommonController = require('./commonController');

/*==============================
Preparation of all the functions that interact with the customer table of the postgreSQL database
================================*/

//----------Insert a new customer------------
const addCustomer = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


	const { name } = request.body

	//Chech parameter
	if ( !name ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( typeof name !== 'string' || name.length === 0) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}
	// Insert postgreSQL database request
	pool.query(
		'INSERT INTO "CUSTOMER" (name) VALUES ($1)',
		[name],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot add Customer' });
			}
			response.status(201).json({status: 'success', message: 'Customer added.'})
		},
	)
}

//------Update one customer found by ID-------
const updateCustomer = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { name } = request.body
	const { id } = request.params;

	//Chech parameter
	if ( !name || !id ) {
		return response.status(400).json({ 'error': 'missing parameters' });
	}
	if ( isNaN(id) || typeof name !=="string" ) {
			return response.status(400).json({ 'error': 'bad parameters' });
	}

	// Update postgreSQL database request
	pool.query(
		'UPDATE "CUSTOMER" SET name = $2 WHERE ("ID" = $1)',
		[id,name],
		(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot update Customer' });
			}
			response.status(201).json({status: 'success', message: 'Customer updates.'})
		},
	)
}


let nom = "Customer"
//export Function => (will be import in ../routes/customerRoute)
module.exports = {//Export customer controllers
	//add common controllers for customer
	...extendCommonController("customer"),
	//add customer controllers
	addCustomer,
	updateCustomer
};
