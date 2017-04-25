exports.getTranslations = function(callback) {
	if(typeof sails.processes.translations == 'undefined') sails.processes.translations = false;
	if(!sails.processes.translations) {
		sails.processes.translations = true;
		var new_trans = {};
		if(typeof sails.storage.translations == 'undefined') sails.storage.translations = {};
		Nomenclator.post(
			{
				"SessionId":sails.config.appSession,
				"currentState":'login',
				"method":'select',
				"procedure":'getTranslations'
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						logService.debug(err);
						if(typeof callback !='undefined') return callback();
					},
					function(result){
						if(result.Rows.length>0) {
							for(var i=0;i<result.Rows.length;i++) {
								new_trans[result.Rows[i].Label] = result.Rows[i];
							}
						}
						sails.processes.translations = false;
						sails.storage.translations = new_trans;
						Translation.publishCreate({id:1});
						if(typeof callback !='undefined') return callback();
					}
				);
			}
		);
	}
	else {
		if(typeof callback !='undefined') return callback();
	}
};

exports.getMarketParams = function(callback) {
	if(typeof sails.processes.market == 'undefined') sails.processes.market = false;
	if(!sails.processes.market) {
		sails.processes.market = true;
		if(typeof sails.storage.market == 'undefined') sails.storage.market = {};
		//if(typeof sails.storage.market.Items == 'undefined') sails.storage.market.Items = [];
		//if(typeof sails.storage.market.Ids == 'undefined') sails.storage.market.Ids = [];
		/*if(typeof sails.storage.market.LastTimestamp == 'undefined') {
			var since = new Date();
			since.setHours(0,0,0);
			sails.storage.chat.LastTimestamp = since;
		}*/
		Market.post(
			{
				"SessionId":sails.config.appSession,
				"currentState":'login',
				"method":'select',
				"procedure":'getMarketParameters'
			},
			function(error,result) {
			// Error handling
			  if (error) {
				console.log('BUUUUU:'+error);
				return callback();

			  // The Book was found successfully!
			  } else {
				toolsService.parseResponse(result,function(msg) {
					console.log('success but failed:'+msg);
					return callback();
				},function(resultObject) {
					if(resultObject.Rows.length>0) {
						sails.storage.market = resultObject.Rows[0];
						if(typeof callback =='undefined') Market.publishUpdate(1, sails.storage.market);
					}
					sails.processes.market = false;
					if(typeof callback !='undefined') return callback();
				});
			  }
			}
		);
	}
};

exports.getChat = function(callback) {
	if(typeof sails.processes.chat == 'undefined') sails.processes.chat = false;
	if(!sails.processes.chat) {
		sails.processes.chat = true;
		if(typeof sails.storage.chat == 'undefined') sails.storage.chat = {};
		if(typeof sails.storage.chat.Items == 'undefined') sails.storage.chat.Items = [];
		if(typeof sails.storage.chat.Ids == 'undefined') sails.storage.chat.Ids = [];
		if(typeof sails.storage.chat.LastTimestamp == 'undefined') {
			var since = new Date();
			since.setHours(0,0,0);
			sails.storage.chat.LastTimestamp = since;
		}
		Chat.post(
			{
				"SessionId":sails.config.appSession,
				"currentState":'login',
				"method":'select',
				"procedure":'getChatHistory',
				"objects":
				[
					{
						"Arguments":
						{
							"Since":sails.storage.chat.LastTimestamp.toISOString()
						}
					}
				]
			},
			function(error,result) {
			// Error handling
			  if (error) {
				console.log('BUUUUU:'+error);
				return callback();

			  // The Book was found successfully!
			  } else {
				toolsService.parseResponse(result,function(msg) {
					console.log('success but failed:'+msg);
					return callback();
				},function(resultObject) {
					_.each(resultObject.Rows,function(item){
						if(sails.storage.chat.Ids.indexOf(item.ID)==-1) {
							sails.storage.chat.Ids.push(item.ID);
							sails.storage.chat.Items.push(item);
							sails.storage.chat.LastTimestamp = new Date(item.Date);
							if(typeof callback =='undefined') Chat.publishCreate({id:item.ID, item:item});
						}
					});
					sails.processes.chat = false;
					if(typeof callback !='undefined') return callback();
				});
			  }
			}
		);
	}
};

exports.getAlerts = function(callback) {
	if(typeof sails.processes.alerts == 'undefined') sails.processes.alerts = false;
	if(!sails.processes.alerts) {
		sails.processes.alerts = true;
		if(typeof sails.storage.alerts == 'undefined') sails.storage.alerts = {};
		if(typeof sails.storage.alerts.Items == 'undefined') sails.storage.alerts.Items = {};
		if(typeof sails.storage.alerts.Ids == 'undefined') sails.storage.alerts.Ids = [];
		if(typeof sails.storage.alerts.LastTimestamp == 'undefined') {
			var since = new Date();
			since.setHours(-24,0,0);
			sails.storage.alerts.LastTimestamp = since;
		}
		logService.debug('fetching alerts..');
		Alert.post(
			{
				"SessionId":sails.config.appSession,
				"currentState":'login',
				"method":'select',
				"procedure":'getAlerts',
				"objects":[
					{
						"Arguments":
						{
							"Since":sails.storage.alerts.LastTimestamp.toISOString()
						}
					}
				]
			},
			function(error,result) {
			// Error handling
			  if (error) {
				console.log('BUUUUU:'+error);
				if(typeof callback !='undefined') return callback();
			  } else {
				toolsService.parseResponse(result,function(msg) {
					console.log('success but failed:'+msg);
					if(typeof callback !='undefined') return callback();
				},function(resultObject) {
					logService.debug('found '+resultObject.Rows.length+' alerts..');
					_.each(resultObject.Rows,function(item){
						if(sails.storage.alerts.Ids.indexOf(item.ID)==-1) {
							sails.storage.alerts.Ids.push(item.ID);
							sails.storage.alerts.Items[item.ID] = item;
							sails.storage.chat.LastTimestamp = new Date(item.Date);
							if(typeof callback =='undefined') Alert.publishCreate({id:item.ID, item:item});
						}
					});
					logService.debug('total alerts: '+sails.storage.alerts.Ids.length);
					sails.processes.alerts = false;
					if(typeof callback !='undefined') return callback();
				});
			  }
			}
		);
	}
};

exports.getEvents = function(callback) {
	if(typeof sails.processes.events == 'undefined') sails.processes.events = false;
	if(!sails.processes.events) {
		sails.processes.events = true;
		if(typeof sails.storage.events == 'undefined') sails.storage.events = {};
		if(typeof sails.storage.events.Items == 'undefined') sails.storage.events.Items = {};
		if(typeof sails.storage.events.Ids == 'undefined') sails.storage.events.Ids = [];
		if(typeof sails.storage.events.LastTimestamp == 'undefined') {
			var since = new Date();
			since.setHours(0,0,0);
			sails.storage.events.LastTimestamp = since;
		}
		Event.post(
			{
				"SessionId":sails.config.appSession,
				"currentState":'login',
				"method":'select',
				"procedure":'getEvents',
				"objects":[
					{
					"Arguments":
					{
						"Since":sails.storage.events.LastTimestamp.toISOString()
					}
					}
				]
			},
			function(error,result) {
			// Error handling
			  if (error) {
				console.log('BUUUUU:'+error);
				if(typeof callback !='undefined') return callback();
			  // The Book was found successfully!
			  } else {
				toolsService.parseResponse(result,function(msg) {
					console.log('success but failed:'+msg);
					if(typeof callback !='undefined') return callback();
				},function(resultObject) {
					var counter = 0;
					_.each(resultObject.Rows,function(item){
						if(sails.storage.events.Ids.indexOf(item.ID)==-1) {
							sails.storage.events.Ids.push(item.ID);
							sails.storage.events.Items[item.ID] = item;
						}
						counter++;
					});
					while(true) {
						if(counter==sails.storage.events.Ids.length) {
							sails.processes.events = false;
							if(typeof callback !='undefined') return callback();
						}
					}
				});
			  }
			}
		);
	}
};

var amqpConfig = {
    amqpURL: 'amqp://localhost', // url to RabbitMQ server
    workers: 2 // number of async workers
  },
  amqp = require('amqplib/callback_api'),
  queueName = 'event_queue';

exports.startEventsTimer = function(callback) {
/*  amqp.connect(amqpConfig.amqpURL, function (err, connection) {
    if (err) {
      // do error handling
    }

    consumer(connection);

    if(typeof sails.timers.events == 'undefined') {
      sails.timers.events = setInterval(function(){
        if(!sails.processes.events) {
          sails.processes.events = true;
          logService.debug('running events update');

          publisher(connection);
        }
        sails.processes.events = false;
      },500);
    }
  });

  function publisher (connection) {
    connection.createChannel(function (err, channel) {
      if (err) {
        // do error handling
      }

      Event.post(
        {
          "SessionId": sails.config.appSession,
          "currentState": 'login',
          "method": 'select',
          "procedure": 'getEvents',
          "objects": [
            {
              "Arguments": {
                "Since": sails.storage.events.LastTimestamp.toISOString()
              }
            }
          ]
        },
        function (error, result) {
          // Error handling
          if (error) {
            console.log('BUUUUU:' + error);
            //return callback();

            // The Book was found successfully!
          } else {
            toolsService.parseResponse(result, function (msg) {
              console.log('success but failed:' + msg);
              //return callback();
            }, function (resultObject) {
              channel.assertQueue(queueName);

              var newIds = [];
              var newItems = {};
              _.each(resultObject.Rows, function (item) {
                newIds.push(item.ID);
                newItems[item.ID] = item;

                channel.sendToQueue(queueName, new Buffer(JSON.stringify(item)));
              });
            })
          }
        }
      );
    });
  }

  function consumer (connection) {
    connection.createChannel(function (err, channel) {
      if (err) {
        // do error handling
      }

      channel.assertQueue(queueName);

      channel.consume(queueName, function (message) {
        if (message !== null) {
          var item = message.content.toString();

          try {
            if (item != '') {
              item = JSON.parse(item);

              if(sails.storage.events.Ids.indexOf(item.ID)==-1) {
                console.log('new event: '+item.ID+' '+item.EventType+' '+item.Resource+' '+item.ID_Resource);
                sails.storage.events.Ids.push(item.ID);
                sails.storage.events.Items[item.ID] = item;
                sails.storage.events.LastTimestamp = new Date(item.Date);
                //var mili = sails.storage.events.LastTimestamp.getMilliseconds();
                //sails.storage.events.LastTimestamp.setMilliseconds(mili+1);
                switch(item.Resource) {
                  case 'Journal':
                    // send socket message with new activity log
                    eventService.addJournal(item.ID_Resource);
                    break;
                  case 'Transactions':
                    // send socket message that new transaction is available
                    Transaction.publishCreate({id:item.ID_Resource});
                    //RingSession.publishUpdate(1,{});
                    break;
                  case 'FavouriteProcedures':
                    // send socket message that new transaction is available
                    Favourite.publishCreate({id:item.ID_Resource});
                    //RingSession.publishUpdate(1,{});
                    break;
                  case 'Procedures':
                    switch(item.EventType) {
                      case 'insert':
                      case 'update':
                        Procedure.publishCreate({id:item.ID_Resource});
                        break;
                      case 'delete':
                        //console.log('delete procedure '+ item.ID_Resource);
                        //Procedure.publishDestroy(item.ID_Resource);
                        Procedure.publishCreate({id:item.ID_Resource});
                        break;
                    }
                    break;
                  case 'Alerts':
                    // update alerts
                    eventService.getAlerts();
                    //RingSession.publishUpdate(1,{});
                    break;
                  case 'Messages':
                    // update chat list
                    eventService.getChat();
                    break;
                  case 'Markets':
                    // send socket message that new market chart data is available
                    eventService.getMarketParams();
                    Market.publishCreate({id:item.ID_Resource});
                    break;
                  case 'Translations':
                    eventService.getTranslations();
                    break;
                  default:
                    console.log(item);
                }
              }
            }
          } catch (e) {
            // do error handling

            channel.ack(message);
          }
        }
      });
    });
  }*/

	return callback();
};

exports.startUsersTimer = function() {
	if(typeof sails.processes.users == 'undefined') sails.processes.users = {};
	if(typeof sails.timers.users == 'undefined') {
		sails.timers.users = setInterval(function(){
			if(!sails.processes.users) {
				sails.processes.users = true;
				if(typeof sails.storage.userSessions != 'undefined') {
					for(var i in sails.storage.userSessions) {
						if(sails.storage.userSessions[i].lastUpdate<Date.now()-1000*60 && sails.storage.userSessions[i].socket == null && !sails.storage.userSessions[i].user.isAdministrator) { // add check for admin user which has no socket connection
							console.log('user session expired');
							delete sails.storage.userSessions[i];
						}
					}
				}
			}
			sails.processes.users = false;
		},1000*60);
	}
};

exports.addJournal = function(id) {
	Journal.post(
		{
			"SessionId":sails.config.appSession,
			"currentState":'login',
			"method":'select',
			"procedure":'getJournal',
			"objects":
			[
				{
					"Arguments":
					{
						"ID_Journal": id
					}
				}
			]
		},
		function(error,result) {
		// Error handling
		  if (error) {
			console.log('BUUUUU:'+error);
		  // The Book was found successfully!
		  } else {
			toolsService.parseResponse(result,function(msg) {
				console.log('success but failed:'+msg);
			},
			function(resultObject) {
				if(resultObject.Rows.length>0) {
					var item = resultObject.Rows[0];
					Journal.publishCreate({id:item.ID,item:item});
				}
			});
		  }
	});
};

exports.getLastTransactions = function() {
	if(typeof sails.storage.orders!='undefined') {
		var count = 0;
		_.each(sails.storage.orders.Items,function(item) {
			if(typeof item!='undefined' && item.isActive) count++;
		});
		return count;
	}
};
