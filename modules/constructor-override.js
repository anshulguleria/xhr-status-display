var Overriding = {};
/**
 * @module overridemodule
 */
(function () {

	//Steps to override an existing contstuctor.
	//1. inheriting instance properties.
	//2. inheriting prototype properties
	//3. ensuring instanceof works
	//[optional] 4. overriding a method present in super constructor in sub constructor
	//[optional] 5. enabling super calls in the overrided method to be able to do super functionalities.
	
	/**
	 * Function to copy all the self properties including its own property
	 * descriptors.
	 * @param  {Object} target Target object on which all properties will be
	 *                           copied.
	 * @param  {Object} source Source object from which all properties will be
	 *                         copied.
	 * @return {Object}        Returns the target object. Return value is optional
	 *                                 since it copies all the properties to target object
	 *                                 directely thus changes are made directely on target
	 *                                 object.
	 */
	function copyOwnProperties(target, source) {
		Object.getOwnPropertyNames(source).forEach(function (keyName) {
			var keyConfig = Object.getOwnPropertyDescriptor(source, keyName);
			if(Object.prototype.hasOwnProperty.call(target, keyName)) {
				//HANDLE THE ALREDY DEFINED PROPERTIES WHICH ARE NOT CONFIGURABLE
				//THEN DON'T CHANGE THEM
				var presentKeyConfig = Object.getOwnPropertyDescriptor(target, keyName);
				if(presentKeyConfig.configurable === false) {
					return;
				}
			}
			Object.defineProperty(target, keyName, keyConfig);
		}, this);
	}
	
	/**
	 * Function to override some constructor with our own constructor.
	 * @param  {[type]} OriginalConstructor [description]
	 * @return {[type]}                     [description]
	 */
	var injectFunctionInConstructor = function(OriginalConstructor, functionToInject) {
		//step1: inheriting instance properties.
		var OverriddenConstructor = function () {
			var instance = OriginalConstructor.apply(this, arguments);
			//this check is required for those constructors which returns the instances.
			functionToInject(instance?instance:this);
			return instance? instance : this;
		};

		//step2: inheriting prototype properties.
		OverriddenConstructor.prototype = Object.create(OriginalConstructor.prototype);
		//preserve its own constructor.
		OverriddenConstructor.prototype.constructor = OverriddenConstructor;
		//we also need to copy all the properties that OriginalConstructor has with itself.
		copyOwnProperties(OverriddenConstructor, OriginalConstructor);

		//step3: ensuring instanceof works
		(function testInstanceofOperator () {
			var overriddenInstance = new OverriddenConstructor('Test', 'Object');
			if(overriddenInstance instanceof OverriddenConstructor) {
				//instanceof works
				if(OverriddenConstructor.prototype.isPrototypeOf(overriddenInstance)) {
					//prototype also holds true
				} else {
					throw("Prototype chaining is not correct for OverriddenConstructor.");
				}
			} else {
				throw("instanceof is not working for OverriddenConstructor.");
			}

			//but the above scenario should also holds true for OriginalConstructor
			if(overriddenInstance instanceof OriginalConstructor) {
				//instanceof works
				if(OriginalConstructor.prototype.isPrototypeOf(overriddenInstance)) {
					//prototype also holds true.
				} else {
					throw("Prototype chaining is not correct for OriginalConstructor");
				}
			} else {
				throw('instanceof is not working for OriginalConstructor')
			}
		})();

		return OverriddenConstructor;		
	};

	if(!Overriding.injectFunctionInConstructor){
		Overriding.injectFunctionInConstructor = injectFunctionInConstructor;
	}
})();

/**
 * @module testmodule
 */
(function (injectFunctionInConstructor) {
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

})(Overriding.injectFunctionInConstructor)