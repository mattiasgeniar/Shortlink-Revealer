// First: find all links within the document
ShortlinkRevealer.attachUrlHooks = function(event) {
	var shortlinkrevealer = document.getElementById("appcontent");   // The browser
	
    if (shortlinkrevealer) {
		// Add an event listener for when the entire DOM has loaded (sort of an "on full page load" event)
		shortlinkrevealer.addEventListener("DOMContentLoaded", ShortlinkRevealer.onPageLoad, true);
	}
}

// When the page has loaded, parse all A-elements
ShortlinkRevealer.onPageLoad = function(aEvent) {
	// This gets passed via the DOMContentLoadede event handler
    var origdoc = aEvent.originalTarget;
	
	// Find all a tags
	href_elements = origdoc.getElementsByTagName('a');

	// Loop them to add some event handlers. Don't do anything else (yet)
	for (i = 0; i < href_elements.length; i++) {
		href_elements[i].addEventListener("mouseover", ShortlinkRevealer.onMouseOver, true);
	}
}

// Do the check upon mouseover
ShortlinkRevealer.onMouseOver = function (aEvent) {
	var doc_href = this.href;	// the href location
	var doc_name = this.firstChild.nodeValue; // the name of the link

	// This is just a (silly) check, but if a URL has more than X characters
	// I don't process it, since it's not really a "short" url ;-)
	// Short URLS are like:
	// - http://bit.ly/hskAtE
	// - http://bit.ly/gr8mk4
	// - http://ncl.uz/gdA0rf
	// So: "http://" the protocol is 7 chars, the domain usually is 5-7 chars, and the hash is 5-7 chars.
	alert('URL length: '+ doc_href.length);
	if (doc_href.length <= 24) {	
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