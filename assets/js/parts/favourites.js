/****** data functions ***************/

var favouriteProcedures = {};

function getFavourites(clear) {
	io.socket.get('/procedure/favourites', {}, function(response) {
		if(response.Success) {
			if(clear) {
				favouriteProcedures = {};
			}
			if(response.Result && response.Result.length>0) {
				for (var i=0;i<response.Result.length;i++) {
					processFavourite(response.Result[i]);
				}
			}
			$.event.trigger('favouritesLoaded',clear);
		}
		else {
			log('error loading favourites ('+response.Result+')');
		}
	});
}

function processFavourite(item) {
	favouriteProcedures[item.ID] = item;
	$.event.trigger({type:'favouriteProcessed',ID:item.ID});
}


/****** view functions ***************/

function updateFavourites(clear) {
	var $container = $("#favourite-procedures-container");
	var $list = $("#favourite-procedures-list");
	var $scroller = $("#favourite-procedures-scroller");
	if($container.length>0) {
		if(clear) {
			$list.html('');
		}
		$container.find(".loader").show();
		for (var i in favouriteProcedures) {
			updateFavourite(favouriteProcedures[i].ID);
		}
		if(Object.keys(favouriteProcedures)==0) {
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
		$.event.trigger('favouritesShown',clear);
	}
}

function updateFavourite(id) {
	var $item = $("#favourite-procedure-"+id);
	var item = favouriteProcedures[id];
	if(item) {
		var $list = $("#favourite-procedures-list");
		if(item.isDeleted) {
			$item.remove();
			$.event.trigger({type:'favouriteDeleted',ID:item.ID});
		}
		else {
			var html = $list.data('prototype');
			if(typeof html == 'undefined') {
				log('favourites list has no prototype');
			}
			else {
				html = getPrototypeData(item,html);
				if($item.length>0) {
					$item.replaceWith(html);
				}
				else {
					$list.append(html);
				}
				$.event.trigger({type:'favouriteShown',ID:item.ID});
			}
			$("#procedure-"+item.ID+" .procedure-favourite").addClass('added');
		}
	}
	else {
		log('favourite #'+id+' not found');
	}
}

/******* events **********/

$(document).on('favouritesLoaded',function(e,clear) {
	updateFavourites(clear);
});

$(document).on('socketConnected',function(e) {
	var $container = $("#favourite-procedures-container");
	if($container.length>0) {
		$container.find(".loader").show();
		getFavourites(true);
		
		$(document).on('click','.set-procedure',function (e) { 
			e.preventDefault();
			var ok = true;
			var $procedureId = $(this).attr('data-id');
			var $url = $(this).attr('href');
			fancyConfirm(getTranslation('Procedure_set_confirm'),function(r){ 
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
		});

		$(document).on('click','.reset-procedure',function (e) { 
			e.preventDefault();
			var ok = true;
			var $procedureId = $(this).attr('data-id');
			var $url = $(this).attr('href');
			fancyConfirm(getTranslation('Procedure_reset_confirm'),function(r){ 
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

		$(document).on('click','.procedure-favourite',function (e) { 
			e.preventDefault();
			var ok = true;
			var $procedureId = $(this).attr('data-id');
			var isFav = $(this).hasClass('added');
			var $url = (isFav ? '/procedure/favouritereset/' : '/procedure/favouriteset/') + $procedureId;
			fancyConfirm((isFav ? getTranslation('Procedure_reset_confirm') : getTranslation('Procedure_set_confirm')), function(r){ 
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
							if(isFav) {
								$("#procedure-"+$procedureId+" .procedure-favourite").removeClass('added');
							}
							else {
								$("#procedure-"+$procedureId+" .procedure-favourite").addClass('added');
							}
						}
					});
				}
			});
			e.preventDefault();
		});

		io.socket.on('favourite', function(message) {
			console.log(message);
			getFavourites(true);
		});
	}
});


