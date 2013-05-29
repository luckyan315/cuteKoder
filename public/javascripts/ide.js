window.onload = function(){
  var socket = io.connect('http://localhost');
  var editor = ace.edit("editor");
  var ui = require('./ui');
  editor.getSession().setMode("ace/mode/javascript");

  function onChangeTheme(path){
    editor.setTheme(path); //e.g.: ace/theme/monokai
  }

  socket.emit('sdk-init', {path: 'public'});
  socket.on('loadfile', function(data){
    ui.refreshProjectList(data);
  });
};

