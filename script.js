let wordTranslations = {};
function initializeDict() {
  let sheetIdInput = document.getElementById('sheetidinput');
  let id = sheetIdInput.value;
  wordTranslations = {};
  fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json`)
    .then(res => res.text())
    .then(text => {
        const json = JSON.parse(text.substr(47).slice(0, -2))
        let rows = json["table"]["rows"];
    // console.log(json);
        let translations = {};
        for(let r of rows) {
          let cells = r["c"];
          wordTranslations[cells[0]["v"].toLowerCase()] = cells[1]["v"].toLowerCase();
        }
    });
  console.log(`New words dict: ${JSON.stringify(wordTranslations).substr(0, 20)}`)
}
function start(){
  let sheetIdInput = document.getElementById('sheetidinput');
      // '123SaKuLRdHcwEKhhQVOKd2_3j30nFvQbTgplh4nPZOg';
  initializeDict();
  $('#input').on("change keyup paste", function(event) {
    let inputText = document.getElementById('input').value;
    let lines = inputText.split(/(\n+)/);
    let outputArr = [];
    for(let line of lines) {
        let arr = line.split(/(\s+)/);
        let lineHtmlArr = [];
        for(let el of arr) {
          if(el == "")
             continue;
          if(el.toLowerCase() in wordTranslations) {
            lineHtmlArr.push(`<span class="translated">${wordTranslations[el.toLowerCase()]}</span>&nbsp;`);
            outputArr.push(`<span class="original">${el}</span>&nbsp;`)
          }
          else if(/^(\s+)$/.test(el)){
            if(el.length == 1) {
              // lineHtmlArr.push(`<span>${el.replaceAll('\n', '<br/>')}</span>`);
            // outputArr.push(`<span class="original">${el.replaceAll('\n', '<br/>')}</span>`);  
            } else{
              lineHtmlArr.push(`<span>${el.replaceAll(' ', '&nbsp;').replaceAll('\n', '<br/>')}</span>`);
              outputArr.push(`<span class="original">${el.replaceAll(' ', '&nbsp;').replaceAll('\n', '<br/>')}</span>`);
            }
          }
          else {
            lineHtmlArr.push(`<span class="unchanged">${el}</span>&nbsp;`);
            outputArr.push(`<span class="original">${el}</span>&nbsp;`);
          }
        }
        
      outputArr.push('<br/>');
      for(let el of lineHtmlArr) {
        outputArr.push(el);
      }
    }
    
    let output = outputArr.join("");
    $("#output").html(output);
  });
}

window.onload = start;