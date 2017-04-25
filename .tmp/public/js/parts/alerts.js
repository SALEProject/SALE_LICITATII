/****** data functions ***************/

var alerts = [];
var $scroller = null;

function getAlerts(clear) {
	io.socket.get('/notification/alerts', {}, function(response) {
		if(response.Success) {
			if(clear) {
				alerts = [];
			}
			if(response.Result && Object.keys(response.Result).length>0) {
				var $alerts = $("#alerts-container");
				var items = [];
				//log(Object.keys(response.data));
				for(var i in (Object.keys(response.Result))) {
				//log(i);
					items.push(response.Result[Object.keys(response.Result)[i]]);
				}
				//var item = items[items.length-1];
				//log(item);
				//$("#main-alert").html('<p class="alert first-alert"><span class="muted time-label">' + moment(item.Date).format("DD MMM HH:mm") + '</span> <span class="alert-label">' + item.Message + '</span></p>');
				if(items.length>0) {
					$("#alerts-list .empty-message").remove();
				}
					for (var i=0;i<items.length;i++) {
						appendAlert(items[i]);
					}
				//}
				//if($("#alert-"+item.ID).length==0) {
					//if(clear) $alerts.html('');
					//$alerts.append('<p class="alert" id="alert-' + item.ID + '"><span class="muted">' + moment(item.Date).format("DD MMM HH:mm") + '</span> ' + item.Message + '</p>');
					//$alerts.effect('pulsate','slow');
				//}
			}
			$.event.trigger('alertsLoaded',clear);
		}
		else {
			log('error loading alerts ('+response.Result+')');
		}
	});
}

/****** view functions ***************/

function appendAlert(item) {
	if(searchIdInArray(item.ID,alerts)==-1) {
		alerts.push(item);
		$("#alerts-list").append('<li id="alert-' + item.ID + '"><span class="muted time-label">' + moment(item.Date).format("DD MMM HH:mm") + '</span> <span class="alert-label">' + item.Message + '<span></li>');
	}
}

/******* events **********/

$(document).on('alertsLoaded',function(e) {
	console.log('alertsLoaded');
	console.log($("#alerts-list").css('height') );
	$scroller.slimScroll({ scrollTo: $("#alerts-list").css('height') });
});
$(document).on('socketConnected',function(e) {
	if($("#alerts-container").length>0) {
			$scroller = $("#alerts-scroller");
			$scroller.slimScroll({
				size: '5px',
				color: '#ddd',
				height: $scroller.attr("data-height"),
				railVisible: true,
				railColor: '#fff',
				opacity: 1,
				railOpacity: 0,
				alwaysVisible: true,
				disableFadeOut: true
			});

		getAlerts(true);

		io.socket.on('alert', function(message) {
			//$("#alerts-list").prepend('<li>'+$("#alerts-container .first-alert").html()+'</li>');
			$("#alerts-list").append('<li id="alert-' + message.data.item.ID + '"><span class="muted time-label">' + moment(message.data.item.Date).format("DD MMM HH:mm") + '</span> <span class="alert-label">' + message.data.item.Message + '<span></li>');
			//$("#main-alert").html('<p class="alert first-alert"><span class="muted">' + moment(message.data.item.Date).format("DD MMM HH:mm") + '</span> ' + message.data.item.Message + '</p>');
			$("#alerts-container").effect('pulsate','slow');
		});
	}
});


