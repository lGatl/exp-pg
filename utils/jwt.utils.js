// Imports
var jwt = require('jsonwebtoken');

//secret key to sign tokens
const JWT_SIGN_SECRET = 'zauhezkahekzae3zde333ddez24';
	
	//------Generate token with userId using secret key----------
	const generateTokenForUser = function(userData) {
		return jwt.sign({
			userId: userData.ID,
		},
		JWT_SIGN_SECRET,
		{
			expiresIn: '1h'
		})
	};
	//-----------isolate token---------
	const parseAuthorization = function(authorization) {

		return (authorization != null) ? authorization.replace('Bearer ', '') : null;
	};

	//-----Get userId coded in the token if given token is corret using secret key------
	const getUserId = function(authorization) {
		var userId = -1;
		var token = module.exports.parseAuthorization(authorization);
		if(token != null) {
			try {
				//Token verification
				var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
				if(jwtToken !== null)
					userId = jwtToken.userId;
			} catch(err) { }
		}
		return userId;
	};

	

//export functions
module.exports = {
	generateTokenForUser,
	parseAuthorization,
	getUserId
}
