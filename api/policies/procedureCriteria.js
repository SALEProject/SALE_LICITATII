module.exports = function(req, res, next) {
	req.session.procedureCriteria = [];
	Nomenclator.post(
		{
			"SessionId":sessionService.getSessionID(req),
			"currentState":'login',
			"method":'select',
			"procedure":'getProcedureCriteria'
		},
		function(error,response) {
			return parserService.parse(error,response,
				function(err){
					logService.debug(err);
					return next();
				},
				function(result){
					req.session.procedureCriteria = toolsService.sortTranslatedArray(result.Rows,'Name',req);
					return next();
				}
			);
		}
	);

};
