/****** data functions ***************/

var journal = [];

function getJournal(clear) {
	$("#example-table_wrapper").append('<div class="loader-overlayer"></div>');
	io.socket.get('/home/journal', {}, function(response) {
		if(response.Success) {
			if(response.Result && response.Result.length>0) {
				for (var i=0;i<response.Result.length;i++) {
					appendJournal(response.Result[i]);
				}
				if(table_api.length>0) {
					table_api.fnDraw();
					$("#example-table_wrapper .loader-overlayer").remove();
				}
			}
		}
		else {
			log('error loading journal ('+response.Result+')');
		}
	});
}


/****** view functions ***************/

function appendJournal(item) {
	if(searchIdInArray(item.ID,journal)==-1) {
		journal.push(item);
		var date = new moment(item.Date);
		if(table_api.length>0) table_api.fnAddData([date.format('DD MMM YYYY HH:mm'), item.Operation, item.LoginName, item.AgencyName, (item.ID_Order?'#'+item.ID_Order:''), (item.Quantity?$.number(item.Quantity,3,',','.'):''), (item.Price?$.number(item.Price,2,',','.'):''), (item.GNTypeName?item.GNTypeName:'')],false);
	}
}

/******* events **********/

$(document).on('transactionsLoaded',function(e,clear) {
	updateTransactions(clear);
});

$(document).on('socketConnected',function(e) {
	var $container = $("#journal-container");
	if($container.length>0) {
		io.socket.on('journal', function(message) {
			appendJournal(message.data.item);
			if(table_api.length>0) table_api.fnDraw();
		});
	}
});


