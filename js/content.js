(function(globals){
  "use strict";
  
  chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      sendResponse();
    }
  );
}(this));