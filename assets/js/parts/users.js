/****** data functions ***************/

var users = [];

function getUsers(clear) {
	io.socket.get('/user', {}, function(response) {
		if(response.Success) {
			log('receiving '+response.Result.length+' users')
			if(response.Result.length>0) {
				if(clear) {
					$("#user-list").html('');
					users = [];
				}
				for (var i=0;i<response.Result.length;i++) {
					appendUser(response.Result[i]);
				}
			}
			else {
				if(clear) {
					log('clean up users..');
					$("#user-list").html('<li class="empty-message"><div class="text-center">'+getTranslation('No_user_active')+'</div></li>');
				}
			}
		}
		else {
			log('error loading users ('+response.Result+')');
		}
	});
}


/****** view functions ***************/

function appendUser(item) {
	if(searchIdInArray(item.ID,users)==-1) {
		users.push(item);
		$("#user-list").append('<li>'+
			'<p><strong>' + item.LoginName + '</strong> (' + item.FirstName + ' ' + item.LastName + ')' + (item.CompanyName ? ' - <em>' + item.CompanyName + '</em>' : '') + '</p>'+
		'</li>');
	}
}

/******* events **********/

$(document).on('socketConnected',function(e) {
	if($("#users-container").length>0) {
		getUsers(true);

		io.socket.on('user', function(message) {
			getUsers(true);
		});
		io.socket.on('journal', function(message) {
			getUsers(true);
		});
	}
});


