module.exports = {

	procedure_legislations: function (req, res) {
		var title = 'Tip Procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_legislations/procedure_legislations';
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getProcedureLegislations'
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

	procedure_legislation_add: function (req, res) {
		var title = 'Adaugare legislatie procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_legislations/procedure_legislation_add';
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addProcedureLegislation',
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
								req.flash('success','Legislatia a fost adaugata cu succes!');
								return res.redirect('/admin/procedure_legislations');
							});
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	procedure_legislation_edit: function (req, res) {
		var title = 'Modificare legislatie procedura - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/procedure_legislations/procedure_legislation_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editProcedureLegislation',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_ProcedureLegislation":req.param('id')*1,
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
								req.flash('success','Legislatia a fost modificata cu succes!');
								return res.redirect('/admin/procedure_legislations');
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
					"procedure":'getProcedureLegislations',
					"objects":[{
						"Arguments":{
							ID_ProcedureLegislation:req.param('id')*1
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
							var procedureLegislation;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) procedureLegislation = item; 
							});
							if(!procedureLegislation) return res.send(500,'Procedure legislation not found!');
							return res.view(view,{layout:layout, title:title, item:procedureLegislation});
						}
					);
				}
			);
		}
	},

	procedure_legislation_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteProcedureLegislation',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_ProcedureLegislation":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/procedure_legislations');
					},
					function(result){
						req.flash('success','Legislatia a fost stearsa cu succes!');
						return res.redirect('/admin/procedure_legislations');
					}
				);
			}
		);
	}
};
