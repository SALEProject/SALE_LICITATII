module.exports = {

	procedure_types: function (req, res) {
		var title = 'Tip Procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_types/procedure_types';
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getProcedureTypes'
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

	procedure_type_add: function (req, res) {
		var title = 'Adaugare tip procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_types/procedure_type_add';
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addProcedureType',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN'),
								"Description_RO":req.param('Description_RO'),
								"Description_EN":req.param('Description_EN'),
								"ValueThreshold":req.param('ValueThreshold') * 1,
								"ClarificationRequestsOffset":req.param('ClarificationRequestsOffset') * 1,
								"TendersReceiptOffset":req.param('TendersReceiptOffset') * 1
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
								req.flash('success','Tipul de procedura a fost adaugat cu succes!');
								return res.redirect('/admin/procedure_types');
							});
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	procedure_type_edit: function (req, res) {
		var title = 'Modificare tip procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_types/procedure_type_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editProcedureType',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_ProcedureType":req.param('id')*1,
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN'),
								"Description_RO":req.param('Description_RO'),
								"Description_EN":req.param('Description_EN'),
								"ValueThreshold":req.param('ValueThreshold') * 1,
								"ClarificationRequestsOffset":req.param('ClarificationRequestsOffset') * 1,
								"TendersReceiptOffset":req.param('TendersReceiptOffset') * 1
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
								req.flash('success','Tipul de procedura a fost modificat cu succes!');
								return res.redirect('/admin/procedure_types');
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
					"procedure":'getProcedureTypes',
					"objects":[{
						"Arguments":{
							ID_ProcedureType:req.param('id')*1
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
							var procedureType;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) procedureType = item; 
							});
							if(!procedureType) return res.send(500,'Procedure type not found!');
							return res.view(view,{layout:layout, title:title, item:procedureType});
						}
					);
				}
			);
		}
	},

	procedure_type_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteProcedureType',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_ProcedureType":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/procedure_types');
					},
					function(result){
						req.flash('success','Tipul de procedura a fost sters cu succes!');
						return res.redirect('/admin/procedure_types');
					}
				);
			}
		);
	}
};
