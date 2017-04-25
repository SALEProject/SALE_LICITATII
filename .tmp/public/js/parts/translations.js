function getTranslations() {
	io.socket.get('/translation/all', {}, function(response) {
		if(response.Success) {
			if(response.Result && Object.keys(response.Result).length>0) {
				translations = response.Result;
			}
		}
		else {
			log('error loading translations ('+response.Result+')');
		}
	});
}

$(document).on('socketConnected',function(e) {
	io.socket.on('translation', function(message) {
		getTranslations();
	});
});


