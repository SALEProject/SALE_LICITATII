module.exports = {

	agencies: function (req, res) {
		var title = 'Agentii - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/agencies/agencies';
		return res.view(view,{layout:layout, title:title, items:req.session.agencies});
	},
  
  
	agency_add: function (req, res) {
		var title = 'Adaugare agentie - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/agencies/agency_add';
		if(req.method == 'POST') {
			var moment = require('moment');
			var startDate = moment(req.param('ContractStart'),'DD MMM YYYY');
			var endDate = moment(req.param('ContractEnd'),'DD MMM YYYY');
			Agency.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addAgency',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"Code":req.param('Code'),
								"Name":req.param('AgencyName'),
								"Status":req.param('Status'),
								"ContractStart":startDate.format('YYYY-MM-DDTHH:mm:ss.SSS'),
								"ContractEnd":endDate.format('YYYY-MM-DDTHH:mm:ss.SSS'),
								"ContractNumber":req.param('ContractNumber'),
								"FiscalCode":req.param('FiscalCode'),
								"RegisterCode":req.param('RegisterCode'),
								"Phone":req.param('Phone'),
								"Mobile":req.param('Mobile'),
								"Fax":req.param('Fax'),
								"Email":req.param('Email'),
								"Website":req.param('Website'),
								"StreetAddress":req.param('StreetAddress'),
								"City":req.param('City'),
								"ID_County":req.param('ID_County')*1,
								"PostalCode":req.param('PostalCode')
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view,{layout:layout, title:title, item:req.body});
						},
						function(result){
							req.flash('success','Agentia a fost adaugata cu succes!');
							if(typeof result == 'object' && typeof result.ID_Agency != 'undefined') {
								return res.redirect('/admin/agencies/edit/'+result.ID_Agency);
							}
							else {
								return res.redirect('/admin/agencies');
							}
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	agency_edit: function (req, res) {
		var title = 'Modificare agentie - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/agencies/agency_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			var moment = require('moment');
			var startDate = moment(req.param('ContractStart'),'DD MMM YYYY');
			var endDate = moment(req.param('ContractEnd'),'DD MMM YYYY');
			Agency.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editAgency',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Agency":req.param('id')*1,
								"Code":req.param('Code'),
								"Name":req.param('AgencyName'),
								"Status":req.param('Status'),
								"ContractStart":startDate.format('YYYY-MM-DDTHH:mm:ss.SSS'),
								"ContractEnd":endDate.format('YYYY-MM-DDTHH:mm:ss.SSS'),
								"ContractNumber":req.param('ContractNumber'),
								"FiscalCode":req.param('FiscalCode'),
								"RegisterCode":req.param('RegisterCode'),
								"Phone":req.param('Phone'),
								"Mobile":req.param('Mobile'),
								"Fax":req.param('Fax'),
								"Email":req.param('Email'),
								"Website":req.param('Website'),
								"StreetAddress":req.param('StreetAddress'),
								"City":req.param('City'),
								"ID_County":req.param('ID_County')*1,
								"PostalCode":req.param('PostalCode')
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view,{layout:layout, title:title, item:req.body});
						},
						function(result){
							req.flash('success','Agentia a fost modificata cu succes!');
							return res.redirect('/admin/agencies/edit/'+req.param('id')*1);
						}
					);
				}
			);
		}
		else {
			Agency.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getAgencies',
					"objects":[{
						"Arguments":{
							ID_Agency:req.param('id')*1
						}
					}]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view,{layout:layout, title:title, item:{}});
						},
						function(result){
							var agency;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) agency = item; 
							});
							if(!agency) return res.send(500,'Agency not found!');
							return res.view(view,{layout:layout, title:title, item:agency});
						}
					);
				}
			);
		}
	},

	agency_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Agency.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteAgency',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_Agency":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/agencies');
					},
					function(result){
						req.flash('success','Agentia a fost stearsa cu succes!');
						return res.redirect('/admin/agencies');
					}
				);
			}
		);
	},

	setAgency2Ring: function (req,res) {
		if(!req.param('agency_id')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'agency_id\''});
		if(!req.param('ring_id')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'ring_id\''});
		if(!req.param('checked')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'checked\''});
		if(req.method == 'POST') {
			Agency.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":"setAgency2Ring",
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Agency": req.param('agency_id')*1,
								"ID_Ring": req.param('ring_id')*1,
								"isAgreed": (req.param('checked')=='true'?true:false)
							}
						}
					]
				},
				function(error,result) {				  
				  if (error) {				  	
					if(error.hasOwnProperty('name') && error.name=='ConnectTimeoutError') message = 'Connection timeout. Please try again later.';
					else message = error;
					return res.json({Success:false,ResultType:'GeneralError',Result:message});
				  } else {
					toolsService.parseResponse(result,function(msg) {
						return res.json(result);
					},
					function(resultObject) {
						return res.json({Success:true});
					});
				  }
			});
		}
		else return res.json({Success:false,ResultType:'GeneralError',Result:'no post data!'});
	},

	setClient2Agency: function (req,res) {
		if(!req.param('agency_id')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'agency_id\''});
		if(!req.param('client_id')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'client_id\''});
		if(!req.param('checked')) return res.json({Success:false,ResultType:'GeneralError',Result:'missing parameter \'checked\''});
		if(req.method == 'POST') {
			Agency.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":"setClient2Agency",
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Agency": req.param('agency_id')*1,
								"ID_Client": req.param('client_id')*1,
								"isDeleted": (req.param('checked')=='true'?true:false)
							}
						}
					]
				},
				function(error,result) {				  
				  if (error) {				  	
					if(error.hasOwnProperty('name') && error.name=='ConnectTimeoutError') message = 'Connection timeout. Please try again later.';
					else message = error;
					return res.json({Success:false,ResultType:'GeneralError',Result:message});
				  } else {
					toolsService.parseResponse(result,function(msg) {
						return res.json(result);
					},
					function(resultObject) {
						return res.json({Success:true});
					});
				  }
			});
		}
		else return res.json({Success:false,ResultType:'GeneralError',Result:'no post data!'});
	}
};
