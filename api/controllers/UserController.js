module.exports = {

	index: function (req, res) {
		if(req.isSocket) {
			var users = [];
			for(var i in sails.storage.userSessions) {
				users.push(sails.storage.userSessions[i].user);
			}
			/*
			if(Object.keys(sails.io.sockets.sockets).length>0) {
				_.each(Object.keys(sails.io.sockets.sockets), function(session) {
					  var idx = toolsService.searchItemInArray(session,sails.storage.userSessions,'id');
					  if(idx>-1) {
						users.push(sails.storage.userSessions[idx].user);
					  }
				});
			}
			*/
			return res.json({Success: true, ResultType: 'Array', Result: users});
		}
		else return res.view({layout:'empty'});
	},

	users: function (req, res) {
		var title = 'Utilizatori - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/users/users';
		Login.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'getusers'
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, users:[]});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, users:result.Rows});
					}
				);
			}
		);
	},
  
	user_add: function (req, res) {
		var title = 'Adauga utilizator - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/users/user_add';
		if(req.method == 'POST') {
			Login.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'adduser',
					"objects":[
						{
							"Arguments":{
								"LoginName":req.param('LoginName'),
								"LoginPassword":req.param('LoginPassword'),
								"Email":req.param('Email'),
								"FirstName":req.param('FirstName'),
								"LastName":req.param('LastName'),
								"Phone":req.param('Phone'),
								"Fax":req.param('Fax'),
								"Mobile":req.param('Mobile'),
								"SocialCode":req.param('SocialCode'),
								"IdentityCard":req.param('IdentityCard'),
								"ID_Agency":req.param('ID_Agency_none') ? -1 : req.param('ID_Agency')*1,
								"ID_UserRole":_.toArray(_.map(req.param('ID_UserRole'),function(x){ return x*1; }))
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
							req.flash('success','Utilizatorul a fost adaugat cu succes!');
							return res.redirect('/admin/users');
						}
					);
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	user_edit: function (req, res) {
		var title = 'Modificare utilizator - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/users/user_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		if( req.method == 'POST') {
			Login.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'edituser',
					"objects":[
						{
							"Arguments":{
								"ID_User":req.param('id')*1,
								"LoginName":req.param('LoginName'),
								"LoginPassword":req.param('LoginPassword'),
								"Email":req.param('Email'),
								"FirstName":req.param('FirstName'),
								"LastName":req.param('LastName'),
								"Phone":req.param('Phone'),
								"Fax":req.param('Fax'),
								"Mobile":req.param('Mobile'),
								"SocialCode":req.param('SocialCode'),
								"IdentityCard":req.param('IdentityCard'),
								"ID_Agency":req.param('ID_Agency_none') ? -1 : req.param('ID_Agency')*1,
								//"ID_UserRole":(req.param('ID_UserRole')?req.param('ID_UserRole'):'0')*1
								"ID_UserRole":_.toArray(_.map(req.param('ID_UserRole'),function(x){ return x*1; }))
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
							req.flash('success','Utilizatorul a fost modificat cu succes!');
							return res.redirect('/admin/users');
						}
					);
				}
			);
		}
		else {
			Login.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'getusers'
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view,{layout:layout, title:title});
						},
						function(result){
							var user;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) user = item; 
							});
							if(!user) return res.send(500,'User not found!');
							else return res.view(view,{layout:layout, title:title, item:user});
						}
					);
				}
			);
		}
	},

	user_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Login.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'deleteuser',
				"service":'/BRMLogin.svc',
				"objects":[
					{
						"Arguments":{
							"ID_User":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/users');
					},
					function(result){
						req.flash('success','Utilizatorul a fost sters cu succes!');
						return res.redirect('/admin/users');
					}
				);
			}
		);
	}
};
