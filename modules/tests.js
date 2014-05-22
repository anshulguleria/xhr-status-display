/**
 * Contains the test cases for the functionality and proper
 * overriding of base/original constructor.
 */

/**
 * @module testmodule
 */
(function (undefined) {
	//#Test 1
	//checking if instanceof works for its own object.
	//can also be called as `step 3` in overriding.
	


	//#Test 2
	//check if instanceof works for the Original constructor.
})();

/**
 * @module testmodule
 */
/*(function (injectFunctionInConstructor) {
	var Person = function (firstName, lastName) {
		'use strict';
		this.firstName = firstName;
		this.lastName = lastName;
	};
	Person.LOWERCAST = 0;
	Person.MIDDLECAST = 1;
	Person.HIGHERCAST = 2;
	Person.prototype.fullName = function () {
		'use strict';
		return this.firstName + ' ' + this.lastName;
	};

	console.log('Calling original function');
	var baseInstance = new Person('Base', 'Instance');
	console.log(baseInstance.fullName());

	//creating overridden instance
	var ModifiedPerson = injectFunctionInConstructor(Person, function (instanceObject) {
		console.log('Constructor for modified person called');
		console.log(instanceObject);
	});
	console.log('Calling modified person');
	var modifiedInstance = new ModifiedPerson('Modified', 'Instance');
	console.log(modifiedInstance.fullName());
	//log Constructor properties
	console.log(ModifiedPerson.LOWERCAST);

	//changing the original name to replace original functionality with modified one.
	var Person = (function(Person) {
		return injectFunctionInConstructor(Person, function(instanceObject) {
			console.log('Constructor for replaced original constructor called');
			console.log(instanceObject);
		});
	})(Person);
	console.log('Calling replaced Person');
	var replacedPerson = new Person('Replaced', 'Successfuly');
	console.log(replacedPerson.fullName());
	console.log(Person.HIGHERCAST);

})(Overriding.injectFunctionInConstructor)*/