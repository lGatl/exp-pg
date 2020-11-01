//Import
const {pool} = require('../config')
const { getUserId } = require('../utils/jwt.utils');

/*====================================
Preparation of function to extend controllers with common functions that 
can interact with multiple table of the database
======================================*/
 const extendCommonController = function(table){

 	const capitalize = function(string) {return string.charAt(0).toUpperCase() + string.slice(1)}

	//---------Delete a car----------
	const deletecommon = (request, response) => {

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
		pool.query('DELETE FROM "'+table.toUpperCase()+'" WHERE ("ID" = $1) ', 
			[id],
			(error) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot delete '+capitalize(table) });
			}
			response.status(201).json({status: 'success', message: capitalize(table)+' deleted.'})
		})
	}

	//----------Find all cars----------
	const getAll = (request, response) => {

		// -Authentication : comment to desactivate authentication-
			var userId = getUserId(request.headers['authorization']);
			if (userId < 0)
				return response.status(400).json({ 'error': 'wrong token' });
		// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



		// Select postgreSQL database request
		pool.query('SELECT * FROM "'+table.toUpperCase()+'"', (error, results) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot find '+capitalize(table)+"s" });
			}
			if(results&&results.rows){
				return response.status(200).json(results.rows)
			}
			response.status(404).json({ 'error': 'not found '+capitalize(table)+"s" });
		})
	}

	//-------Find one car by id--------
	const get = (request, response) => {

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
		pool.query('SELECT * FROM "'+table.toUpperCase()+'" WHERE ("ID" = $1)', 
			[id],
			(error, results) => {
			if (error) {
				return response.status(500).json({ 'error': 'cannot find '+capitalize(table) });
			}
			if(results&&results.rows&&results.rows[0]){
				return response.status(200).json(results.rows[0])
			}
			response.status(404).json({ 'error': 'not found '+capitalize(table) });

		})
	}

	return {
		["delete"+capitalize(table)]:deletecommon,
		["getAll"+capitalize(table)+"s"]:getAll,
		["get"+capitalize(table)]:get,
	}
}

module.exports = extendCommonController



