/**
 * @module overridemodule
 * @requires truecopy because in step 2 we used copyOwnProperties.
 */
(function () {

	/**
	 * Steps to override an existing contstuctor.
	 * 1. inheriting instance properties.
	 * 2. inheriting prototype properties
	 * 3. ensuring instanceof works
	 * [optional] 4. overriding a method present in super constructor in sub constructor
	 * [optional] 5. enabling super calls in the overrided method to be able to do super functionalities.
	 */
	
	/**
	 * Function to inject the provided fuctionality in the given
	 * Constructor.
	 * @param  {Function} SourceConstructor Reference to original constructor.
	 * @param  {Function} beforeFunction    Function to inject before any thing
	 *                                      begins.
	 * @param  {Function} afterFunction 	Function to inject after the super
	 *                                   	function has been run.
	 * @return {Function}                   Overridden constructor with the
	 *                                                   injected function(s).
	 */
	var injectInConstructor = function(SourceConstructor, beforeFunction, afterFunction) {
		//handle beforeFunction and afterFunction if not send;
		if(!beforeFunction || typeof(beforeFunction) !== 'function') {
			beforeFunction = function () {};
		}
		if(!afterFunction || typeof(afterFunction) !== 'function') {
			afterFunction = function () {};
		}

		//step1: inheriting instance properties.
		var OverriddenConstructor = function () {
			beforeFunction(this);
			var instance = SourceConstructor.apply(this, arguments);
			//this check is required for those constructors which returns the instances.
			var finalInstance = instance?instance:this;
			afterFunction(finalInstance);
			return finalInstance;
		};

		//step2: inheriting prototype properties.
		OverriddenConstructor.prototype = Object.create(SourceConstructor.prototype);
		//preserve its own constructor.
		OverriddenConstructor.prototype.constructor = OverriddenConstructor;
		//we also need to copy all the properties that SourceConstructor has with itself.
		XHROGlobal.copyOwnProperties(OverriddenConstructor, SourceConstructor);

		//step3: ensuring instanceof works
		//this ste will be done in testmodule		

		return OverriddenConstructor;		
	};

	if(!XHROGlobal.injectInConstructor){
		XHROGlobal.injectInConstructor = injectInConstructor;
	}
})();