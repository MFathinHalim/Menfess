

window.onload = function() {

    var pageTitle = document.title;
    var attentionMessage = '(' + Math.floor(Math.random() * 10).toString() + ') Ada yang confess!';
    var blinkEvent = null;
  
    document.addEventListener('visibilitychange', function(e) {
      var isPageActive = !document.hidden;
  
      if(!isPageActive){
        blink();
      }else {
        document.title = pageTitle;
        clearInterval(blinkEvent);
      }
    });
  
    function blink(){
      blinkEvent = setInterval(function() {
        if(document.title === attentionMessage){
          document.title = pageTitle;
        }else {
          document.title = attentionMessage;
        }
      }, 100);
    }
  };
function removeElement(element) {
    element.remove();
}
function myFunction() {
    var x = document.getElementById("background");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
let mybutton = document.getElementById("reload");

function myFunction2() {
    var x = document.getElementById("comment");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
