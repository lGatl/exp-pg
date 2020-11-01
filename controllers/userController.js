// Imports
var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var asyncLib  = require('async');
const {pool} = require('../config')
const extendCommonController = require('./commonController');

// Constants for syntax checking
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

/*==========================================
Preparation of all the functions that interact with the customer table of the database
============================================*/

//-----------Register user-------------------
const register = function(request, response) {
		
		// Parameters
		var email    = request.body.email;
		var password = request.body.password;

		//Chech parameters
		if (!email || !password ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}

		if (!EMAIL_REGEX.test(email)) {
			return response.status(400).json({ 'error': 'email is not valid' });
		}

		if (!PASSWORD_REGEX.test(password)) {
			return response.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
		}

		//Use of a waterfall for code readability
		asyncLib.waterfall([
			//-Check if user alredy exist-
			function(done) {
				// Select postgreSQL database request
				pool.query('SELECT * FROM "USER" WHERE ("email" = $1)', 
					[email],
					(error, results) => {
					if (error) {
						return response.status(500).json({ 'error': 'unable to verify user' });
					}
					done(null, results.rows[0]);
				})
			},
			//-Hash password using bcrypt-
			function(userFound, done) {
				if (!userFound) {
					bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
						done(null, userFound, bcryptedPassword);
					});
				} else {
					return response.status(409).json({ 'error': 'user already exist' });
				}
			},
			//-Create the user in DB-
			function(userFound, bcryptedPassword, done) {
				// Insert postgreSQL database request
				pool.query(
					'INSERT INTO "USER" (email, password) VALUES ($1,$2)',
					[email, bcryptedPassword],
					(error) => {
						if (error) {
							console.log("error", error);
							return response.status(500).json({ 'error': 'cannot add user' });
						}
						done({email,bcryptedPassword});
					},
				)
			}
		// -Response-
		], function(newUser) {
			if (newUser) {
				response.status(201).json({status: 'success', message: 'user added.'})
			} else {
				return response.status(500).json({ 'error': 'cannot add user' });
			}
		});
	}
//-----------Login user-------------------
const login = function(request, response) {
		
		// Parameters
		var email    = request.body.email;
		var password = request.body.password;

		//Chech parameters
		if (!email || !password ) {
			return response.status(400).json({ 'error': 'missing parameters' });
		}

		//Use of a waterfall for code readability
		asyncLib.waterfall([
			//-Check if user alredy exist-
			function(done) {
				// Select postgreSQL database request
				pool.query('SELECT * FROM "USER" WHERE ("email" = $1)', 
					[email],
					(error, results) => {
					if (error) {
						return response.status(500).json({ 'error': 'unable to verify user' });
					}
					done(null, results.rows[0]);
				})
			},
			//-Test password-
			function(userFound, done) {
				if (userFound) {
					bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
						done(null, userFound, resBycrypt);
					});
				} else {
					return response.status(404).json({ 'error': 'user not exist in DB' });
				}
			},
			function(userFound, resBycrypt, done) {
				if(resBycrypt) {
					done(userFound);
				} else {
					return response.status(403).json({ 'error': 'invalid password' });
				}
			}
			//-Response-
		], function(userFound) {
			if (userFound) {
				return response.status(201).json({
					'userId': userFound.id,
					'token': jwtUtils.generateTokenForUser(userFound)
				});
			} else {
				return response.status(500).json({ 'error': 'cannot log on user' });
			}
		});
	}
	//-----------Get user data by ID with authorization-------------------
	const getUserProfile = function(request, response) {

		// Getting auth header
		var headerAuth  = request.headers['authorization'];
		//Get user id in token if the token is valid
		var userId = jwtUtils.getUserId(headerAuth);
		//if token is not valid 
		if (userId < 0){
			return response.status(400).json({ 'error': 'wrong token' });
		}

		// Select postgreSQL database request
		pool.query('SELECT * FROM "USER" WHERE ("ID" = $1)', 
			[userId],
			(error, results) => {
				if (error) {
					return response.status(500).json({ 'error': 'unable to verify user' });
				}
				if (results&&results.rows&&results.rows[0]) {
					response.status(201).json(results.rows[0]);
				} else {
				response.status(404).json({ 'error': 'user not found' });
			}
		})
	}

		updateUserProfile = function(request, response) {
		// Getting auth header
		var headerAuth  = request.headers['authorization'];
		//Get user id in token if the token is valid
		var userId      = jwtUtils.getUserId(headerAuth);

		//if token is not valid 
		if (userId < 0){
			return response.status(400).json({ 'error': 'wrong token' });
		}

		// Params
		var password = request.body.password;

		//Chech parameters
		if (!PASSWORD_REGEX.test(password)) {
			return response.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
		}

		//Use of a waterfall for code readability
		asyncLib.waterfall([
			//-Check if user exist by id-
			function(done) {
				// Select postgreSQL database request
				pool.query('SELECT * FROM "USER" WHERE ("ID" = $1)', 
				[userId],
				(error, results) => {
					if (error) {
						return response.status(500).json({ 'error': 'unable to verify user' });
					}
					if (results&&results.rows&&results.rows[0]) {
						done(null, results.rows[0]);
					} else {
					response.status(404).json({ 'error': 'user not found' });
				}
				})
			},
			//-Hash password using bcrypt-
			function(userFound, done) {
				if (userFound) {
					bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
						done(null, userFound, bcryptedPassword);
					});
				} else {
					return response.status(404).json({ 'error': 'user not found' });
				}
			},
			//-Update user-
			function(userFound, bcryptedPassword, done) {
				if(userFound) {
						// Select postgreSQL database request
						pool.query('UPDATE "USER" SET password = $2 WHERE ("ID" = $1)',
							[userId,bcryptedPassword],
							(error) => {
								if (error) {
									response.status(500).json({ 'error': 'cannot update user' });
								}
								done(userFound);
							},
						)
				} else {
					response.status(404).json({ 'error': 'user not found' });
				}
			},
			//-Result-
		], function(userFound) {
			if (userFound) {
				return response.status(201).json({"success": "userUpdated"});
			} else {
				return response.status(500).json({ 'error': 'cannot update user profile' });
			}
		});
	}

//export Function => (will be import in ../routes/userRoute)
module.exports = {//Export user controllers
	//add common controllers for user
	...extendCommonController("user"),
	//add user controllers
	register,
	login,
	getUserProfile,
	updateUserProfile,



 

}
