// The debug-to-log functionConsoleService: Components.
function LogToConsole(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage("ShortlinkRevealer: " + aMessage);
}

// First: find all links within the document
ShortlinkRevealer.attachUrlHooks = function(event) {
	var shortlinkrevealer = document.getElementById("appcontent");   // The browser
	
    if (shortlinkrevealer) {
		// Add an event listener for when the entire DOM has loaded (sort of an "on full page load" event)
		shortlinkrevealer.addEventListener("DOMContentLoaded", ShortlinkRevealer.onPageLoad, true);		
	}
	
	// Add an event listener for when parts of the DOM are modified (ie: ajax)	
	if (shortlinkrevealer) {
		shortlinkrevealer.addEventListener("DOMSubtreeModified", ShortlinkRevealer.onPageLoad, true);
	}
}

// When the page has loaded, parse all A-elements
ShortlinkRevealer.onPageLoad = function(aEvent) {	
	// This gets passed via the DOMContentLoaded event handler
    var origdoc = aEvent.originalTarget;
	
	// Find all a tags
	href_elements = origdoc.getElementsByTagName('a');	
	
	// Debug info
	LogToConsole('The onPageLoad() event was fired, found '+ href_elements.length +' <a href> elements.');

	// Loop them to add some event handlers. Don't do anything else (yet)
	for (i = 0; i < href_elements.length; i++) {
		href_elements[i].addEventListener("mouseover", ShortlinkRevealer.onMouseOver, true);
	}
}

// When the page was modified, add event listeners on all new items
ShortlinkRevealer.onPageChange = function(aEvent) {
	var shortlinkrevealer = document.getElementById("appcontent");   // The browser
	ShortlinkRevealer.onPageChange();
}

// Do the check upon mouseover
ShortlinkRevealer.onMouseOver = function (aEvent) {
	var doc_href = this.href;	// the href location
	var doc_name = this.firstChild.nodeValue; // the name of the link
	
	LogToConsole('Mouseover text '+ doc_name +' with URL to '+ doc_href);

	// This is just a (silly) check, but if a URL has more than X characters
	// I don't process it, since it's not really a "short" url ;-)
	// Short URLS are like:
	// - http://bit.ly/hskAtE
	// - http://bit.ly/gr8mk4
	// - http://ncl.uz/gdA0rf
	// So: "http://" the protocol is 7 chars, the domain usually is 5-7 chars, and the hash is 5-7 chars.
	if (doc_href.length <= 24) {
		// Check if it's a short domain and only one hashtag after it (I'm only checking http, not https)
		arrSplitted = doc_href.split('http://');
		strUrlWithoutHttp = arrSplitted[1];
		arrSplittedAgain = strUrlWithoutHttp.split('/');
		strUrlDomain = arrSplittedAgain[0];
		strUrlLocation = arrSplittedAgain[1];
		
		//alert('Domain: '+ strUrlDomain +', Location: '+ strUrlLocation);
		
		if (strUrlDomain.length <= 6 && strUrlLocation.length <= 7) {
			// The domain is less than or equal 6 chars, the location <= 7. Could be a short URL.
			// Verify the URL
			var req = new XMLHttpRequest();
			req.open('GET', 'http://shortlinkrevealer.mattiasgeniar.be/site/?url_check='+ doc_href, true);	
			req.onreadystatechange = function (aEvt) {				
				if (req.readyState == 4) {
					// We've retrieved the state
					xmlDoc = req.responseXML;
					resp_httpstatus = xmlDoc.firstChild.childNodes[0].childNodes[0].nodeValue;
					
					// Only display something if the HTTP STATUS CODE was not 200 (=OK)
					if (resp_httpstatus != 200) {
						resp_location = xmlDoc.firstChild.childNodes[1].childNodes[0].nodeValue
						
						// Show it
						displayUrlInfo (doc_name, resp_httpstatus +': '+ resp_location);
					}
				}
			};
			
			// Now fire away the Ajax request
			req.send(null);	
		}
	}
}

// This function just comes directly from the Mozilla Documentation.
function displayUrlInfo (title, msg) {
  var image = null;
  var win = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].
                      getService(Components.interfaces.nsIWindowWatcher).
                      openWindow(null, 'chrome://global/content/alerts/alert.xul',
                                  '_blank', 'chrome,titlebar=no,popup=yes', null);
  win.arguments = [image, title, msg, false, ''];
}

// Load our own Event Handler! Yay!
window.addEventListener("load", function (e) { ShortlinkRevealer.attachUrlHooks(e); }, false);

document.body.addEventListener("DOMSubtreeModified", function(){document.title="DOM Changed at " + new Date()}, false);