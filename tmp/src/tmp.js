var common = require('./common');

common.walk('/home/luckyan315/code/svn/cloudIde/src/views', print);

function print(err, file){
  if( err ){
    console.log(err);
  } else {
    console.log(file);
  }

}
