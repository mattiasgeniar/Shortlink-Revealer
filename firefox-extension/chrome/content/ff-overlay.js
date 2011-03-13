// First: find all links within the document
ShortlinkRevealer.attachUrlHooks = function(event) {
	//alert('call started');
	/*href_elements = document.getElementsByTagName('a');
	alert(href.elements.length);
	for (i = 0; i < href_elements.length; i++) {
		alert(i);
	}*/
	
	var shortlinkrevealer = document.getElementById("appcontent");   // browser
	
    if (shortlinkrevealer) {
		shortlinkrevealer.addEventListener("DOMContentLoaded", ShortlinkRevealer.onPageLoad, true);
	}
}

// When the page has loaded, parse all A-elements
ShortlinkRevealer.onPageLoad = function(aEvent) {
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

	// Verify the URL
	var req = new XMLHttpRequest();
    req.open('GET', 'http://shortlinkrevealer.mattiasgeniar.be/site/?url_check='+ doc_href, true);	
    req.onreadystatechange = function (aEvt) {				
		if (req.readyState == 4) {
			// We've retrieved the state
			xmlDoc = req.responseXML;
			resp_httpstatus = xmlDoc.firstChild.childNodes[0].childNodes[0].nodeValue;
			if (resp_httpstatus != 200) {
				resp_location = xmlDoc.firstChild.childNodes[1].childNodes[0].nodeValue
				
				// Show it
				displayUrlInfo (doc_name, resp_httpstatus +': '+ resp_location);
			}
		}
    };
	req.send(null);	
}

function displayUrlInfo (title, msg) {
  var image = null;
  var win = Components.classes['@mozilla.org/embedcomp/window-watcher;1'].
                      getService(Components.interfaces.nsIWindowWatcher).
                      openWindow(null, 'chrome://global/content/alerts/alert.xul',
                                  '_blank', 'chrome,titlebar=no,popup=yes', null);
  win.arguments = [image, title, msg, false, ''];
}

window.addEventListener("load", function (e) { ShortlinkRevealer.attachUrlHooks(e); }, false);