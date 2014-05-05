(function () {
	//XHROStatus  = XHR overload status
	if(window.XHROStatus === true) {
		//object is already overridden by this plugin.
		//assuming XHROStatus is unique key.
		console.log('already overridden');
		return;
	}
	var addToXHRList = function () {
		var xhrStatusElement = createDisplayDiv();
		//todo: add browser specific handling. i.e. addEventListener dosent
		//works below IE9
		this.addEventListener('readystatechange', function () {
			updateStatus(xhrStatusElement, this.readyState);
			console.log(this.readyState);
		});
	};
	var displayError = function (message) {
		console.warn(message);
	};

	/*
	UI MODIFIER FUNCTIONS
	 */
	var setupCss = function () {
		var styleTag = document.createElement('style');
		styleTag.textContent = 	
		["#xhrStatusContainer {",
			"top: 10%;",
			"right: 0;",
			"left: 70%;",
			"position: fixed;",
			"height: 50%;",
			"overflow-y: auto;",
			"z-index: 99999;",
		"}",
		"#xhrStatusContainer .xhrstatus {",
			"line-height: 1.3em;",
			"border: solid thin red;",
			"border-right: none;",
			"margin: 2px;",
			"margin-right: none;",
			"background: rgba(255, 255, 255, 0.75);",
		"}",
		"#xhrStatusContainer .xhrstatus:hover {",
			"visibility: hidden;",
		"}"].join('\n');

		document.head.appendChild(styleTag);
	}();
	var createDisplayDiv = function () {
		var parentDiv = document.getElementById('xhrStatusContainer');

		if(parentDiv === null) {
			//create parent div if not already created.
			parentDiv = document.createElement('div');
			parentDiv.setAttribute('id', 'xhrStatusContainer');
			document.body.appendChild(parentDiv);
		}
		var xhrStatusElement = document.createElement('div');
		xhrStatusElement.setAttribute('class', 'xhrstatus');
		parentDiv.appendChild(xhrStatusElement);
		return xhrStatusElement;
	};
	var updateStatus = function (element, readyState) {
		//todo: <s>map these numerical states to string.</s>
		//* need to show the url on which the call is being made and other parameters
		//* color the div as per status.
		//ISSUE: XMLHttpRequest object is changed here thus UNSENT, OPENED, etc are not available
		//directely which should not happen. Fix it.!!!
		if (readyState === XMLHttpRequest.prototype.UNSENT) {	//i.e. 0
			element.textContent = "Unsent";	
		} else if(readyState === XMLHttpRequest.prototype.OPENED) {	//i.e. 1
			element.textContent = "Opened";
		} else if(readyState === XMLHttpRequest.prototype.LOADING) {	//i.e. 2
			element.textContent = "Loading";
		} else if(readyState === XMLHttpRequest.prototype.HEADERS_RECEIVED) {	//i.e. 3
			element.textContent = "Received headers";
		} else if(readyState === XMLHttpRequest.prototype.DONE) {	//i.e. 4
			element.textContent = "Done";
		}
		
	};
	/*
	UI MODIFIER FUNCTIONS ENDS
	 */

	//overriding base Object.
	var baseObject = null;
	if(window.XMLHttpRequest) {
		baseObject = window.XMLHttpRequest;
	} else if(window.ActiveXObject) {	//for older IE
		baseObject = window.ActiveXObject;
	}

	//check if baseObject is present or not. If not
	//then declare warning and exit.
	if(baseObject === null) {
		displayError('Unable to provide this functionality. Either your browser is not supported or some other issue.');
		return;
	}

	//override base object constructor.
	var NewXMLHttpObject = (function (BaseObject) {
		/**
		 * Need to use this self calling method because when we change the original object 
		 * then its reference also changed but we need to keep the old object call to its constructor
		 * preserved.
		 * @return {Function} Returns the new constructor which is to be used.
		 */
		return function () {
			//this call was meant to point to older object thus self calling method is used.
			var returnValue = BaseObject.apply(this, arguments);
			
			//notify our function that an xhr call is made.
			addToXHRList.call(returnValue);
			//returning here because as per ES5 specifications the constructor for XMLHttpRequest
			//returns object.
			return returnValue;
		}
	})(baseObject);
	//Object.create creates a new object using the first argument as prototype.
	//this is not working properly because we do not need to create a new object
	//having __proto__ link, but the same object with the prototype.
	NewXMLHttpObject.prototype = Object.create(baseObject.prototype);	//new baseObject, is also not working properly.
	NewXMLHttpObject.prototype.constructor = NewXMLHttpObject;
	//overriding complete.
	
	//assign back it to base objects.
	if(window.XMLHttpRequest) {
		window.XMLHttpRequest = NewXMLHttpObject;
	} else if(window.ActiveXObject) {
		window.ActiveXObject = NewXMLHttpObject;
	}

	//make key true to prevent further override
	//from this plugin.
	window.XHROStatus = true;
	console.log('Overriding Complete');
})();

/**
 * __Issues__:
 * Not working in chrome.
 */