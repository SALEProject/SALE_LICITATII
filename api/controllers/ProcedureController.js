module.exports = {

	index: function(req,res) {
		var start = Date.now();
		var moment = require('moment');
		var args = {
			ID_Cpv: typeof req.param('ID_Cpv')!= 'undefined' && req.param('ID_Cpv')!='' ? req.param('ID_Cpv')*1 : null,
			ID_ContractType: typeof req.param('ID_ContractType')!= 'undefined' && req.param('ID_ContractType')!='' ? req.param('ID_ContractType')*1 : null,
			ID_ProcedureType: typeof req.param('ID_ProcedureType')!= 'undefined' && req.param('ID_ProcedureType')!='' ? req.param('ID_ProcedureType')*1 : null,
			ID_ProcedureCriterion: typeof req.param('ID_ProcedureCriterion')!= 'undefined' && req.param('ID_ProcedureCriterion')!='' ? req.param('ID_ProcedureCriterion')*1 : null,
			StartDate: typeof req.param('Start')!= 'undefined' && req.param('Start')!='' ? moment(req.param('Start'),'DD MMM YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS') : null,
			EndDate: typeof req.param('End')!= 'undefined' && req.param('End')!='' ? moment(req.param('End'),'DD MMM YYYY').format('YYYY-MM-DDTHH:mm:ss.SSS') : null,
			Status: typeof req.param('Status')!= 'undefined' && req.param('Status')!='' ? req.param('Status') : null,
			Public: typeof req.param('Public')!= 'undefined' && req.param('Public')!='' ? req.param('Public') : null
		};
		console.log('make procedures request: ' + (Date.now() - start));
		Procedure.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getProcedures',
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
						console.log('procedures response: ' + (Date.now() - start));
						return res.json({Success:true, ResultType:'Array', Result:result.Rows});
					}
				);
			}
		);
	},

	save: function (req, res) {
		if(req.method == 'POST') {
			console.log(req.body);
			var id = null;
			if(req.param('ID') && req.param('ID')!='') {
				id = req.param('ID')*1;
			};
			var moment = require('moment');
			var clarificationDeadline = req.param('ClarificationRequestsDeadline') ? moment(req.param('ClarificationRequestsDeadline'),'DD MMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS') : null;
			var receiptDeadline = req.param('TendersReceiptDeadline') ? moment(req.param('TendersReceiptDeadline'),'DD MMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS') : null;
			var openingDate = req.param('TendersOpeningDate') ? moment(req.param('TendersOpeningDate'),'DD MMM YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ss.SSS') : null;
			var ids = req.param('Classification').split(',');
			var cpvs = [];
			_.each(ids, function(x) {
				if(x != '') {
					cpvs.push(x*1);
				}
			});
			var args = req.body;
			args.TotalValue = req.param('TotalValue').replace(/\./g,'').replace(',','.')*1;
			args.Duration = req.param('Duration')*1;
			args.ID_ContractType = req.param('ID_ContractType')*1;
			args.ID_ProcedureType = req.param('ID_ProcedureType')*1;
			args.ID_ProcedureCriterion = req.param('ID_ProcedureCriterion')*1;
			args.ClarificationRequestsDeadline = clarificationDeadline;
			args.TendersReceiptDeadline = receiptDeadline;
			args.TendersOpeningDate = openingDate;
			args.ClassificationIDs = cpvs;
			/*
			var args = {
				"Name": req.param('Name'),
				"Description": req.param('Description'),
				"Location": req.param('Location'),
				"Legislation": req.param('Legislation'),
				"Duration": req.param('Duration')*1,
				"TotalValue": req.param('TotalValue').replace(/\./g,'').replace(',','.')*1,
				"ID_ContractType": req.param('ID_ContractType')*1,
				"ID_ProcedureType": req.param('ID_ProcedureType')*1,
				"ID_ProcedureCriterion": req.param('ID_ProcedureCriterion')*1,
				"ClassificationIDs": cpvs,
				"SubmitTime": req.param('SubmitTime')
			};
			*/
			delete args.ID;
			delete args.Classification;
			if(id) {
				args.ID_Procedure = id;
			}
			Procedure.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure":id ? "editProcedure" : "addProcedure",
					"service":'/BRMWrite.svc',
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
							return res.json({Success:true, ResultType:'Object', Result: {ID_Procedure: id ? id : result.ID_Procedure}});
						}
					);
				}
			);
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result:'no post data!'});
	},

	launch: function (req, res) {
		if(!req.param('id')) return res.json({Success:false, ResultType: 'GeneralError',Result:'missing parameter \'id\''});
		var message = '';
		if(req.method == 'POST') {
			Procedure.post(
				{
					"SessionId":req.sessionID,
					"currentState":'login',
					"method":'execute',
					"procedure":"setProcedureStatus",
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Procedure": req.param('id')*1,
								"Status": 'approved'
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
							return res.json({Success:true});
						}
					);
				}
			);
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result:'no post data!'});
	},

	delete: function (req, res) {
		if(!req.param('id')) return res.json({Success:false, ResultType: 'GeneralError',Result:'missing parameter \'id\''});
		var message = '';
		if(req.method == 'POST') {
			Procedure.post(
				{
					"SessionId":req.sessionID,
					"currentState":'login',
					"method":'execute',
					"procedure":"deleteProcedure",
					"service":'/BRMWrite.svc',
					"objects":[
						{
							"Arguments":{
								"ID_Procedure": req.param('id')*1
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
							return res.json({Success:true});
						}
					);
				}
			);
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result:'no post data!'});
	},

	favourites: function(req,res) {
		Procedure.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getFavouriteProcedures'
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
						if(typeof err == 'string') return res.json({Success:false, ResultType:'GeneralError', Result: err});
						else return res.json(err);
					},
					function(result){
						return res.json({Success:true, ResultType:'Array', Result:result.Rows});
					}
				);
			}
		);
	},

  upload: function (req, res) {
    if(req.method == 'POST') {
      var fileUrl = '';
      req.file('Document').upload({
          maxBytes: 10000000
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          req.flash('error', err);
          return res.send(200, '0');
        }
        if (uploadedFiles.length === 0){
          req.flash('error', 'No file was uploaded');
          return res.send(200, '0');
        }
        var newFilename = uploadedFiles[0].fd.replace(sails.config.appPath + '/.tmp/uploads/', '');
        fileUrl = '/uploads/' + newFilename;
        //console.log(req.body);

        var fileName = uploadedFiles[0].filename;

        req.session.documentTypes.forEach(function (item) {
          if (item.ID == req.param('ID_DocumentType')) {
            fileName = req.session.getTranslation(item.Name);
          }
        });

        Procedure.post({
            "SessionId":sessionService.getSessionID(req),
            "currentState":'login',
            "method":'execute',
            "procedure":'addProcedureDocument',
            "service":'/BRMWrite.svc',
            "objects":[
              {
                "Arguments": {
                  "ID_Procedure":req.param('ID_Procedure')*1,
                  "ID_DocumentType":req.param('ID_DocumentType')*1,
                  "Name":newFilename,//req.param('Name'),
                  "FileName":fileName,
                  "isPublic":req.param('isPublic') == '1',
                  "ID_CreatedByUser":req.session.currentUser.ID,
                  "DocumentURL": fileUrl
                }
              }
            ]
          },
          function(error,response) {
            return parserService.parse(error,response,
              function(err){
                req.flash('error',err);
                return res.send(200, '0');
              },
              function(result){
                req.flash('success','Documentul a fost adaugat cu succes!');
                return res.send(200, '1');
              });
          });
      });
    }
  },

	documents: function(req,res) {
		if(!req.param('ID_Procedure')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		Procedure.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getExportTemplates',
				"objects":[
					{
						"Arguments": {
							ID_Procedure: req.param('ID_Procedure')*1
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
						return res.json({Success:true, ResultType:'Array', Result:result.Rows});
					}
				);
			}
		);
	},

	uploaded: function(req,res) {
		if(!req.param('ID_Procedure')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		Procedure.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getProcedureDocuments',
				"objects":[
					{
						"Arguments": {
							ID_Procedure: req.param('ID_Procedure')*1
						}
					}
				]
			},
			function(error,response) {
				return parserService.parse(error,response,
					function(err){
            console.log(err);
						if (typeof err == 'string') {
              return res.json({Success:false, ResultType:'GeneralError', Result: err});
            } else {
              return res.json(err);
            }
					},
					function(result){
						return res.json({Success:true, ResultType:'Array', Result:result.Rows});
					}
				);
			}
		);
	},

	exporttemplate: function(req,res) {
		if(!req.param('id')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing template id'});
		Procedure.post(
			{
				"SessionId":sessionService.getSessionID(req),
				"currentState":'login',
				"method":'select',
				"procedure":'getExportTemplate',
				"objects":[
					{
						"Arguments": {
							ID_ExportTemplate: req.param('id')*1
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
						if(result.Rows.length>0) {
							var file = result.Rows[0];
							var fs = require('fs');
							var tmpName = sails.config.appPath+'/.tmp/'+Date.now()+'_'+result.Rows[0].FileName;
							console.log(tmpName);
							fs.open(tmpName,'w',function(err,fd) {
								if(err) {
									res.send(500,err);
								}
								var content = new Buffer(result.Rows[0].Content, 'base64').toString('ascii');
								fs.writeSync(fd,content);
								fs.closeSync(fd);
								res.set({
									"Content-Disposition": 'attachment; filename="'+result.Rows[0].FileName+'"'
								});
								res.sendfile(tmpName);

							});
						}
					}
				);
			}
		);
	},

	favouriteset: function (req, res) {
		if(!req.param('id')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		if(req.method == 'POST') {
			var args = {
				"ID_Procedure": req.param('id')*1
			};
			Procedure.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure": "setFavouriteProcedure",
					"service":'/BRMWrite.svc',
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
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result:'no post data!'});
	},

	favouritereset: function (req, res) {
		if(!req.param('id')) return res.json({Success:false, ResultType:'GeneralError', Result: 'missing procedure id'});
		if(req.method == 'POST') {
			var args = {
				"ID_Procedure": req.param('id')*1
			};
			Procedure.post(
				{
					"SessionId":sessionService.getSessionID(req),
					"currentState":'login',
					"method":'execute',
					"procedure": "resetFavouriteProcedure",
					"service":'/BRMWrite.svc',
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
		}
		else return res.json({Success:false, ResultType:'GeneralError', Result:'no post data!'});
	},

  clarification_request_create: function (req, res) {
    if(req.method == 'POST') {
      var fileUrl = '';
      req.file('Document').upload({
        maxBytes: 10000000
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          req.flash('error', err);
          return res.send(200, '0');
        }
        if (uploadedFiles.length === 0){
          req.flash('error', 'No file was uploaded');
          return res.send(200, '0');
        }

        uploadedFiles.forEach(function (file) {
          var newFilename = file.fd.replace(sails.config.appPath + '/.tmp/uploads/', '');
          fileUrl = '/uploads/' + newFilename;

          var fileName = file.filename;
        });

        // insert WS call here

        // send e-mail when WS call finishes successfully
        //emailService.sendEmail();

        return res.send(200, '1');
      });
    }
  },

  clarification_request_reply: function (req, res) {
    if(req.method == 'POST') {
      var fileUrl = '';
      req.file('Document').upload({
        maxBytes: 10000000
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          req.flash('error', err);
          return res.send(200, '0');
        }
        if (uploadedFiles.length === 0){
          req.flash('error', 'No file was uploaded');
          return res.send(200, '0');
        }

        uploadedFiles.forEach(function (file) {
          var newFilename = file.fd.replace(sails.config.appPath + '/.tmp/uploads/', '');
          fileUrl = '/uploads/' + newFilename;

          var fileName = file.filename;
        });

        // insert WS call here

        // send e-mail when WS call finishes successfully
        //emailService.sendEmail();

        return res.send(200, '1');
      });
    }
  },

  offer_create: function (req, res) {
    if(req.method == 'POST') {
      var fileUrl = '';
      req.file('Document').upload({
        maxBytes: 10000000
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          req.flash('error', err);
          return res.send(200, '0');
        }
        if (uploadedFiles.length === 0) {
          req.flash('error', 'No file was uploaded');
          return res.send(200, '0');
        }

        uploadedFiles.forEach(function (file) {
          var newFilename = file.fd.replace(sails.config.appPath + '/.tmp/uploads/', '');
          fileUrl = '/uploads/' + newFilename;

          var fileName = file.filename;
        });

        var args = {
          ID_Procedure: req.param('ID_Procedure'),
          Price: parseFloat(req.param('Price')),
          Deadline: new Date(req.param('Deadline'))
        };

        // insert WS call here

        // send e-mail when WS call finishes successfully
        //emailService.sendEmail();

        return res.send(200, '1');
      });
    }
  }
};
