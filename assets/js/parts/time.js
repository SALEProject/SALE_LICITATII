/****** data functions ***************/

var time = null;
var initial_time = null;
var time_diff = null;
var time_interval = null;

function getServerTime() {
	io.socket.get('/home/time', {}, function(response) {
		if(response.Success) {
			time = new moment(response.Result);
			initial_time = time.clone();
			time_diff = Date.now();
			if(time_interval) clearInterval(time_interval);
			time_interval = setInterval(function(){
				var diff = Math.round(( Date.now()-time_diff)/1000);
				var new_time = initial_time.clone();
				time = new_time.add('seconds',diff);
				updateServerTime();
			},1000);
			$.event.trigger('serverTimeUpdated');
		}
		else {
			log('error loading server time ('+response.Result+')');
		}
	});
}


/****** view functions ***************/

function updateServerTime() {
	$(".server-time").html(time.format('HH:mm:ss'));
	if(typeof updateAssetSessionTime == 'function') {
		updateAssetSessionTime();
	}
}


/******* events **********/

$(document).on('wakeUp',function(e,clear) {
	getServerTime();
});

$(document).on('socketConnected',function(e) {
	var $container = $("#time-container");
	if($container.length>0) {
		getServerTime();
	}
});


