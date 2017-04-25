module.exports = {

	procedure_criteria: function (req, res) {
		var title = 'Tip Procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_criteria/procedure_criteria';
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getProcedureCriteria'
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

	procedure_criteria_add: function (req, res) {
		var title = 'Adaugare legislatie procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_criteria/procedure_criteria_add';
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addProcedureCriteria',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN'),
								"Description_RO":req.param('Description_RO'),
								"Description_EN":req.param('Description_EN')
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
								req.flash('success','Criteriul a fost adaugat cu succes!');
								return res.redirect('/admin/procedure_criteria');
							});
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	procedure_criteria_edit: function (req, res) {
		var title = 'Modificare legislatie procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_criteria/procedure_criteria_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editProcedureCriteria',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_ProcedureCriteria":req.param('id')*1,
								"Name_RO":req.param('Name_RO'),
								"Name_EN":req.param('Name_EN'),
								"Description_RO":req.param('Description_RO'),
								"Description_EN":req.param('Description_EN')
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
								req.flash('success','Criteriul a fost modificat cu succes!');
								return res.redirect('/admin/procedure_criteria');
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
					"procedure":'getProcedureCriteria',
					"objects":[{
						"Arguments":{
							ID_ProcedureCriteria:req.param('id')*1
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
							var procedureCriteria;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) procedureCriteria = item; 
							});
							if(!procedureCriteria) return res.send(500,'Procedure criteria not found!');
							return res.view(view,{layout:layout, title:title, item:procedureCriteria});
						}
					);
				}
			);
		}
	},

	procedure_criteria_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteProcedureCriteria',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_ProcedureCriteria":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/procedure_criteria');
					},
					function(result){
						req.flash('success','Criteriul a fost stears cu succes!');
						return res.redirect('/admin/procedure_criteria');
					}
				);
			}
		);
	}
};
