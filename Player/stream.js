'use strict';

var Stream = (function stream() {
  function constructor(url) {
    this.url = url;
  }
  
  constructor.prototype = {
    readAll: function(progress, complete) {
      console.log("Stream:readall()"); //TODO remove
      var xhr = new XMLHttpRequest();
      var async = true;
      xhr.open("GET", this.url, async);
      xhr.responseType = "arraybuffer";
      if (progress) {
        xhr.onprogress = function (event) {
           console.log("Stream:onprogress()"); //TODO remove
          progress(xhr.response, event.loaded, event.total);
        };
      }
      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          console.log("Stream:readall(), done"); //TODO remove
          complete(xhr.response);
          // var byteArray = new Uint8Array(xhr.response);
          // var array = Array.prototype.slice.apply(byteArray);
          // complete(array);
        }
      }
      xhr.send(null);
    }
  };
  return constructor;
})();


