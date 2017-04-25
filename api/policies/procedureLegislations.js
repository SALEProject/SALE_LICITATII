module.exports = function(req, res, next) {
	req.session.procedureLegislations = [];
	Nomenclator.post(
		{
			"SessionId":sessionService.getSessionID(req),
			"currentState":'login',
			"method":'select',
			"procedure":'getProcedureLegislations'
		},
		function(error,response) {
			return parserService.parse(error,response,
				function(err){
					logService.debug(err);
					return next();
				},
				function(result){
					req.session.procedureLegislations = result.Rows;
					return next();
				}
			);
		}
	);

};
