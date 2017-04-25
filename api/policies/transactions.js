/**
 * transactions
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	req.session.transactions = [];
	Transaction.post(
		{
			"SessionId":'AppSessionDisponibil',
			"currentState":'login',
			"method":'select',
			"procedure":'getTransactions',
			"objects":[
				{
					"Arguments": {
						"all":true
					}
				}
			]
		},
		function(error,response) {
			return parserService.parse(error,response,
				function(err){
					logService.debug(err);
					return next();
				},
				function(result){
					req.session.transactions = result.Rows;
					return next();
				}
			);
		}
	);

};
