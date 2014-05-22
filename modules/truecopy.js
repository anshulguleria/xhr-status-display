/**
 * Provides a utility function
 * to copy one object to another, considering configurable,
 * writable, etc property descriptors. It copies all
 * properties irrespective if they are enumerable or not.
 * **NOTE** This copies the objects for only first level of
 * object. Thus nested objects are just copied by reference.
 */

/**
 * @module truecopy
 */
(function (undefined) {

	/**
	 * Copies the self properties from source to target.
	 * @param  {Object} target Target object where properties will be copied.
	 * @param  {Object} source Source object from which to copy properties.
	 * @return {[Object]}        Returns the copied object. Optional because
	 *                                   the target object will already
	 *                                   have the properties copied to it.
	 */
	function copyOwnProperties(target, source) {
		Object.getOwnPropertyNames(source).forEach(function (keyName) {
			//check if property already exists in target object
			if(Object.prototype.hasOwnProperty.call(target, keyName)) {
				//if true then we need to take some precautions.
				//e.g. if the already present property is configurable
				//and writable then only redefine it.
				var targetKeyDescriptor = Object.getOwnPropertyDescriptor(target, keyName);
				if(targetKeyDescriptor.configurable === false ||
					targetKeyDescriptor.writable === false) {
					return;
				}
			}
			var sourceKeyDescriptor = Object.getOwnPropertyDescriptor(source, keyName);
			Object.defineProperty(target, keyName, sourceKeyDescriptor);
		}, this);
		return target;
	}
	try{
		XHROGlobal;
	} catch(ex) {
		XHROGlobal = {};
	}
	XHROGlobal.copyOwnProperties = copyOwnProperties;
})();