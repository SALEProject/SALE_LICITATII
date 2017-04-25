/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
/*
	var sess = sessionService.getSession(req);
	var sid = sessionService.getSessionID(req);
	if(sess.authenticated && typeof sails.storage.userSessions[sid] != 'undefined') {
		return next();
	}
	req.sessionStore.get(sid, function (error, val) {
		if (error !== null) console.log("error: " + error);
		else {
			console.log('distroying session..');
			//val.destroy();
		}
	});
*/
var start_time = Date.now();
	
	if (req.isSocket) {
		//if(req.socket.handshake.session.authenticated) {
		if(typeof req.socket.handshake != 'undefined' && typeof req.socket.handshake.session != 'undefined' && req.socket.handshake.session.authenticated) {
			if(req.socket.handshake.session.currentUser.isAdministrator) {
				console.log('is authenticated: '+(Date.now()-start_time));
				return next();
			}
			else if(typeof sails.storage.userSessions[req.socket.handshake.session.currentUser.ID] != 'undefined' && typeof sails.storage.userSessions[req.socket.handshake.session.currentUser.ID].sid != 'undefined' && sails.storage.userSessions[req.socket.handshake.session.currentUser.ID].sid == req.socket.handshake.sessionID) {
				sails.storage.userSessions[req.socket.handshake.session.currentUser.ID].lastUpdate = Date.now();
				sails.storage.userSessions[req.socket.handshake.session.currentUser.ID].socket = req.socket.id;
				return next();
			}
			else {
				if(typeof req.sessionStore != 'undefined') {
					req.sessionStore.get(req.socket.sid, function (error, val) {
						if (error !== null) console.log("error: " + error);
						else {
							val.destroy();
						}
					});
				}
				req.socket.disconnect();
				//req.session.destroy();
				return res.json({Success:false, ResultType:'GeneralError', Result: 'S-a pierdut conexiunea cu serverul. Este necesara relogarea.'});
			}
		}
		else {
			console.log('handshake NOT ok');
			if(typeof req.sessionStore != 'undefined') {
				req.sessionStore.get(req.socket.sid, function (error, val) {
					if (error !== null) console.log("error: " + error);
					else {
						val.destroy();
					}
				});
			}
			req.socket.disconnect();
			//req.session.destroy();
			return res.json({Success:false, ResultType:'GeneralError', Result: 'S-a pierdut conexiunea cu serverul. Este necesara relogarea.'});
		}
	}
	else if(req.session.authenticated) {
		/*
		if(req.session.currentUser.isAdministrator) {
			return next();
		}
		*/
		if(typeof sails.storage.userSessions[req.session.currentUser.ID] != 'undefined' && typeof sails.storage.userSessions[req.session.currentUser.ID].sid != 'undefined' && sails.storage.userSessions[req.session.currentUser.ID].sid == req.sessionID) {
			return next();
		}
		else if(typeof sails.storage.userSessions[req.session.currentUser.ID] == 'undefined') {
			req.flash('error',req.session.getTranslation('User_session_expired'));
		}
		else if(typeof sails.storage.userSessions[req.session.currentUser.ID].sid == 'undefined') {
			req.flash('error',req.session.getTranslation('User_session_not_found'));
		}
		else if(typeof sails.storage.userSessions[req.session.currentUser.ID].sid != req.sessionID) {
			req.flash('error',req.session.getTranslation('User_logged_in_with_different_session'));
		}
		console.log('problem!!!');
	}
	else {
		//console.log(req.session);
	}
	if(!req.isSocket) {
		return res.redirect('/logout');
	}
	else {
		//console.log(req.options.detectedVerb.path);
		return res.json({Success:false, ResultType:'GeneralError', Result: 'S-a pierdut conexiunea cu serverul. Este necesara relogarea.'});
	}
};
