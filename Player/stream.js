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
    readAll: function(onBuffer) {
      var xhr = new XMLHttpRequest();
      var async = true;
      xhr.open("GET", this.url, async);
      //xhr.responseType = "arraybuffer";
      //var multiBuffer = []; // array of ArrayBuffer
      var lastLength = 0;
      xhr.onprogress = function (event) {
          if (progress) progress(xhr.response, event.loaded, event.total);
          var res = xhr.response;
          var len = r.length;
          if (len >= 100000) { // buffer meta box infomation
            var lendiff = len - lastLength;
            console.log("ProgressiveStream::building part");
            var buffer = new Uint8Array(lendiff);
            for(var i=0; i < lendiff; i++) {
               buffer[i + lastLength] = c; // & 0xff
            }
            lastLength = len;
            //multiBuffer.push(buffer);
            onBuffer(buffer.buffer);
          }
          
      }

      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          ///complete(xhr.response);
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
