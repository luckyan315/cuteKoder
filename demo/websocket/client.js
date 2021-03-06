(function(){
  var ws = new WebSocket("ws://localhost:8080");
  var oOut = document.getElementById('output');
  var oSend = document.getElementById('send');
  var oMsg = document.getElementById('msg');

  function log(event, msg){
    return '<div>' + event + ': ' + msg + '</div>';
  }

  
  send.addEventListener('click', function(){
    ws.send(oMsg.value);
    oOut.innerHTML += log('Sent', oMsg.value);
  });

  ws.onmessage = function(e){
    oOut.innerHTML += log('Recieved', e.data);
  };

  ws.onclose = function(e){
    oOut.innerHTML += log('Disconnected', e.code + '-' + e.type);
  };

  ws.onerror = function(e){
    foOut.innerHTML += log('Error', e.data);
  };
  
}());