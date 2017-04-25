exports.getAppSession = function(cb) {
	Login.post(
		{
			"SessionId":sails.config.appSession,
			"currentState":'login',
			"method":'login',
			"objects":[
				{
					"Login":{
						"LoginName":'appuser',
						"LoginPassword":'appuser',
						"CertificateFingerprint":'',
						"EntryPoint":sails.config.entryPoint
					}
				}
			]
		},
		function(error,response) {
			return parserService.parse(error,response,
				function(err){
					console.log('something went wrong! '+err);
					// try again in 1 min
					var t = setTimeout(function(){
						storageService.getAppSession();
					},5000);
				},
				function(result){
					eventService.getMarketParams(function(){
						eventService.getChat(function(){
							//eventService.getOrders(function(){
								eventService.getAlerts(function(){
									//eventService.getAssets(function(){
										eventService.getEvents(function(){
											eventService.startEventsTimer(function(){
												//eventService.startDeltaTimer(function(){
													eventService.getTranslations()
												//})
											})
										})
									//})
								})
							//})
						});
					});
				}
			);
		}
	);
};

