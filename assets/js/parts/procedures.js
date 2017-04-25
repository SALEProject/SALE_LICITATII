/****** data functions ***************/

var procedures = {};
var myProcedures = {};
var marketFilters = {
};
var selectedCpvs = [];
var currentStep = 0;
var waitingFor = false;

function getProcedures(clear, filters) {
	var start = Date.now();
	$.get('/procedure', typeof filters != 'undefined' ? filters : {}, function(response) {
		if(response.Success) {
			if(clear) {
				procedures = {};
				myProcedures = {};
			}
			console.log('get procedures: '+ (Date.now() - start));
			if(response.Result && response.Result.length>0) {
				for (var i=0;i<response.Result.length;i++) {
					processProcedure(response.Result[i]);
				}
			}
			console.log('procedures processed: '+ (Date.now() - start));
			$.event.trigger('proceduresLoaded',clear);
		}
		else log('get procedures: '+response.Result);
	});
}

function processProcedure(item) {
	//var old = getArrayItem(procedures,item.ID);
	procedures[item.ID] = item;
	$.event.trigger({type:'procedureUpdated',ID:item.ID});
	if(item.ID_Broker == b_id) {
		myProcedures[item.ID] = item;
		$.event.trigger({type:'myProcedureUpdated',ID:item.ID});
	}
}

function jq( myid ) {
    return myid.replace( /(:|\@|\.|\[|\]|,)/g, "\\$1" );
}

/****** view functions ***************/

function updateProcedures(clear) {
	var start = Date.now();
	var $container = $("#procedures-container");
	var $list = $("#procedures-list");
	if($container.length>0) {
		if(clear) {
			$list.html('');
		}
		$container.find(".loader").show();
		for (var i in procedures) {
			updateProcedure(procedures[i].ID);
		}
		if(Object.keys(procedures)==0) {
			$list.html('<li class="empty-message text-center">No items</li>');
		}
		$container.find(".loader").hide();
		$.event.trigger('proceduresShown',clear);
	}
	console.log('update procedures: '+ (Date.now() - start));
}

function updateMyProcedures(clear) {
	var start = Date.now();
	var $container = $("#my-procedures-container");
	var $list = $("#my-procedures-list");
	var $scroller = $("#my-procedures-scroller");
	if($container.length>0) {
		if(clear) {
			$list.html('');
		}
		$container.find(".empty-message").remove();
		$container.find(".loader").show();
		for (var i in myProcedures) {
			updateMyProcedure(myProcedures[i].ID);
		}
		if(Object.keys(myProcedures)==0) {
			$list.html('<li class="empty-message text-center">No items</li>');
		}
		if($list.height()>300) {
			$scroller.slimScroll({
				size: '5px',
				color: '#E6E6E6',
				height: $(this).attr("data-height"),
				railVisible: true,
				railColor: '#fff',
				opacity: 1,
				railOpacity: 0,
				alwaysVisible: true,
				disableFadeOut: true
			});
		}
		else {
			if($scroller.parent('.slimScrollDiv').size() > 0) {
				$scroller.parent().replaceWith($scroller);
			}
		}
		$container.find(".loader").hide();
		$.event.trigger('myProceduresShown',clear);
	}
	console.log('update my procedures: '+ (Date.now() - start));
}

function updateProcedure(id) {
	var $item = $("#procedure-"+id);
	var item = procedures[id];
	if(item && item.Status != 'draft' && item.Status != '') {
		var $list = $("#procedures-list");
		if(item.isDeleted) {
			$item.remove();
			$.event.trigger({type:'procedureDeleted',ID:item.ID});
		}
		var html = $list.data('prototype');
		if(typeof html == 'undefined') {
			log('procedure list has no prototype');
		}
		else {
			html = getPrototypeData(item,html);
			if(typeof procedureTypes[item.ID_ProcedureType] != 'undefined') {
				var type = getTranslation(procedureTypes[item.ID_ProcedureType].Name);
				html = html.replace(/__PROCEDURE_TYPE__/g, type);
				html = html.replace(/__PROCEDURE_TYPE_LABEL__/g, type.replace(' ','_').toLowerCase());
			}
			else {
				html = html.replace(/__PROCEDURE_TYPE_LABEL__/g,'');
				html = html.replace(/__PROCEDURE_TYPE__/g,'');
			}

      var anchor = $(html).find('.procedure-favourite');

			if(typeof favouriteProcedures != 'undefined' && typeof favouriteProcedures[item.ID] != 'undefined') {
				html = html.replace(/__IS_FAVOURITE__/g,'added');
				html = html.replace(/__FAV_ANCHOR_TITLE__/g,anchor.data('title-added'));
			}
			else {
				html = html.replace(/__IS_FAVOURITE__/g,'');
        html = html.replace(/__FAV_ANCHOR_TITLE__/g,anchor.data('title'));
			}
			if($item.length>0) {
				$item.replaceWith(html);
			}
			else {
				$list.append(html);
			}
			$.event.trigger({type:'procedureShown',ID:item.ID});
		}
	}
	else {
		log('procedure #'+id+' not found');
	}
}

function updateProcedureData(id) {
	var $item = $("#procedure-"+id);
	var item = procedures[id];
	if(item) {
		var $list = $("#procedures-list");
		if(item.Status == '' || item.Status == 'draft') {
		}
		else {
			$item.find('.delete-procedure').remove();
		}
		$item.find('.procedure-launch').html(moment(item.Date).format('DD.MM.YYYY HH:mm'));
		if(item.ClarificationRequestsDeadline) {
			$item.find('.procedure-clarifications-deadline').html(moment(item.ClarificationRequestsDeadline).format('DD.MM.YYYY HH:mm'));
		}
		if(item.TendersReceiptDeadline) {
			$item.find('.procedure-deadline').html(moment(item.TendersReceiptDeadline).format('DD.MM.YYYY HH:mm'));
		}
	}
	else {
		log('procedure #'+id+' not found');
	}
}

function updateMyProcedure(id) {
	var $item = $("#my-procedure-"+id);
	var item = myProcedures[id];
	if(item) {
		var $list = $("#my-procedures-list");
		if(item.isDeleted) {
			$item.remove();
			$.event.trigger({type:'procedureDeleted',ID:item.ID});
		}
		var html = $list.data('prototype');
		if(typeof html == 'undefined') {
			log('my procedure list has no prototype');
		}
		else {
			html = getPrototypeData(item,html);
			if($item.length>0) {
				$item.replaceWith(html);
			}
			else {
				$list.append(html);
			}
			$.event.trigger({type:'myProcedureShown',ID:item.ID});
		}
	}
	else {
		log('my procedure #'+id+' not found');
	}
}
function updateMyProcedureData(id) {
	var $item = $("#my-procedure-"+id);
	var item = myProcedures[id];
	if(item.Status == '' || item.Status == 'draft') {
	}
	else {
		$item.find('.delete-procedure').remove();
	}
}

function changeStep(step,item) {
	console.log(step);
	var $container = $("#procedure-form-container");
	if(step!=currentStep) {
		currentStep = step;
		if(item && item.ID) {
			$("#form-1-link").removeClass('disabled');
			$("#form-2-link").removeClass('disabled');
			$("#form-3-link").removeClass('disabled');
			$("#form-4-link").removeClass('disabled');
			$("#form-5-link").removeClass('disabled');
			$("#form-6-link").removeClass('disabled');
		} else {
			$("#form-2-link").addClass('disabled');
			$("#form-3-link").addClass('disabled');
			$("#form-4-link").addClass('disabled');
			$("#form-5-link").addClass('disabled');
			$("#form-6-link").addClass('disabled');
		}
		$("#form-1-link").parent().removeClass('active');
		$("#form-2-link").parent().removeClass('active');
		$("#form-3-link").parent().removeClass('active');
		$("#form-4-link").parent().removeClass('active');
		$("#form-5-link").parent().removeClass('active');
		$("#form-6-link").parent().removeClass('active');
		$("#form-"+step+"-link").parent().addClass('active');
		$("#form-1").removeClass('active');
		$("#form-2").removeClass('active');
		$("#form-3").removeClass('active');
		$("#form-4").removeClass('active');
		$("#form-5").removeClass('active');
		$("#form-6").removeClass('active');
		$("#form-"+step).addClass('active');
		switch(step) {
			case 1:
				if(item) {
					$("#procedure-Name").val(item.Name);
					$("#procedure-Description").val(item.Description);
					$("#procedure-Location").val(item.Location);
					$("#procedure-Legislation").val(item.Legislation);
					$("#procedure-Duration").val(item.Duration);
					$("#procedure-TotalValue").val(item.TotalValue);
					$("#procedure-ID_ContractType").val(item.ID_ContractType).trigger('change');
					$("#procedure-ID_ProcedureType").val(item.ID_ProcedureType).trigger('change');
					$("#procedure-ID_ProcedureCriterion").val(item.ID_ProcedureCriterion).trigger('change');
					var list = JSON.parse(item.ClassificationIDs);
					selectedCpvs = list;
					for(var i=0;i<list.length;i++) {
						$("#procedure-cpvs-list").append('<li>'+cpvs[list[i]].Code+' <a class="delete-cpv" data-id="'+list[i]+'">x</a></li>');
					}
					$("#procedure-Classification").val(list.join(','));
					$("#procedure-Forms").val(item.Forms);
					$("#procedure-EconomicCapacity").val(item.EconomicCapacity);
					$("#procedure-TechnicalCapacity").val(item.TechnicalCapacity);
					$("#procedure-ClarificationRequestsDeadline").val(moment(item.ClarificationRequestsDeadline).format('DD MMM YYYY HH:mm'));
					//$("#procedure-ClarificationRequestsDeadline").datepicker('update');
					$("#procedure-TendersReceiptDeadline").val(moment(item.TendersReceiptDeadline).format('DD MMM YYYY HH:mm'));
					//$("#procedure-TendersReceiptDeadline").datepicker('update');
					$("#procedure-TendersOpeningDate").val(moment(item.TendersOpeningDate).format('DD MMM YYYY HH:mm'));
					//$("#procedure-TendersOpeningDate").datepicker('update');
					$("#procedure-ContestationsSubmission").val(item.ContestationsSubmission);
					$("#procedure-OtherInformation").val(item.OtherInformation);
					$("#procedure-Necessity").val(item.Necessity);
				}
				break;
			case 6:
				// show procedure details
				$container = $("#procedure-form-6");
				$('#form-detail-name').html(item.Name);
				$('#form-detail-description').html(item.Description);
				if(typeof procedureTypes[item.ID_ProcedureType] != 'undefined') {
					var type = getTranslation(procedureTypes[item.ID_ProcedureType].Name)
					$('#form-detail-type').html(type)
            .addClass(type.replace(' ','_').toLowerCase());
				}
				$('#form-detail-status').addClass(item.Status);
				$('#form-detail-location').html(item.Location);
				$("#form-detail-launch").html(moment(item.Date).format('DD.MM.YYYY HH:mm'));
				if(item.ClarificationRequestsDeadline) {
					$("#form-detail-clarifications").html(moment(item.ClarificationRequestsDeadline).format('DD.MM.YYYY HH:mm'));
				}
				if(item.TendersReceiptDeadline) {
					$("#form-detail-deadline").html(moment(item.TendersReceiptDeadline).format('DD.MM.YYYY HH:mm'));
				}
				if(item.TendersOpeningDate) {
					$("#form-detail-open-deadline").html(moment(item.TendersOpeningDate).format('DD.MM.YYYY HH:mm'));
				}
				if(item.Classification!=='[]') $("#form-detail-cpvs").html(item.Classification);

        var uploadFormData = {
          ID_Procedure: item.ID,
          ID_DocumentType: $('#form-detail-upload-type').val(),
          isPublic: 1
        };

        $('#Document').uploadify({
          swf: '/plugins/uploadify/uploadify.swf',
          uploader: '/procedure/upload',
          multi: false,
          buttonClass: 'btn btn-primary btn-cons uploadify-button',
          buttonText: 'Upload',
          fileObjName: 'Document',
          fileSizeLimit: '10MB',
          formData: uploadFormData,
          onQueueComplete: function () {
            getProcedureUploadedDocuments();
          }
        });

        $(document).on('change', '#form-detail-upload-type', function () {
          uploadFormData.ID_DocumentType = $(this).val();

          $('#Document').uploadify('settings', 'formData', uploadFormData);
        });

				getProcedureUploadedDocuments();
				break;
			default:
        var procedureForm = $("#procedure-form-" + step);

				$form_content = procedureForm.find('.form-content');
				$form_content.html('');
        procedureForm.find(".loader").show();
        procedureForm.find(".form-submit").hide();
				$.get( '/getformid',{ Step: step, ID_Procedure: $("#procedure-ID").val()},function(data,textStatus){
					if(!data.Success) {
						$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
					}
					else {
						if(typeof data.Result.ID_Form != 'undefined') {
							$form_content.find('.procedure-form-id').val(data.Result.ID_Form);
						}
						$.get( '/form',{ Step: step, ID_Procedure: $("#procedure-ID").val()},function(data2,textStatus2){
							if(!data2.Success) {
								$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data2.Result+'</p></div>');
							}
							else {
                procedureForm.find(".loader").hide();
                procedureForm.find(".form-submit").show();
								console.log(data2.Result);
								$form_content.html(getFormItemData(data2.Result));
							}
						});
					}
				});
		}
		updateProcedureDocuments();
	}
}

function drawProcedureForm(item) {
	var $container = $("#procedure-form-container");
	$(".data-container").hide();
	$("#procedure-form-1")[0].reset();
	$("#procedure-form-2")[0].reset();
	$("#procedure-form-3")[0].reset();
	$("#procedure-form-4")[0].reset();
	$("#procedure-form-5")[0].reset();
	$("#procedure-ID_ProcedureType option").prop('disabled',false);
	$container.find(".error").remove();
	$("#procedure-cpvs-list").html('');
	if(item) {
		currentStep = 0;
		$("#procedure-ID").val(item.ID);
		changeStep(6,item);
	}
	else {
		currentStep = 0;
		$("#procedure-ID").val('');
		changeStep(1,null);
	}
	$container.show();
}

function drawProcedureDetails(item) {
	var $container = $("#procedure-detail-container");
	$(".data-container").hide();
	$('#detail-name').html(item.Name);
	$('#detail-description').html(item.Description);
	$('#detail-favourite').data('id',item.ID);
  $('#detail-launch').html(moment(item.Date).format('DD.MM.YYYY HH:mm'));
  if(item.ClarificationRequestsDeadline) {
    $('#detail-clarifications').html(moment(item.ClarificationRequestsDeadline).format('DD.MM.YYYY HH:mm'));
  }
  if(item.TendersReceiptDeadline) {
    $('#detail-deadline').html(moment(item.TendersReceiptDeadline).format('DD.MM.YYYY HH:mm'));
  }

  var detailFavorite = $('#detail-favourite');
	if(typeof favouriteProcedures[item.ID] != 'undefined') {
    detailFavorite.addClass('added')
      .attr('title', detailFavorite.data('title-added'));
	} else {
    detailFavorite.attr('title', detailFavorite.data('title'));
  }
	if(typeof procedureTypes[item.ID_ProcedureType] != 'undefined') {
		var type = getTranslation(procedureTypes[item.ID_ProcedureType].Name);
		$('#detail-type').html(type)
      .addClass(type.replace(' ','_').toLowerCase());
	}
	$('#detail-status').addClass(item.Status)
    .attr('title', item.Status);

  if (new Date(item.ClarificationRequestsDeadline) > new Date()) {
    var uploadifyObject = $('#js-clarification-file');

    //uploadifyObject.uploadify('destroy');

    uploadifyObject.uploadify({
      swf: '/plugins/uploadify/uploadify.swf',
      uploader: '/procedure/clarification_request_create',
      auto: false,
      multi: true,
      buttonClass: 'btn btn-primary btn-cons uploadify-button',
      buttonText: 'Upload',
      fileObjName: 'Document',
      fileSizeLimit: '10MB',
      onQueueComplete: function () {
        // insert request complete notification here
      }
    });

    $('.js-clarification-request-container').show();
  } else {
    $('.js-clarification-request-container').hide();
  }

  if (new Date(item.TendersReceiptDeadline) > new Date()) {
    var uploadifyOfferObject = $('#js-offer-file');

    //uploadifyObject.uploadify('destroy');

    var offerFormData = {
      ID_Procedure: item.ID,
      Price: 0,
      Deadline: ''
    };

    uploadifyOfferObject.uploadify({
      swf: '/plugins/uploadify/uploadify.swf',
      uploader: '/procedure/offer_create',
      auto: false,
      multi: false,
      buttonClass: 'btn btn-primary btn-cons uploadify-button',
      buttonText: 'Upload',
      fileObjName: 'Document',
      fileSizeLimit: '10MB',
      formData: offerFormData,
      onQueueComplete: function () {
        // insert request complete notification here
      }
    });
  }

	$container.show();
}

$(document).on('click', '.js-clarification-start-upload', function () {
  $('#js-clarification-file').uploadify('upload', '*');
});

$(document).on('click', '.js-offer-start-upload', function () {
  $('#js-offer-file').uploadify('upload', '*');
});

$(document).on('keyup', '.js-offer-input', function () {
  offerFormData[$(this).data('field')] = $(this).val();

  $('#js-offer-file').uploadify('settings', 'formData', offerFormData);
});

function getFormItemData(item) {
	var html = '';
	console.log('DataType: '+item.DataType);
	console.log('Type: '+item.Type);
	switch(item.DataType) {
		case 'html':
			switch(item.Type) {
				case 'tag':
					if(item.Html) {
						html += item.Html;
					}
					else {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					break;
				case 'paragraph':
					html += '<p style="' + item.Style+ '">';
					if(item.Html) {
						html += item.Html;
					}
					else {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					html += '</p>';
					break;
				case 'strong':
					html += '<strong style="' + item.Style+ '">';
					if(item.Html) {
						html += item.Html;
					}
					else {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					html += '</strong>';
					break;
				case 'center':
					html += '<center style="' + item.Style+ '">';
					if(item.Html) {
						html += item.Html;
					}
					else {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					html += '</center>';
					break;
				case 'numbered_list':
					html += '<ul style="' + item.Style+ '">';
					for(var i=0; i<item.Items.length; i++) {
						html += '<li><span class="list-counter">' + (i+1) + '.</span>' + getFormItemData(item.Items[i]) + '</li>';
					}
					html += '</ul>';
					break;
				case 'unordered_list':
					html += '<ul style="' + item.Style+ '">';
					for(var i=0; i<item.Items.length; i++) {
						html += '<li>' + getFormItemData(item.Items[i]) + '</li>';
					}
					html += '</ul>';
					break;
				case 'table':
					html += '<table>';
					html += '</table>';
					break;
				default:
					html += '<' + item.Type + '>';
					if(item.Html) {
						html += item.Html;
					}
					else {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					html += '</' + item.Type + '>';
			}
			break;
		case 'string':
			html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + (item.Data ? item.Data : '&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>';
			switch(item.Type) {
				case 'textbox':
					html += '<textarea class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">'+item.Data+'</textarea>';
					break;
				case 'textarea':
					html += '<input type="text" id="'+item.Field+' form-field" rel="placeholder-'+item.Field+'" data-self="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '" value="'+item.Data+'" />';
					break;
			}
			break;
		case 'datetime':
			switch(item.Type) {
				case 'textbox':
					html += '<input type="text" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
					break;
				case 'calendar':
					html += '<input type=text" class="datepicker" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="'+item.Data+'" style="' + item.Style+ '" />';
					break;
			}
			break;
		case 'int':
			switch(item.Type) {
				case 'textbox':
					html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
					break;
			}
			break;
		case 'float':
			switch(item.Type) {
				case 'textbox':
					html += '<input type="text" class="numeric" id="'+item.Field+'" name="' + item.Field + '" ' + (item.Mandatory ? 'required=""' : '') + ' value="' + item.Data+'" style="' + item.Style+ '" />';
					break;
			}
			break;
		case 'bool':
			switch(item.Type) {
				case 'checkbox':
					html = '<label for="'+item.Field+'" style="' + item.Style+ '"><input type="checkbox" id="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + (item.Data ? 'checked=""' : '') + ' />'+item.Html+'</label>';
					break;
			}
			break;
		default:
			switch(item.Type) {
				case 'select':
					console.log(item);
					try {
						var values = JSON.parse(item.Values);
					}
					catch(err) {
						var values = [];
					}
					var dataValue = '&nbsp;&nbsp;';
					for(var j=0;j<values.length;j++) {
						if(values[j].Key==item.Data)  {
							dataValue = getTranslation(values[j].Value);
						}
					}
					html += '<span class="form-placeholder placeholder-'+item.Field+'" rel="'+item.Field+'">' + dataValue + '</span>';
					html += '<select class="'+item.Field+' form-field" rel="placeholder-'+item.Field+'"  data-self="'+item.Field+'" name="'+item.Field+'" ' + (item.Mandatory ? 'required=""' : '') + ' style="' + item.Style+ '">';
					for(var j=0;j<values.length;j++) {
						html += '<option value="'+values[j].Key+'" ' + (values[j].Key == item.Data ? 'selected=""' : '') + '>' + getTranslation(values[j].Value) + '</option>';
					}
					html += '</select>';
					break;
				default:
					html = '<div style="' + item.Style+ '">';
					if(item.Items !== null) {
						for(var i=0; i<item.Items.length; i++) {
							html += getFormItemData(item.Items[i]);
						}
					}
					html += '</div>';
			}
	}
	return html;
}

function updateProcedureDocuments() {
	var $container = $("#generated-files-container"),
    procedureId = $("#procedure-ID").val();

	if(procedureId!='') {
		$("#procedure-documents-download").html('');
		$container.find(".loader").show();
		$.get( '/procedure/documents',{ ID_Procedure: procedureId},function(data,textStatus){
			if(!data.Success) {
				$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
			}
			else {
				console.log(data.Result);
				$container.find(".loader").hide();
				for(var i=0;i<data.Result.length;i++) {
					$("#procedure-documents-download").append('<a href="/procedure/exporttemplate/'+data.Result[i].ID_ExportTemplate+'" class="document-download">'+data.Result[i].FormName+'</a>')
				}
				//$form_content.html(getFormItemData(data.Result));
			}
		});
	}
	else {
		$container.find(".loader").hide();
	}
}

function getProcedureUploadedDocuments() {
	var $container = $("#form-detail-documents"),
    procedureId = $("#procedure-ID").val();

	if(procedureId!='') {
		$container.html('');
		$.get( '/procedure/uploaded',{ ID_Procedure: procedureId},function(data,textStatus){
			if(!data.Success) {
				$container.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
			}
			else {
				console.log(data.Result);
				for(var i=0;i<data.Result.length;i++) {
					$container.append('<a href="'+data.Result[i].DocumentURL+'" class="document-download" target="_blank">'+data.Result[i].FileName+'</a>')
				}
				//$form_content.html(getFormItemData(data.Result));
			}
		});
	}
	else {
		$container.find(".loader").hide();
	}
}

/******** logic *************/

$(document).on('myProcedureUpdated',function(e) {
	updateMyProcedure(e.ID);
});

$(document).on('procedureShown',function(e) {
	updateProcedureData(e.ID);
});

$(document).on('myProcedureShown',function(e) {
	updateMyProcedureData(e.ID);
});

$(document).on('proceduresLoaded',function(e,clear) {
	updateProcedures(clear);
	updateMyProcedures(clear);
});

$(document).on('ringsLoaded',function(e,clear) {
	getProcedures(clear);
});

$(document).on('socketConnected',function(e) {
	console.log('socket connected');
	if($("#procedures-container").length>0) {
		var $container = $("#procedure-form-container");
		getProcedures(true);

		$("#generate-procedure").click(function(e) {
			e.preventDefault();
			drawProcedureForm(null);
		});

		$("#show-procedures").click(function(e) {
			e.preventDefault();
			$(".data-container").hide();
			$("#procedures-container").show();
		});

		$(".wizard-form-step").click(function(e) {
			e.preventDefault();
			if($(this).hasClass('disabled')) {
				return false;
			}
			else {
				changeStep($(this).data('step'),myProcedures[$("#procedure-ID").val()]);
			}
		});
		/*
		$("#form-1-link").click(function(e) {
			e.preventDefault();
			if($(this).hasClass('disabled')) {
				return false;
			}
			$("#form-2-link").parent().removeClass('active');
			$("#form-3-link").parent().removeClass('active');
			$("#form-4-link").parent().removeClass('active');
			$("#form-5-link").parent().removeClass('active');
			$("#form-1").removeClass('active');
			$("#form-2").removeClass('active');
			$("#form-3").removeClass('active');
			$("#form-4").removeClass('active');
			$("#form-5").removeClass('active');
			$("#form-1-link").parent().addClass('active');
			$("#form-1").addClass('active');
		});
		$("#form-2-link").click(function(e) {
			e.preventDefault();
			if($(this).hasClass('disabled')) {
				return false;
			}
			else {
				// maybe we should save the first form automatically?
				$.get( '/form',{ Step: 2, ID_Procedure: $("#procedure-ID").val()},function(data,textStatus){
					$form_content = $("#procedure-form-2").find('.form-content');
					if(!data.Success) {
						$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
					}
					else {
						// generate form
						console.log(data.Result);
						$form_content.html(getFormItemData(data.Result));
						$("#form-1-link").parent().removeClass('active');
						$("#form-2-link").removeClass('disabled').parent().addClass('active');
						$container.find(".tab-pane").removeClass('active');
						$("#form-2").addClass('active');
					}
				});
			}
		});
		$("#form-3-link").click(function(e) {
			e.preventDefault();
			if($(this).hasClass('disabled')) {
				return false;
			}
			else {
				// maybe we should save the first form automatically?
				$.get( '/form',{ Step: 3, ID_Procedure: $("#procedure-ID").val()},function(data,textStatus){
					$form_content = $("#procedure-form-3").find('.form-content');
					if(!data.Success) {
						$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
					}
					else {
						// generate form
						console.log(data.Result);
						$form_content.html(getFormItemData(data.Result));
						$("#form-1-link").parent().removeClass('active');
						$("#form-2-link").parent().removeClass('active');
						$("#form-3-link").removeClass('disabled').parent().addClass('active');
						$container.find(".tab-pane").removeClass('active');
						$("#form-3").addClass('active');
					}
				});
			}
		});
		*/
		/*
		$("#procedure-form-1").submit(function(e) {
			e.preventDefault();
			// save form data
			var ok = true;
			var $form = $(this);
			$form.find(".error").remove();
			$form.find(".required").each(function(elm){
				if(!$(this).hasClass('select2-offscreen') && $.trim($(this).val())=='') {
					$('<span class="error">Campul este obligatoriu.</span>').insertAfter($(this).parent());
					ok = false;
				}
			});
			if(ok) {
				$("#procedure-SubmitTime").val(time.format());
				$.post( '/procedure/save', $form.serialize(),function(data,textStatus){
					console.log(data);
					if(!data.Success) {
						log('validation errors');
						console.log(data);
						if(data.ResultType=='JSONKeyValuePairStruct') {
							for(var i in data.Result) {
								if(data.Result[i]!='') {
									$('<span class="error">'+data.Result[i]+'</span>').insertAfter($("input[name='"+i+"']").parent());
									ok = false;
								}
							}
						}
						else {
							$('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>').insertAfter($("#procedure-SubmitTime"));
							ok = false;
						}
					}
					else {
						$("#procedure-ID").val(data.Result.ID_Procedure);
						// if success get first form
						console.log('get next form');
						$.get( '/form',{Step:2, ID_Procedure:$("#procedure-ID").val()},function(data,textStatus){
							$form_content = $("#procedure-form-2").find('.form-content');
							console.log(data);
							if(!data.Success) {
								$form_content.html('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>');
							}
							else {
								// generate form
								console.log(data.Result);
								$form_content.html(getFormItemData(data.Result));
								$("#form-1-link").parent().removeClass('active');
								$("#form-2-link").removeClass('disabled').parent().addClass('active');
								$container.find(".tab-pane").removeClass('active');
								$("#form-2").addClass('active');
							}
						});
					}
				});
			}
		});
		$("#procedure-form-2").submit(function(e) {
			e.preventDefault();
			$("#form-2-link").parent().removeClass('active');
			$("#form-3-link").removeClass('disabled').parent().addClass('active');
			$container.find(".tab-pane").removeClass('active');
			$("#form-3").addClass('active');
		});
		$("#procedure-form-3").submit(function(e) {
			e.preventDefault();
			$("#form-3-link").parent().removeClass('active');
			$("#form-4-link").removeClass('disabled').parent().addClass('active');
			$container.find(".tab-pane").removeClass('active');
			$("#form-4").addClass('active');
		});
		$("#procedure-form-4").submit(function(e) {
			e.preventDefault();
			$("#form-4-link").parent().removeClass('active');
			$("#form-5-link").removeClass('disabled').parent().addClass('active');
			$container.find(".tab-pane").removeClass('active');
			$("#form-5").addClass('active');
		});
		*/

		$(".my-form").submit(function(e) {
			e.preventDefault();
			// save form data
			waitingFor = false;
			var ok = true;
			var $form = $(this);
			$form.find(".error").remove();
			$form.find(".required").each(function(elm){
				if(!$(this).hasClass('select2-container') && $(this).attr('id')!='procedure-cpv' && $.trim($(this).val())=='') {
					$('<span class="error">Campul este obligatoriu.</span>').insertAfter($(this).parent());
					ok = false;
				}
			});
			if(ok) {
				console.log($form.data('step'));
				switch($form.data('step')) {
					case '1':
					case 1:
						$("#procedure-SubmitTime").val(time.format());
						$.post( '/procedure/save', $form.serialize(),function(data,textStatus){
							console.log(data);
							if(!data.Success) {
								log('validation errors');
								console.log(data);
								if(data.ResultType=='JSONKeyValuePairStruct') {
									for(var i in data.Result) {
										if(data.Result[i]!='') {
											$('<span class="error">'+data.Result[i]+'</span>').insertAfter($("input[name='"+i+"']").parent());
											ok = false;
										}
									}
								}
								else {
									$('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>').insertAfter($("#procedure-SubmitTime"));
									ok = false;
								}
							}
							else {
								$("#procedure-ID").val(data.Result.ID_Procedure);
								// if success get first form
								if(typeof procedures[data.Result.ID_Procedure] != 'undefined') {
									console.log('go to step 2');
									changeStep(2,procedures[data.Result.ID_Procedure]);
								}
								else {
									waitingFor = true;
									console.log('waiting for id to go to step 2');
									getProcedures();
									$(document).on('proceduresLoaded',function(e,clear) {
										if(waitingFor) {
											if(typeof procedures[data.Result.ID_Procedure] != 'undefined') {
												changeStep(2,procedures[data.Result.ID_Procedure]);
											}
										}
									});
								}
							}
						});
						break;
					case '6':
					case 6:
						$("#procedure-SubmitTime").val(time.format());
						$.post( '/procedure/launch/'+$("#procedure-ID").val(), {},function(data,textStatus){
							console.log(data);
							if(!data.Success) {
								log('validation errors');
								console.log(data);
								if(data.ResultType=='JSONKeyValuePairStruct') {
									for(var i in data.Result) {
										if(data.Result[i]!='') {
											$('<span class="error">'+data.Result[i]+'</span>').insertAfter($("input[name='"+i+"']").parent());
											ok = false;
										}
									}
								}
								else {
									$('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>').insertAfter($("#procedure-SubmitTime"));
									ok = false;
								}
							}
							else {
								getProcedures(true);
								$(".data-container").hide();
								$("#procedures-container").show();
							}
						});
						break;
					default:
						$.post( '/form/save/'+$("#procedure-ID").val(), $form.serialize(),function(data,textStatus){
							console.log(data);
							if(!data.Success) {
								log('validation errors');
								console.log(data);
								if(data.ResultType=='JSONKeyValuePairStruct') {
									for(var i in data.Result) {
										if(data.Result[i]!='') {
											$('<span class="error">'+data.Result[i]+'</span>').insertAfter($("input[name='"+i+"']").parent());
											ok = false;
										}
									}
								}
								else {
									$('<div class="alert alert-error error"><button class="close" data-dismiss="alert"></button><p>'+data.Result+'</p></div>').insertAfter($("#procedure-SubmitTime"));
									ok = false;
								}
							}
							else {
								var new_step = $form.data('step')*1+1;
								console.log('go to step '+new_step);
								changeStep(new_step,procedures[$("#procedure-ID").val()]);
							}
						});
				}
			}
		});



		$(document).on('click',".view-procedure", function(e) {
			e.preventDefault();
			var item = typeof procedures[$(this).data('id')] != 'undefined' ? procedures[$(this).data('id')] : null;
			if((item.Status=='draft' || item.Status == 'prelaunched') && item.ID_Client==c_id) {
				drawProcedureForm(item);
			}
			else {
				drawProcedureDetails(item);
			}
		});
		$("#procedures-container .input-daterange").datepicker({
			format: "dd M yyyy"
		});
		$("#procedure-filters").submit(function(e) {
			e.preventDefault();
			var filters = {
				ID_Cpv: $("#filter-ID_Cpv").val(),
				ID_ContractType: $("#filter-ID_ContractType").val(),
				ID_ProcedureType: $("#filter-ID_ProcedureType").val(),
				ID_ProcedureCriterion: $("#filter-ID_ProcedureCriterion").val(),
				keyword: $("#filter-keyword").val(),
				Start: $("#filter-start").val(),
				End: $("#filter-end").val(),
				Public: $("#filter-Public").val(),
				Status: $("#filter-Status").val()
			};
			$("#procedures-list").html('');
			$("#procedures-container").find('.loader').show();
			getProcedures(true,filters);
		});

		$(document).on('click',".toggle-procedure", function(e){
			e.preventDefault();
			$this = $(this);
			$procedure = $this.closest('.procedure-item').first();
			if(!$procedure.hasClass('expanded')) {
				$("#procedures-container .procedure-item").removeClass('expanded');
				$procedure.addClass('expanded');
			}
			else {
				$procedure.removeClass('expanded');
			}
		});

		$("#filter-ID_Cpv").select2({
			placeholder: "Cod CPV..",
			ajax: {
				url: window.location.href + "cpv",
				dataType: 'json',
				delay: 250,
				data: function (term, page) {
					return {
						query: term
					};
				},
				cache: true,
				results: function (data) {
					console.log(data);
					var results = [];
					if(data.Success) {
						$.each(data.Result, function(index, item){
							results.push({
								id: item.ID,
								text: item.Code + ' (' + item['Name_' + currentLang] + ')'
							});
						});
						return {
							results: results
						};
					}
				}
			},
			minimumInputLength: 1
		});
		$("#procedure-cpv").select2({
			placeholder: "Adauga cod CPV..",
			ajax: {
				url: window.location.href + "cpv",
				dataType: 'json',
				delay: 250,
				data: function (term, page) {
					return {
						query: term
					};
				},
				cache: true,
				results: function (data) {
					console.log(data);
					var results = [];
					if(data.Success) {
						$.each(data.Result, function(index, item){
							results.push({
								id: item.ID,
								text: item.Code + ' (' + item['Name_' + currentLang] + ')'
							});
						});
						return {
							results: results
						};
					}
				}
			},
			minimumInputLength: 1
		});
		$("#procedure-cpv").on("change", function (e) {
			if(selectedCpvs.indexOf($(this).val())==-1) {
				selectedCpvs.push($(this).val());
				$("#procedure-cpvs-list").append('<li>'+$("#procedure-cpv").select2('data').text+' <a class="delete-cpv" data-id="'+$("#procedure-cpv").select2('data').id+'">x</a></li>');
			}
			$("#procedure-cpv").select2('destroy');
			$("#procedure-cpv").val(null);
			$("#procedure-cpv").select2({
				placeholder: "Adauga cod CPV..",
				ajax: {
					url: window.location.href + "cpv",
					dataType: 'json',
					delay: 250,
					data: function (term, page) {
						return {
							query: term
						};
					},
					cache: true,
					results: function (data) {
						console.log(data);
						var results = [];
						if(data.Success) {
							$.each(data.Result, function(index, item){
								results.push({
									id: item.ID,
									text: item.Code + ' (' + item['Name_' + currentLang] + ')'
								});
							});
							return {
								results: results
							};
						}
					}
				},
				minimumInputLength: 1
			});

			$("#procedure-Classification").val(selectedCpvs.join(','));
		});

		$(document).on('click',".delete-cpv", function(e){
			selectedCpvs.splice(selectedCpvs.indexOf($(this).data('id')),1);
			$("#procedure-Classification").val(selectedCpvs.join(','));
			$(this).parent().remove();
		});

		$(document).on('click','.delete-procedure',function (e) {
			e.preventDefault();
			var ok = true;
			var $procedureId = $(this).attr('data-id');
			var $url = $(this).attr('href');
			fancyConfirm(getTranslation('Procedure_delete_confirm'),function(r){
				if(r) {
					$.post($url,{},function(data,textStatus){
						if(!data.Success) {
							if(data.ResultType=='JSONKeyValuePairStruct') {
								fancyAlert(data.Result);
								ok = false;
							}
							else if(data.ResultType=='GeneralError' || data.ResultType=='String') {
								fancyAlert(data.Result);
							}
						}
						else if(data.Success) {
							//deleteOrder($orderId);
						}
					});
				}
			});
			e.preventDefault();
		});

		$("#toggle-optional-fields").click(function(e) {
			e.preventDefault();
			if($("#optional-fields-holder").is(":visible")) {
				$("#optional-fields-holder").hide();
				$(this).html('Afiseaza campuri optionale');
			}
			else {
				$("#optional-fields-holder").show();
				$(this).html('Ascunde campuri optionale');
			}
		});

		$(document).on('click','.form-placeholder',function (e) {
			e.preventDefault();
			$(this).hide();
			$(this).parent().find("."+jq($(this).attr('rel'))).show().focus();
			e.preventDefault();
		});
		$(document).on('blur','.form-field',function (e) {
			e.preventDefault();
			$(this).hide();
			var val = $(this).is('select') ? $(this).find("option:selected").text() : $(this).val();
			$('.'+jq($(this).data('self'))).html(val);
			$('.'+jq($(this).attr('rel'))).html(val).show();
			//$(this).parent().find('.'+jq($(this).attr('rel'))).show();
			e.preventDefault();
		});

		$(document).on('change','#procedure-TotalValue',function (e) {
			var val = $(this).val().replace(/\./g,'').replace(',','.')*1;
			var thr = procedureTypes[Object.keys(procedureTypes)[0]];
			console.log(val);
			for(var i in procedureTypes) {
				console.log(procedureTypes[i].ValueThreshold);
				if(procedureTypes[i].ValueThreshold>thr.ValueThreshold && procedureTypes[i].ValueThreshold <= val) {
					thr = procedureTypes[i];
				}
			}
			console.log(thr);
			for(var i in procedureTypes) {
				if(procedureTypes[i].ValueThreshold<thr.ValueThreshold) {
					$("#procedure-type-option-"+procedureTypes[i].ID).prop('disabled',true);
				}
				else if(procedureTypes[i].ValueThreshold>=thr.ValueThreshold) {
					$("#procedure-type-option-"+procedureTypes[i].ID).prop('disabled',false);
				}
			}
			$("#procedure-ID_ProcedureType").val(thr.ID);
			var clarificationsDeadline = moment().add(thr.ClarificationRequestsOffset,'days');
			$("#procedure-ClarificationRequestsDeadline").val(clarificationsDeadline.format('DD MMM YYYY HH:mm'));
			var receiptDeadline = moment().add(thr.TendersReceiptOffset,'days');
			$("#procedure-TendersReceiptDeadline").val(receiptDeadline.format('DD MMM YYYY HH:mm'));
			var openingDate = moment().add(thr.TendersReceiptOffset,'days').add(1,'hours');
			$("#procedure-TendersOpeningDate").val(openingDate.format('DD MMM YYYY HH:mm'));
		});

		$('#procedure-ClarificationRequestsDeadline').dateRangePicker({
			autoClose: true,
			singleDate : true,
			showShortcuts: false,
			startOfWeek: 'monday',
			format: 'DD MMM YYYY HH:mm',
			time: {
				enabled: true
			}
		});

		$('#procedure-TendersReceiptDeadline').dateRangePicker({
			autoClose: true,
			singleDate : true,
			showShortcuts: false,
			startOfWeek: 'monday',
			format: 'DD MMM YYYY HH:mm',
			time: {
				enabled: true
			}
		});

		$('#procedure-TendersOpeningDate').dateRangePicker({
			autoClose: true,
			singleDate : true,
			showShortcuts: false,
			startOfWeek: 'monday',
			format: 'DD MMM YYYY HH:mm',
			time: {
				enabled: true
			}
		});

		$('#filter-range').dateRangePicker(
		{
			separator : ' to ',
			getValue: function()
			{
				if ($('#filter-start').val() && $('#filter-end').val() )
					return $('#filter-start').val() + ' to ' + $('#filter-end').val();
				else
					return '';
			},
			setValue: function(s,s1,s2)
			{
				$('#filter-start').val(s1);
				$('#filter-end').val(s2);
			},
			autoClose: true,
			showShortcuts: false
		});

		io.socket.on('procedure', function(message) {
			console.log(message);
			if(message.verb == 'destroyed') {
				delete procedures[message.id];
				delete myProcedures[message.id];
				updateMyProcedures(true);
			}
			else {
				getProcedures(true);
				updateMyProcedures(true);
			}
		});
	}
});
