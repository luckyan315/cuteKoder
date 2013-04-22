var editor = ace.edit("editor");
editor.getSession().setMode("ace/mode/javascript");

function onChangeTheme(path){
  editor.setTheme(path); //e.g.: ace/theme/monokai
}
