module.exports = {

	translations: function (req, res) {
		var title = 'Traduceri - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/translations/translations';
		var items = [];
		for(var i in sails.storage.translations) {
			items.push(sails.storage.translations[i]);
		}
		return res.view(view,{layout:layout, title:title, items:items});
		/*
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getTranslations'
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[]});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows});
					}
				);
			}
		);
		*/
	},
  
  
	translation_add: function (req, res) {
		var title = 'Adaugare traducere - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/translations/translation_add';
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'addTranslation',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"Label":req.param('Label'),
								"Value_RO":req.param('Value_RO'),
								"Value_EN":req.param('Value_EN'),
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
							eventService.getTranslations(function() {
								req.flash('success','Traducerea a fost adaugata cu succes!');
								return res.redirect('/admin/translations');
							});
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	translation_edit: function (req, res) {
		var title = 'Modificare traducere - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/translations/translation_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if(req.method == 'POST') {
			Nomenclator.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":'editTranslation',
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Translation":req.param('id')*1,
								"Label":req.param('Label'),
								"Value_RO":req.param('Value_RO'),
								"Value_EN":req.param('Value_EN')
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
							eventService.getTranslations(function() {
								req.flash('success','Traducerea a fost modificata cu succes!');
								return res.redirect('/admin/translations');
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
					"procedure":'getTranslations',
					"objects":[{
						"Arguments":{
							"ID_Translation":req.param('id')*1
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
							var translation;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) translation = item; 
							});
							if(!translation) return res.send(500,'Translation not found!');
							return res.view(view,{layout:layout, title:title, item:translation});
						}
					);
				}
			);
		}
	},

	translation_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Nomenclator.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteTranslation',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_Translation":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/translations');
					},
					function(result){
						req.flash('success','Traducerea a fost stersa cu succes!');
						return res.redirect('/admin/translations');
					}
				);
			}
		);
	},
	
	all: function (req, res) {
		var items = {};
		if(req.session.lang.code=='RO') var lang_value = 'Value_RO';
		else var lang_value = 'Value_EN';
		for(var i in sails.storage.translations) {
			items[sails.storage.translations[i].Label] = sails.storage.translations[i][lang_value];
		}
		return res.json({Success:true, ResultType:'Object', Result: items});
	},

	js: function (req, res) {
		var items = {};
		if(req.session.lang.code=='RO') var lang_value = 'Value_RO';
		else var lang_value = 'Value_EN';
		for(var i in sails.storage.translations) {
			items[sails.storage.translations[i].Label] = sails.storage.translations[i][lang_value];
		}
		return res.view({layout:null, items:items});
	}
};
