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
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      xhr.open("GET", this.url, async);
      //xhr.responseType = "arraybuffer";
      //xhr.responseType = "text";
      if (progress) {
        xhr.onprogress = function (event) {
          progress(xhr.response, event.loaded, event.total);
        };
      }
      xhr.onreadystatechange = function (event) {
        if (xhr.readyState === 4) {
          console.log("Stream:readall(), done, length " + xhr.response.length); //TODO remove

          var ab = new ArrayBuffer(xhr.response.length);
          var arrayBuffer1 = new Uint8Array(ab);
          console.log(" " +arrayBuffer1.length);
          for(var i=0; i < arrayBuffer1.length; i++) {
            var c = xhr.response.charCodeAt(i);
            //arrayBuffer1.push(c >>> 8);
            arrayBuffer1[i] = c;// & 0xff; //ab += arrayBuffer[i] >>> 8;

            }  
            //console.log("arrayBuffer1[3] "+arrayBuffer1[3] + " " + arrayBuffer1[4]); // JD
            complete(ab); return;

          complete(xhr.response);
          // var byteArray = new Uint8Array(xhr.response);
          // var array = Array.prototype.slice.apply(byteArray);
          // complete(array);
        }
      };
      var ab;
      xhr.onprogress = function (event) {
        //console.log(""+xhr.responseText.length);
        //if(!ab) ab=Uint8Array(xhr.response);
        //console.log("onprogress " + xhr.response.length);
      };
      xhr.send(null);
    }
  };
  return constructor;
})();


