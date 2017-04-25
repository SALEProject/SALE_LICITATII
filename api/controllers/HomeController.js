module.exports = {
    
	index: function (req, res) {
		var moment = require('moment');
		if(req.isSocket) {
			return res.json({time:new moment()});
		}
		return res.view({title:'SALE.ro',time:new moment()});
	},

	subscribe: function (req, res) {
		if(req.isSocket) {
			User.publishCreate({id:Date.now()});
			Alert.watch(req.socket);
			Procedure.watch(req.socket);
			Favourite.watch(req.socket);
			Chat.watch(req.socket);
			Transaction.watch(req.socket);
			Translation.watch(req.socket);
			Journal.watch(req.socket);
			User.watch(req.socket);
			//sails.storage.sessions.push({id: req.socket.id, user: sails.storage.users[sessionService.getSessionID(req)]});
			return res.json({Success:true, ResultType:'string', Result: 'Successfully registered socket'});
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result: 'Wrong connection type'});
	},

	time: function (req, res) {
		RingSession.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'servertime',
				"useResource":false
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'String', Result: result});
					}
				);
			}
		);
	},

	measuringunits: function (req, res) {
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getMeasuringUnits',
				"objects":[
					{
						"Arguments": {
							"ID_Market": sails.config.marketId
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'String', Result: result.Rows});
					}
				);
			}
		);
	},

	currencies: function (req, res) {
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getCurrencies',
				"objects":[
					{
						"Arguments": {
							"ID_Market": sails.config.marketId
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'Array', Result: result.Rows});
					}
				);
			}
		);
	},

	clients: function (req, res) {
		Client.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getBrokerClients',
				"objects":[
					{
						"Arguments": {
							"ID_Market": sails.config.marketId,
							"ID_Asset": req.param('ID_Asset')*1,
							"ID_Broker": req.session.currentUser.ID_Broker
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'String', Result: result.Rows});
					}
				);
			}
		);
	}
};
