//Import
const { pool } = require('../config')
const { getUserId } = require('../utils/jwt.utils');

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

//---------Delete a customer----------
const deleteCustomer = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { id } = request.params;

	//Chech parameter
	if ( !id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}
	if ( isNaN(id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
		}
	// Delete postgreSQL database request	
	pool.query('DELETE FROM "CUSTOMER" WHERE ("ID" = $1) ', 
		[id],
		(error) => {
		if (error) {
			return response.status(500).json({ 'error': 'cannot delete Customer' });
		}
		response.status(201).json({status: 'success', message: 'Customer deleted.'})
	})
}

//----------Find all customers----------
const getAllCustomers = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


	// Select postgreSQL database request
	pool.query('SELECT * FROM "CUSTOMER"', (error, results) => {
		if (error) {
			return response.status(500).json({ 'error': 'cannot find Customers' });
		}
		if(results && results.rows && results.rows){
			return response.status(200).json(results.rows)
		}
		
		response.status(404).json({ 'error': 'not found Customers' });
		
	})
}

//-------Find one customer by id--------
const getCustomer = (request, response) => {

	// -Authentication : comment to desactivate authentication-
		var userId = getUserId(request.headers['authorization']);
		if (userId < 0)
			return response.status(400).json({ 'error': 'wrong token' });
	// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



	const { id } = request.params;

	//Chech parameter
	if ( !id ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}

	if ( isNaN(id) ) {
			return response.status(400).json({ 'error': 'bad parameters' });
	}
	// Select postgreSQL database request
	pool.query('SELECT * FROM "CUSTOMER" WHERE ("ID" = $1)', 
		[id],
		(error, results) => {
		if (error) {
			return response.status(500).json({ 'error': 'cannot find Customer' });
		}

		if(results && results.rows &&  results.rows[0]){
			return response.status(200).json(results.rows[0])
		}
			response.status(404).json({ 'error': 'not found Customer' });
	})
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


//export Function => (will be import in ../routes/customerRoute)
module.exports = {
	addCustomer,
	deleteCustomer,
	getAllCustomers,
	getCustomer,
	updateCustomer,
};
