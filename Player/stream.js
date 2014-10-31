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
      var async = true;
      xhr.open("GET", this.url, async);
      //xhr.responseType = "arraybuffer";
      var lastLength = 0;
      xhr.onprogress = function (event) {
          var res = xhr.response;
          var len = res.length;
          if (len >= 100000) { // buffer meta box infomation
            var lendiff = len - lastLength;
            ///console.log("ProgressiveStream::building part");
            var buffer = new Uint8Array(lendiff);
            for(var i=0; i < lendiff; i++) {
               var c = res.charCodeAt(lastLength+i);
               buffer[i + lastLength] = c; // & 0xff
            }
            lastLength = len;
            this.onBuffer(buffer.buffer);
          }
          
      }.bind(this);

      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
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
