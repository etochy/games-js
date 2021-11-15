function loadFile(input) {
  console.log(input.files[0].value);
}

function getInputValue() {

  // Selecting the input element and get its value
  let inputVal = document.getElementById("inputId").files[0];

  var fr = new FileReader();
  fr.onload = function () {

    let r = fr.result.replaceAll("\r\n", ";");
    r = r.replaceAll("\t", ";");
    let l = r.split(";");
    let json = "[";
    l.forEach(element => {
      if (element) {
        // console.log(element);
        json += `{
          "position": ${element},
          "level": 1
        },`;
      }
    });
    json += "]";
    console.log(json);
  };

  fr.readAsText(inputVal);
}
