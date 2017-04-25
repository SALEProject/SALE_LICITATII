/**
 * agencies
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	req.session.userClient = null;
	Client.post(
		{
			"SessionId":sessionService.getSessionID(req),
			"currentState":'login',
			"method":'select',
			"procedure":'getClients',
			"objects":[
				{
					"Arguments":{
						"ID_Client":req.session.currentUser.ID_Client*1
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
					for(var i=0;i<result.Rows.length;i++) {
						if(result.Rows[i].ID==req.session.currentUser.ID_Client) {
							req.session.userClient = result.Rows[i];
						}
					}
					return next();
				}
			);
		}
	);
};
