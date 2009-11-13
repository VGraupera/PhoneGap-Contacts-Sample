/**
 * @author ryan
 */

//var contactsService;

ContactManager.prototype.getAllContacts = function(successCallback, errorCallback, options) {
	this.contactsService = device.getServiceObject("Service.Contact", "IDataSource");
	
	var criteria = new Object();
	criteria.Type = "Contact";
	
    if (typeof(successCallback) != 'function')
        successCallback = function() {};
    if (typeof(errorCallback) != 'function')
        errorCallback = function() {};
	
	//need a closure here to bind this method to this instance of the contactmanager object
	this.global_success = successCallback;
	var obj = this;
	
	try {
		//WRT: result.ReturnValue is an iterator of contacts
		this.contactsService.IDataSource.GetList(criteria, function(transId, eventCode, result){obj.success_callback(result.ReturnValue);});
	} catch (e) {
		errorCallback(e);
	}
}

ContactManager.prototype.success_callback = function(contacts_iterator) {
	var gapContacts = new Array();
	contacts_iterator.reset();
    var contact;
	while ((contact = contacts_iterator.getNext()) != undefined) {
		try {
			var gapContact = new Contact();
			gapContact.firstName = ContactManager.GetValue(contact, "FirstName");
			gapContact.lastName = ContactManager.GetValue(contact, "LastName");
			gapContact.name = gapContact.firstName + " " + gapContact.lastName;
			gapContact.emails = ContactManager.getEmailsList(contact);
			gapContact.phones = ContactManager.getPhonesList(contact);
			gapContact.address = ContactManager.getAddress(contact);
			gapContacts.push(gapContact);
		} catch (e) {
			alert(e.name + ": " + e.message);
		}
	}
	this.contacts = gapContacts;
	this.global_success();
}

ContactManager.getEmailsList = function(contact) {
	var list;
	try {
		list = {
			"Home": ContactManager.GetValue(contact, "EmailHome"),
			"Work": ContactManager.GetValue(contact, "EmailWork"),
			"General": ContactManager.GetValue(contact, "EmailGen")
		};
	} catch (e) {
		list = {};
	}
	return list;
}

ContactManager.getPhonesList = function(contact) {
	var list;
	try {
		list = {
			"Home": ContactManager.GetValue(contact, "LandPhoneHome"),
			"Mobile": ContactManager.GetValue(contact, "MobilePhoneGen"),
			"Fax": ContactManager.GetValue(contact, "FaxNumberHome"),
			"Work": ContactManager.GetValue(contact, "LandPhoneWork"),
			"WorkMobile": ContactManager.GetValue(contact, "MobilePhoneWork")
		};
	} catch (e) {
		list = {};
	}
	return list;
}

ContactManager.getAddress = function(contact) {
	var list = "";
	try {
		list = ContactManager.GetValue(contact, "AddrLabelHome") + ", " + ContactManager.GetValue(contact, "AddrStreetHome") + ", " +
				ContactManager.GetValue(contact, "AddrLocalHome") + ", " + ContactManager.GetValue(contact, "AddrRegionHome") + ", " + 
				ContactManager.GetValue(contact, "AddrPostCodeHome") + ", " + ContactManager.GetValue(contact, "AddrCountryHome");
	} catch (e) {
		list = "";
	}
	return list;
}

ContactManager.GetValue = function(contactObj, key) {
	try {
		return contactObj[key]["Value"];
	} catch (e) {
		return "";
	}
}
