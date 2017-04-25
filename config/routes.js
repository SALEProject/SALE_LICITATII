/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {

	// Home
	'/': {
		controller: 'HomeController',
		action: 'index'
	},
	
	'/reports': {
		controller: 'ReportController',
		action: 'index'
	},
  
	'/reports/orders': {
		controller: 'ReportController',
		action: 'orders'
	},
  
	'/reports/transactions': {
		controller: 'ReportController',
		action: 'transactions'
	},
  
	'/reports/events': {
		controller: 'ReportController',
		action: 'events'
	},
  
	'/transactions': {
		controller: 'TransactionController',
		action: 'index'
	},
	
	'/dictionary.js': {
		controller: 'TranslationController',
		action: 'js'
	},
	
	'/form/:id': {
		controller: 'FormController',
		action: 'index'
	},
	
	'/getformid': {
		controller: 'FormController',
		action: 'getid'
	},
	
	'/form/save/:id': {
		controller: 'FormController',
		action: 'save'
	},
	
	'/procedure/favouriteset/:id': {
		controller: 'ProcedureController',
		action: 'favouriteset'
	},
	
	'/procedure/favouritereset/:id': {
		controller: 'ProcedureController',
		action: 'favouritereset'
	},
	
	'/procedure/delete/:id': {
		controller: 'ProcedureController',
		action: 'delete'
	},
	
	'/procedure/launch/:id': {
		controller: 'ProcedureController',
		action: 'launch'
	},
	
	'/procedure/exporttemplate/:id': {
		controller: 'ProcedureController',
		action: 'exporttemplate'
	},
	
  
	// Account 
	'/login': {
		controller: "AccountController",
		action: 'login'
	},
	'/logout': {
		controller: "AccountController",
		action: 'logout'
	},
	'/recover': {
		controller: "AccountController",
		action: 'recover'
	},
	'/register': {
		controller: "AccountController",
		action: 'register'
	},
	'/account/profile': {
		controller: "AccountController",
		action: 'profile'
	},
	'/account/edit_profile': {
		controller: "AccountController",
		action: 'edit_profile'
	},
	'/account/change_password': {
		controller: "AccountController",
		action: 'change_password'
	},
	'/account/agency_view': {
		controller: "AccountController",
		action: 'agency_view'
	},
	'/account/agency_edit': {
		controller: "AccountController",
		action: 'agency_edit'
	},
	'/account/agency_users': {
		controller: "AccountController",
		action: 'agency_users'
	},
	'/account/agency_clients': {
		controller: "AccountController",
		action: 'agency_clients'
	},
	'/account/agency_assets': {
		controller: "AccountController",
		action: 'agency_assets'
	},
	'/account/agency_assets/:id': {
		controller: "AccountController",
		action: 'agency_asset_view'
	},	
	'/account/market_assets': {
		controller: "AccountController",
		action: 'market_assets'
	},
	/*
	'/account/market_assets/:id': {
		controller: "AccountController",
		action: 'market_asset_view'
	},
	*/
	'/account/today_assets': {
		controller: "AccountController",
		action: 'today_assets'
	},
	'/account/current_assets': {
		controller: "AccountController",
		action: 'current_assets'
	},
	'/account/agency_warranties': {
		controller: "AccountController",
		action: 'agency_warranties'
	},
  
	// Admin
	'/admin': {
		controller: "AdminController",
		action: 'index'
	},

	'/admin/users': {
		controller: "UserController",
		action: 'users'
	},
	'/admin/users/add': {
		controller: "UserController",
		action: 'user_add'
	},
	'/admin/users/edit/:id': {
		controller: "UserController",
		action: 'user_edit'
	},
	'/admin/users/delete/:id': {
		controller: "UserController",
		action: 'user_delete'
	},
	
	'/admin/agencies': {
		controller: "AgencyController",
		action: 'agencies'
	},
	'/admin/agencies/add': {
		controller: "AgencyController",
		action: 'agency_add'
	},
	'/admin/agencies/edit/:id': {
		controller: "AgencyController",
		action: 'agency_edit'
	},
	'/admin/agencies/delete/:id': {
		controller: "AgencyController",
		action: 'agency_delete'
	},
	'/admin/agencies/setAgency2Ring': {
		controller: "AgencyController",
		action: 'setAgency2Ring'
	},
	'/admin/agencies/setClient2Agency': {
		controller: "AgencyController",
		action: 'setClient2Agency'
	},
	
	'/admin/clients': {
		controller: "ClientController",
		action: 'clients'
	},
	'/admin/clients/add': {
		controller: "ClientController",
		action: 'client_add'
	},
	'/admin/clients/edit/:id': {
		controller: "ClientController",
		action: 'client_edit'
	},
	'/admin/clients/asset_clients': {
		controller: "ClientController",
		action: 'asset_clients'
	},
	'/admin/clients/delete/:id': {
		controller: "ClientController",
		action: 'client_delete'
	},
	
	
	'/admin/currencies': {
		controller: "CurrencyController",
		action: 'currencies'
	},
	'/admin/currencies/add': {
		controller: "CurrencyController",
		action: 'currency_add'
	},
	'/admin/currencies/edit/:id': {
		controller: "CurrencyController",
		action: 'currency_edit'
	},
	'/admin/currencies/delete/:id': {
		controller: "CurrencyController",
		action: 'currency_delete'
	},
	
	'/admin/measuring_units': {
		controller: "MeasuringUnitController",
		action: 'measuring_units'
	},
	'/admin/measuring_units/add': {
		controller: "MeasuringUnitController",
		action: 'measuring_unit_add'
	},
	'/admin/measuring_units/edit/:id': {
		controller: "MeasuringUnitController",
		action: 'measuring_unit_edit'
	},
	'/admin/measuring_units/delete/:id': {
		controller: "MeasuringUnitController",
		action: 'measuring_unit_delete'
	},
	
 
	'/admin/warranty_types': {
		controller: "WarrantyTypeController",
		action: 'warranty_types'
	},
	'/admin/warranty_types/add': {
		controller: "WarrantyTypeController",
		action: 'warranty_type_add'
	},
	'/admin/warranty_types/edit/:id': {
		controller: "WarrantyTypeController",
		action: 'warranty_type_edit'
	},
	'/admin/warranty_types/delete/:id': {
		controller: "WarrantyTypeController",
		action: 'warranty_type_delete'
	},
	
	'/admin/warranties': {
		controller: "WarrantyController",
		action: 'warranties'
	},
	'/admin/warranties/add': {
		controller: "WarrantyController",
		action: 'warranty_add'
	},
	'/admin/warranties/edit/:id': {
		controller: "WarrantyController",
		action: 'warranty_edit'
	},
	'/admin/warranties/delete/:id': {
		controller: "WarrantyController",
		action: 'warranty_delete'
	},
	
	'/admin/cpvs': {
		controller: "CPVController",
		action: 'cpvs'
	},
	'/admin/cpvs/add': {
		controller: "CPVController",
		action: 'cpv_add'
	},
	'/admin/cpvs/edit/:id': {
		controller: "CPVController",
		action: 'cpv_edit'
	},
	'/admin/cpvs/delete/:id': {
		controller: "CPVController",
		action: 'cpv_delete'
	},
	
	'/admin/caens': {
		controller: "CAENController",
		action: 'caens'
	},
	'/admin/caens/add': {
		controller: "CAENController",
		action: 'caen_add'
	},
	'/admin/caens/edit/:id': {
		controller: "CAENController",
		action: 'caen_edit'
	},
	'/admin/caens/delete/:id': {
		controller: "CAENController",
		action: 'caen_delete'
	},
	
	'/admin/terminals': {
		controller: "TerminalController",
		action: 'terminals'
	},
	'/admin/terminals/add': {
		controller: "TerminalController",
		action: 'terminal_add'
	},
	'/admin/terminals/edit/:id': {
		controller: "TerminalController",
		action: 'terminal_edit'
	},
	'/admin/terminals/delete/:id': {
		controller: "TerminalController",
		action: 'terminal_delete'
	},
	
	'/admin/transactions': {
		controller: "TransactionController",
		action: 'transactions'
	},
	'/admin/transactions/add': {
		controller: "TransactionController",
		action: 'transaction_add'
	},
	'/admin/transactions/edit/:id': {
		controller: "TransactionController",
		action: 'transaction_edit'
	},  

	'/admin/translations': {
		controller: "TranslationController",
		action: 'translations'
	},
	'/admin/translations/add': {
		controller: "TranslationController",
		action: 'translation_add'
	},
	'/admin/translations/edit/:id': {
		controller: "TranslationController",
		action: 'translation_edit'
	},
	'/admin/translations/delete/:id': {
		controller: "TranslationController",
		action: 'translation_delete'
	},
	
	
	'/admin/counties': {
		controller: "CountyController",
		action: 'counties'
	},
	'/admin/counties/add': {
		controller: "CountyController",
		action: 'county_add'
	},
	'/admin/counties/edit/:id': {
		controller: "CountyController",
		action: 'county_edit'
	},
	'/admin/counties/delete/:id': {
		controller: "CountyController",
		action: 'county_delete'
	},
	
	
	'/admin/contacts/add': {
		controller: "ContactController",
		action: 'contact_add'
	},
	'/admin/contacts/edit/:id': {
		controller: "ContactController",
		action: 'contact_edit'
	},
	'/admin/contacts/delete/:id': {
		controller: "ContactController",
		action: 'contact_delete'
	},
	
	'/admin/brokers/add': {
		controller: "BrokerController",
		action: 'broker_add'
	},
	'/admin/brokers/edit/:id': {
		controller: "BrokerController",
		action: 'broker_edit'
	},
	'/admin/brokers/delete/:id': {
		controller: "BrokerController",
		action: 'broker_delete'
	},
	
	
	'/admin/forms': {
		controller: "FormController",
		action: 'forms'
	},
	'/admin/forms/add': {
		controller: "FormController",
		action: 'form_add'
	},
	'/admin/forms/edit/:id': {
		controller: "FormController",
		action: 'form_edit'
	},
	'/admin/forms/delete/:id': {
		controller: "FormController",
		action: 'form_delete'
	},
	

	//-----------admin reports-------------
	'/admin/reports/assets': {
		controller: 'ReportController',
		action: 'assets'
	},
	'/admin/reports/assets/participants/:id': {
		controller: 'ReportController',
		action: 'assets_participants'
	},
	'/admin/reports/assets/orders/:id': {
		controller: 'ReportController',
		action: 'assets_orders'
	},
	'/admin/reports/assets/transactions/:id': {
		controller: 'ReportController',
		action: 'assets_transactions'
	},
	'/admin/reports/assets/warranties/:id': {
		controller: 'ReportController',
		action: 'assets_warranties'
	},
	'/admin/reports/assets/documents/:id': {
		controller: 'ReportController',
		action: 'assets_documents'
	},
	'/admin/reports/assets/quotes/:id': {
		controller: 'ReportController',
		action: 'assets_quotes'
	},
	'/admin/reports/assets/tradeparams/:id': {
		controller: 'ReportController',
		action: 'assets_tradeparams'
	},
	'/admin/reports': {
		controller: 'ReportController',
		action: 'assets_index'
	},
	//------------------------------------
	// files
  
	'get /uploads/*': {
		controller: 'FileController',
		action: 'get'
	},

	//20150812
	'/admin/procedure_types': {
		controller: "ProcedureTypeController",
		action: 'procedure_types'
	},
	'/admin/procedure_types/add': {
		controller: "ProcedureTypeController",
		action: 'procedure_type_add'
	},
	'/admin/procedure_types/edit/:id': {
		controller: "ProcedureTypeController",
		action: 'procedure_type_edit'
	},
	'/admin/procedure_types/delete/:id': {
		controller: "ProcedureTypeController",
		action: 'procedure_type_delete'
	},

	'/admin/contract_types': {
		controller: "ContractTypeController",
		action: 'contract_types'
	},
	'/admin/contract_types/add': {
		controller: "ContractTypeController",
		action: 'contract_type_add'
	},
	'/admin/contract_types/edit/:id': {
		controller: "ContractTypeController",
		action: 'contract_type_edit'
	},
	'/admin/contract_types/delete/:id': {
		controller: "ContractTypeController",
		action: 'contract_type_delete'
	},

	'/admin/procedure_legislations': {
		controller: "ProcedureLegislationController",
		action: 'procedure_legislations'
	},
	'/admin/procedure_legislations/add': {
		controller: "ProcedureLegislationController",
		action: 'procedure_legislation_add'
	},
	'/admin/procedure_legislations/edit/:id': {
		controller: "ProcedureLegislationController",
		action: 'procedure_legislation_edit'
	},
	'/admin/procedure_legislations/delete/:id': {
		controller: "ProcedureLegislationController",
		action: 'procedure_legislation_delete'
	},



	'/admin/procedure_criteria': {
		controller: "ProcedureCriteriaController",
		action: 'procedure_criteria'
	},
	'/admin/procedure_criteria/add': {
		controller: "ProcedureCriteriaController",
		action: 'procedure_criteria_add'
	},
	'/admin/procedure_criteria/edit/:id': {
		controller: "ProcedureCriteriaController",
		action: 'procedure_criteria_edit'
	},
	'/admin/procedure_criteria/delete/:id': {
		controller: "ProcedureCriteriaController",
		action: 'procedure_criteria_delete'
	},
};