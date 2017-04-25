module.exports = {
    
	index: function (req, res) {
		return res.redirect('/reports/orders');
	},
	
	orders: function (req, res) {
		var title = req.session.getTranslation('Order_history');
		var section = 'reports';
		var layout = 'accountLayout';
		var msg = '';
		var view = 'report/index';
 
		if(req.method=="POST") {
			GridReport.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getReportDataSet',
					"objects":
					[
						{
							"Arguments":
							{
								"ReportName": 'Istoric Ordine',
								"StartDate": req.param('StartDate'),
								"EndDate": req.param('EndDate')
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
						},
						function(result){
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes, table:result.Columns, data:result.Rows});
						}
					);
				}
			);
		}
		else return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
	},
	
	transactions: function (req, res) {
		var title = req.session.getTranslation('Transaction_history');
		var section = 'reports';
		var layout = 'accountLayout';
		var msg = '';
		var view = 'report/index';
 
		if(req.method=="POST") {
			GridReport.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getReportDataSet',
					"objects":
					[
						{
							"Arguments":
							{
								"ReportName": 'Istoric Tranzactii',
								"StartDate": req.param('StartDate'),
								"EndDate": req.param('EndDate')
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
						},
						function(result){
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes, table:result.Columns, data:result.Rows});
						}
					);
				}
			);
		}
		else return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
	},
	
	events: function (req, res) {
		var title = req.session.getTranslation('Events');
		var section = 'reports';
		var layout = 'accountLayout';
		var msg = '';
		var view = 'report/index';
 
		if(req.method=="POST") {
			GridReport.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getReportDataSet',
					"objects":
					[
						{
							"Arguments":
							{
								"ReportName": 'Istoric Tranzactii',
								"StartDate": req.param('StartDate'),
								"EndDate": req.param('EndDate')
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							req.flash('error',err);
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
						},
						function(result){
							return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes, table:result.Columns, data:result.Rows});
						}
					);
				}
			);
		}
		else return res.view(view, { layout: layout, title:title, section:section, reporttypes:req.session.reportTypes});
	},
	
	download:function(req,res) {
		if(!req.param('id')) return res.send(404);
		else {
			Report.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'generatereport',
					"procedure":'Transaction',
					"objects":
					[
						{
							"Arguments":
							{
								"ID_Transaction": req.param('id')*1
							}
						}
					]
				},
				function(error,response) {
					return parserService.parse(error,response,
						function(err){
							return res.send(err,500);
						},
						function(result){
							res.setHeader('Content-disposition', 'attachment; filename="' + result.FileName + '"');
							res.setHeader('Content-type', 'application/pdf')
							var buf = new Buffer(result.Base64Data, 'base64');;
							return res.send(buf);
						}
					);
				}
			);
		}
	},

	assets: function (req, res) {
		var title = 'Active - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets';
		var ring = null;
		if(req.param('ring')) {
			ring = req.param('ring') * 1;
		}

		Ring.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getAssets',
				"objects":[
					{
						"Arguments":{
							"ID_Market":sails.marketId,
							"ID_Ring": (ring ? ring*1 : -1),
							"anystatus":true,
							"all":true
						}
					}
				]
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
	},

	assets_index: function (req, res) {
		var title = 'Active - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/index';
		var ring = null;
		if(req.param('ring')) {
			ring = req.param('ring') * 1;
		}

		Ring.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getAssets',
				"objects":[
					{
						"Arguments":{
							"ID_Market":sails.marketId,
							"ID_Ring": (ring ? ring*1 : -1),
							"anystatus":true,
							"all":true
						}
					}
				]
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
	},

	assets_participants: function (req, res) {
		var title = 'Active - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_participants';
		var ring = null;
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Ring.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getAssetClients',
				"objects": [
					{
						"Arguments": {
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_orders: function (req, res) {
		var title = 'Ordine - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_orders';
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Order.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getOrders',
				"objects":[
					{
						"Arguments":{
							"ID_Market":sails.marketId,
							"ID_Broker":-1,
							"all":true,
							"anystatus":true,
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_transactions: function (req, res) {
		var title = 'Tranzactii - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_transactions';
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Transaction.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getTransactions',
				"objects":[
					{
						"Arguments":{
							"ID_Broker": -1,
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_warranties: function (req, res) {
		var title = 'Garantii - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_warranties';
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Warranty.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getAssetWarranties',
				"objects":[
					{
						"Arguments":{
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_documents: function (req, res) {
		var title = 'Documente - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_documents';
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Document.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getDocuments',
				"objects":[
					{
						"Arguments":{
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_quotes: function (req, res) {
		var title = 'Tranzactii - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_quotes';
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Transaction.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getAssetQuotations',
				"objects":[
					{
						"Arguments":{
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, items:result.Rows, asset: asset});
					}
				);
			}
		);
	},

	assets_tradeparams: function (req, res) {
		var title = 'Detalii Activ - Contul meu - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/admin_reports/assets_tradeparams';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		var ID_Asset = req.param('id') * 1;
		var asset = toolsService.getArrayItem(req.session.assets,req.param('id')*1);
		Agency.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getAgencyAssets',
				"objects":[
					{
						"Arguments":{
							"ID_Agency":req.session.currentUser.ID_Agency,
							"ID_Asset": (ID_Asset ? ID_Asset*1 : -1)
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, items:[], asset: asset});
					},
					function(result){
						return res.view(view,{layout:layout, title:title, item:result.Rows[0], asset: asset});
					}
				);
			}
		);
	}
};
