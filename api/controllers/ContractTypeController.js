module.exports = {

	contract_types: function (req, res) {
		var title = 'Tip Procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/contract_types/contract_types';
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getContractTypes'
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error', err);
						return res.view(view,{layout:layout, title:title, items:[]});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows});
					}
				);
			}
		);
	},

	contract_type_add: function (req, res) {
		var title = 'Adaugare tip procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/contract_types/contract_type_add';
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addContractType',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN')
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
							//var sleep = require('sleep');
							//sleep.sleep(1);
							eventService.getTranslations(function() {
								req.flash('success','Tipul de contract a fost adaugat cu succes!');
								return res.redirect('/admin/contract_types');
							});
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	contract_type_edit: function (req, res) {
		var title = 'Modificare tip contract - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/contract_types/contract_type_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editContractType',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_ContractType":req.param('id')*1,
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN')
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
							//var sleep = require('sleep');
							//sleep.sleep(1);
							eventService.getTranslations(function() {
								req.flash('success','Tipul de contract a fost modificat cu succes!');
								return res.redirect('/admin/contract_types');
							});
						}
					);
				}
			);
		}
		else {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getContractTypes',
					"objects":[{
						"Arguments":{
							ID_ContractType:req.param('id')*1
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
							var contractType;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) contractType = item; 
							});
							if(!contractType) return res.send(500,'Contract type not found!');
							return res.view(view,{layout:layout, title:title, item:contractType});
						}
					);
				}
			);
		}
	},

	contract_type_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteContractType',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_ContractType":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/contract_types');
					},
					function(result){
						req.flash('success','Tipul de contract a fost sters cu succes!');
						return res.redirect('/admin/contract_types');
					}
				);
			}
		);
	}
};
