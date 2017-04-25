/**
 * Policy mappings (ACL)
 *
 * Policies are simply Express middleware functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect just one of its actions.
 *
 * Any policy file (e.g. `authenticated.js`) can be dropped into the `/policies` folder,
 * at which point it can be accessed below by its filename, minus the extension, (e.g. `authenticated`)
 *
 * For more information on policies, check out:
 * http://sailsjs.org/#documentation
 */


var userPolicies = ['logger','locale','isAuthenticated', 'documentTypes'];
var adminPolicies = ['logger','locale','isAuthenticated','isAdministrator'];

module.exports.policies = {
	'*': userPolicies,

	FileController: {
		'*': true
	},
	AccountController: {
		'*': userPolicies,
		login: ['logger','locale','transactions','userRoles'],
		logout: true,
		recover: ['logger','locale'],
		register: ['logger','locale'],
		agency_view: userPolicies.concat(['agencies', 'counties']),
		agency_edit: userPolicies.concat(['agencies', 'counties']),
		profile: userPolicies.concat(['agencies', 'counties']),
		edit_profile: userPolicies.concat(['agencies', 'counties'])
	},

	AdminController: {
		'*': adminPolicies,
		index: adminPolicies.concat(['userStates','userOperations'])
		//agency_edit: userPolicies.concat(['isAdministrator','agencies','userRoles','counties','rings','assetTypes','assets','users','measuringUnits','currencies','params','clients','agencyRings','agencyClients']),
		//client_edit: userPolicies.concat(['isAdministrator','agencies','userRoles','counties','rings','assetTypes','assets','users','measuringUnits','currencies','params','clients','clientWarranties']),
		//ring_edit: userPolicies.concat(['isAdministrator','agencies','userRoles','counties','rings','assetTypes','assets','users','measuringUnits','currencies','params','clients','ringAgencies','ringClients']),
		//wizard_4: userPolicies.concat(['isAdministrator','agencies','userRoles','counties','rings','assetTypes','assets','users','measuringUnits','currencies','params','clients','ringAgencies','ringClients','assetClients']),
		//wizard_5: userPolicies.concat(['isAdministrator','agencies','userRoles','counties','rings','assetTypes','assets','users','measuringUnits','currencies','params','clients','ringAgencies','ringClients','assetClients', 'assetDocuments'])
	},

	AgencyController: {
		'*': userPolicies,
		agencies: adminPolicies.concat(['agencies','counties']),
		agency_add: adminPolicies.concat(['agencies','counties','agencyClients']),
		agency_edit: adminPolicies.concat(['agencies','counties','agencyClients','agencyContacts','agencyBrokers']),
		agency_delete: adminPolicies
	},

	CAENController: {
		caens: adminPolicies,
		caen_add: adminPolicies,
		caen_edit: adminPolicies,
		caen_delete: adminPolicies
	},

	ChatController: {
		'*': userPolicies
	},

	ClientController: {
		clients: adminPolicies.concat(['counties','agencies']),
		client_add: adminPolicies.concat(['counties','agencies']),
		client_edit: adminPolicies.concat(['counties','agencies']),
		client_delete: adminPolicies
	},

	CountyController: {
		counties: adminPolicies,
		county_add: adminPolicies,
		county_edit: adminPolicies,
		county_delete: adminPolicies
	},

	ContactController: {
		contacts: adminPolicies,
		contact_add: adminPolicies.concat(['counties','agencies']),
		contact_edit: adminPolicies.concat(['counties','agencies']),
		contact_delete: adminPolicies.concat(['counties','agencies'])
	},

	CPVController: {
		cpvs: adminPolicies,
		cpv_add: adminPolicies,
		cpv_edit: adminPolicies,
		cpv_delete: adminPolicies
	},

	CurrencyController: {
		currencies: adminPolicies,
		currency_add: adminPolicies,
		currency_edit: adminPolicies,
		currency_delete: adminPolicies
	},

	HomeController: {
		'*': userPolicies,
		index: userPolicies.concat(['userStates','userOperations','contractTypes','procedureCriteria','procedureTypes','procedureLegislations','cpvs','userClient'])
	},

	MarketController: {
		'*': userPolicies
	},

	MeasuringUnitController: {
		measuring_units: adminPolicies,
		measuring_unit_add: adminPolicies,
		measuring_unit_edit: adminPolicies,
		measuring_unit_delete: adminPolicies
	},

	NotificationController: {
		'*': userPolicies
	},

	ProcedureController: {
		'*': userPolicies
	},

	ReportController: {
		'*': userPolicies
	},

	TerminalController: {
		'*': userPolicies,
		terminals: adminPolicies,
		terminal_add: adminPolicies,
		terminal_edit: adminPolicies,
		terminal_delete: adminPolicies
	},

	TransactionController: {
		'*': userPolicies,
		transactions: adminPolicies,
		ttransaction_add: adminPolicies,
		terminal_edit: adminPolicies
	},

	UserController: {
		'*': userPolicies,
		'index': true,
		users: adminPolicies.concat(['agencies','userRoles']),
		user_add: adminPolicies.concat(['agencies','userRoles','counties']),
		user_edit: adminPolicies.concat(['agencies','userRoles','counties']),
		user_delete: adminPolicies
	},

	WarrantyController: {
		'*': userPolicies,
		warranties: adminPolicies.concat(['clients','agencies','warrantyTypes','currencies']),
		warranty_add: adminPolicies.concat(['clients','agencies','warrantyTypes','currencies']),
		warranty_edit: adminPolicies.concat(['clients','agencies','warrantyTypes','currencies']),
		warranty_delete: adminPolicies
	},

	WarrantyTypeController: {
		'*': userPolicies,
		warranty_types: adminPolicies,
		warranty_type_add: adminPolicies,
		warranty_type_edit: adminPolicies,
		warranty_type_delete: adminPolicies
	}
};


/**
 * Here's what the `isNiceToAnimals` policy from above might look like:
 * (this file would be located at `policies/isNiceToAnimals.js`)
 *
 * We'll make some educated guesses about whether our system will
 * consider this user someone who is nice to animals.
 *
 * Besides protecting rabbits (while a noble cause, no doubt),
 * here are a few other example use cases for policies:
 *
 *	+ cookie-based authentication
 *	+ role-based access control
 *	+ limiting file uploads based on MB quotas
 *	+ OAuth
 *	+ BasicAuth
 *	+ or any other kind of authentication scheme you can imagine
 *
 */

/*
module.exports = function isNiceToAnimals (req, res, next) {

	// `req.session` contains a set of data specific to the user making this request.
	// It's kind of like our app's "memory" of the current user.

	// If our user has a history of animal cruelty, not only will we
	// prevent her from going even one step further (`return`),
	// we'll go ahead and redirect her to PETA (`res.redirect`).
	if ( req.session.user.hasHistoryOfAnimalCruelty ) {
		return res.redirect('http://PETA.org');
	}

	// If the user has been seen frowning at puppies, we have to assume that
	// they might end up being mean to them, so we'll
	if ( req.session.user.frownsAtPuppies ) {
		return res.redirect('http://www.dailypuppy.com/');
	}

	// Finally, if the user has a clean record, we'll call the `next()` function
	// to let them through to the next policy or our controller
	next();
};
*/
