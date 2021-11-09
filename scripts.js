function loadFile(input) {
  console.log(input.files[0].value);
}

function getInputValue() {
  // Selecting the input element and get its value 
  let inputVal = document.getElementById("inputId").files[0]
  
  var fr=new FileReader();
  fr.onload=function(){
      console.log(fr.result);
  }
    
  fr.readAsText(inputVal)
}