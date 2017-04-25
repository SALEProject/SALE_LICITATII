module.exports = {

	index: function(req,res) {
		if(!req.param('ID_Procedure')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		Form.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getFormData',
				"objects":[
					{
						"Arguments": {
							"Step": req.param('Step')*1,
							"ID_Procedure": req.param('ID_Procedure')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'JSONForm', Result:result});
					}
				);
			}
		);
	},
	
	getid: function(req,res) {
		if(!req.param('ID_Procedure')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		Form.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getForms',
				"objects":[
					{
						"Arguments": {
							"Step": req.param('Step')*1,
							"ID_Procedure": req.param('ID_Procedure')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						var item = null;
						if(result.Rows.length>0) {
							item = result.Rows[0];
						}
						return res.json({Success:true, ResultType:'Object', Result:item});
					}
				);
			}
		);
	},
	
	save: function(req,res) {
		if(!req.param('id')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		var args = req.body;
		args.ID_Procedure = req.param('id')*1;
		args.ID_Form = args.ID_Form*1;
		for(var i in args) {
			if(Array.isArray(args[i])) {
				args[i] = args[i].length>0 ? args[i][0] : ''
			}
		}
		Form.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"service":'/BRMWrite.svc',
				"method":'execute',
				"procedure":'setFormData',
				"objects":[
					{
						"Arguments": args
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true});
					}
				);
			}
		);
	},
	
	// admin
	forms: function (req, res) {
		var title = 'Formulare - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/forms/forms';
		Form.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'dashboard',
				"method":'select',
				"procedure":'getForms',
				"objects": [
					{
						"Arguments": {
							"all": true,
							"anystatus": true
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
  
  
	form_add: function (req, res) {
		var title = 'Adaugare form - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/forms/form_add';
		if(req.method == 'POST') {
			//console.log(req.files);
			var fileUrl = '';
			var template = null;
			var exportTemplate = null;
			var count = 0;
			req.file('Template').upload({
				maxBytes: 10000000
				},function whenDone(err, uploadedFiles) {
					if (err) {
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, item:req.body});
					}
					if (uploadedFiles.length === 0){
						req.flash('error','No file was uploaded');
						return res.view(view,{layout:layout, title:title, item:req.body});
					}
					console.log(uploadedFiles[0]);
					var fs = require('fs');
					var file_content = fs.readFileSync(uploadedFiles[0].fd);
					console.log(file_content);
					template = new Buffer(file_content).toString('base64');
					count++;
					
					var x = toolsService.addForm(req,res,view,layout,title, template, exportTemplate, count);
					if(x !== null) return x;
				}
			);
			req.file('ExportTemplate').upload({
				maxBytes: 10000000
				},function whenDone(err, uploadedFiles) {
					if (err) {
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, item:req.body});
					}
					if (uploadedFiles.length !== 0){
						var fs = require('fs');
						var file_content = fs.readFileSync(uploadedFiles[0].fd);
						console.log(file_content);
						exportTemplate = new Buffer(file_content).toString('base64');
					}
					console.log(uploadedFiles[0]);
					count++;
					
					var y = toolsService.addForm(req,res,view,layout,title, template, exportTemplate, count);
					if(y !== null) return y;
				}
			);
		}
		else return res.view(view,{layout:layout, title:title, item:{}});
	},

	form_edit: function (req, res) {
		var title = 'Modificare formular - Panou de control - '+sails.config.appName;
		var layout = 'adminLayout';
		var view = 'admin/forms/form_add';
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		var asset = null;
		if(req.method == 'POST') {
			var fileUrl = '';
			var template = null;
			var exportTemplate = null;
			var count = 0;
			req.file('Template').upload({
				maxBytes: 10000000
				},function whenDone(err, uploadedFiles) {
					if (err) {
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, item:req.body});
					}
					if (uploadedFiles.length === 0){
						count++;
						var x = toolsService.editForm(req,res,view,layout,title, template, exportTemplate, count);
						if(x !== null) return x;
					}
					else {
						console.log(uploadedFiles[0]);
						var fs = require('fs');
						var file_content = fs.readFileSync(uploadedFiles[0].fd);
						console.log(file_content);
						template = new Buffer(file_content).toString('base64')
						count++;
						var y = toolsService.editForm(req,res,view,layout,title, template, exportTemplate, count);
						if(y !== null) return x;
					}
				}
			);
			req.file('ExportTemplate').upload({
				maxBytes: 10000000
				},function whenDone(err, uploadedFiles) {
					if (err) {
						req.flash('error',err);
						return res.view(view,{layout:layout, title:title, item:req.body});
					}
					if (uploadedFiles.length === 0){
						count++;
						var x = toolsService.editForm(req,res,view,layout,title, template, exportTemplate, count);
						if(x !== null) return x;
					}
					else {
						console.log(uploadedFiles[0]);
						var fs = require('fs');
						var file_content = fs.readFileSync(uploadedFiles[0].fd);
						console.log(file_content);
						exportTemplate = new Buffer(file_content).toString('base64')
						count++;
						var y = toolsService.editForm(req,res,view,layout,title, template, exportTemplate, count);
						if(y !== null) return x;
					}
				}
			);
		}
		else {
			Form.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'select',
					"procedure":'getForms',
					"objects":[{
						"Arguments":{
							"ID_Form":req.param('id')*1,
							"all": true,
							"anystatus": true
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
							var document;
							_.each(result.Rows,function(item){
								if(item.ID==req.param('id')) document = item; 
							});
							if(!document) return res.send(500,'Form not found!');
							return res.view(view,{layout:layout, title:title, item:document});
						}
					);
				}
			);
		}
	},
	form_delete: function (req, res) {
		if(!req.param('id')) return res.send(500,'Missing ID parameter!');
		Form.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'execute',
				"procedure":'deleteForm',
				"service":'/BRMWrite.svc',
				"objects":[
					{
						"Arguments":{
							"ID_Form":req.param('id')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						req.flash('error',err);
						return res.redirect('/admin/forms');
					},
					function(result){
						req.flash('success','Formularul a fost sters cu succes!');
						return res.redirect('/admin/forms');
					}
				);
			}
		);
	}
};
