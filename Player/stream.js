'use strict';

var Stream = (function stream() {
  function constructor(url) {
    this.url = url;
  }
  
  constructor.prototype = {
    readAll: function(progress, complete) {
      var xhr = new XMLHttpRequest();
      var async = true;
      xhr.open("GET", this.url, async);
      xhr.responseType = "arraybuffer";
      if (progress) {
        xhr.onprogress = function (event) {
          progress(xhr.response, event.loaded, event.total);
        };
      }
      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
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

var ProgressiveStream = (function stream() {
  function constructor(url) {
    this.url = url;

  }
  
  constructor.prototype = {
    changeBufferCallback: function(newBufferCallback) {
      this.onBuffer = newBufferCallback;
    },
    // First bufferCallback call will have enough data to parse boxes
    // Paremeters swapped to allow called to continue when first chunk is loaded
    readAll: function(complete, bufferCallback) {
      this.onBuffer = bufferCallback;
      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      var async = true;
      xhr.open("GET", this.url, async);
      //xhr.responseType = "arraybuffer";
      var lastLength = 0;
      xhr.onprogress = function (event) {
          var res = xhr.response;
          var absLen = res.length;
          if(absLen === lastLength) return;
          if (absLen >= 17360057) { //8 buffer meta box infomation
            //console.log("absLen " + absLen);
            var relLength = absLen - lastLength;
            var buffer = new Uint8Array(relLength);
            for(var i=0; i < relLength; i++) {
               var c = res.charCodeAt(lastLength+i);
               buffer[i] = c; // & 0xff
            }
            lastLength = absLen;
            this.onBuffer(buffer.buffer);
          }
          
      }.bind(this);

      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          console.log("xhr.response " + xhr.response.length);
          xhr.onprogress(event); // TODO remove?
          if(complete) complete(xhr.response);
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
