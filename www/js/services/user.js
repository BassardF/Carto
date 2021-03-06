/*
* User service
* CRUD and basic tools
*/
phonecatControllers.service('user', ['$http', '$rootScope', '$location', 'storage', 'crypto', function($http, $rootScope, $location, storage, crypto) {

	this.baseUrl = 'http://ec2-54-191-70-54.us-west-2.compute.amazonaws.com/buddyMap';

	/*
	* Test if a user is in the storage
	* If there is : push him into the give scope and return true
	*/
	this.isUserInStorage = function(){

	}

	this.mailExists = function(mail){
		var config = {
		    	method : "HEAD",
		    	url : this.baseUrl + "/users?mail=" + mail
		    };
		$http(config).success(function() {
					$rootScope.$broadcast('mailExists', true);
		    }).
		    error(function(data, status, headers, config) {
		    	$rootScope.$broadcast('mailExists', false);
		    });
	}

	this.userInfo = function(mail, token){
		var clientTimestamp = Date.now();
		var authorizationHeader = {
			"clientTimestamp" : clientTimestamp,
			"mail" : mail,
			"hashSignature" : crypto.hashSHA256(mail + clientTimestamp + crypto.getHashAlgorythmUsed(), token),
			"hashAlgorythm" : "SHA256"
		}
		var config = {
					method : "GET",
					headers : {
						"Authorization" : JSON.stringify(authorizationHeader)
					},
					url : this.baseUrl + "/users?mail=" + mail
				};
		$http(config).success(function(data) {
					$rootScope.$broadcast('userInfo', data);
				}).
				error(function(data, status, headers, config) {
					$rootScope.$broadcast('userInfo', false);
				});
	}

	/*
	* Log in the user
	* broadcast result
	*/
	this.logIn = function(mail, password){
		var config = {
	    	method : "PUT",
	    	url : this.baseUrl + "/authentication/" + mail,
	    	data : {
					mail : mail,
		     	password : password,
		     	clientTimestamp : Date.now()
	    	}
	    };
	    $http(config).success(function(data) {
	    	storage.storeUser(mail, data);
	    	$rootScope.$broadcast('logIn', {'logIn' : true, 'token':data});
	    }).
	    error(function(data, status, headers, config) {
	    	$rootScope.$broadcast('logIn', {'logIn':false, 'status':status});
	    });
	}

	/*
	* Log out the current user
	* clean the given scope & the storage
	*/
	this.logOut = function(){

	}

	/*
	* Register a new user
	*/
	this.register = function(mail, password, pseudo){
		var config = {
	    	method : "POST",
	    	url : this.baseUrl + "/users",
	    	data : {
		    	"mail" : mail,
			    "pseudo" : pseudo,
			    "password" : password,
	    	}
	    };
	    $http(config).success(function() {
	    	$rootScope.$broadcast('register', {'isRegistered':true, 'user':{'mail':mail, 'password':password}});
	    }).
	    error(function(data, status, headers, config) {
	    	$rootScope.$broadcast('register', {'logIn':false, 'status':status});
		});
	}

	/*
	* Delete a user's account
	*/
	this.delete = function(id, mailOrNickname, password){
		var config = {
	    	method : "DELETE",
	    	url : "mock/.../id",
	    	params : {
		    	login : mailOrNickname,
		     	pwd : password
	    	}
	    };
	    $http(config).success(function(data) {

	    });
	}

	/*
	* Update basic info of an account
	*/
	this.updateProfile = function(id, pseudo, mail, phone, address){
		var config = {
	    	method : "PUT",
	    	url : "mock/.../id",
	    	params : {
		    	pseudo : pseudo,
		     	mail : mail,
		     	phone : phone,
		     	address : address,
	    	}
	    };
	    $http(config).success(function(data) {

	    });
	}

	/*
	* Update a user's password
	*/
	this.updatePwd = function(id, oldPwd, newPwd){
		var config = {
	    	method : "Put",
	    	url : "mock/.../id",
	    	params : {
		    	oldPwd : oldPwd,
		     	newPwd : newPwd
	    	}
	    };
	    $http(config).success(function(data) {

	    });
	}
}]);
