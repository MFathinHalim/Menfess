const revealElements = document.querySelectorAll('.reveal');
function downloadImage(img) {
  event.preventDefault();
  const link = document.createElement('a');
  link.href = img.src;
  link.download = 'image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function revealOnScroll() {
  for (let element of revealElements) {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (elementPosition < screenPosition - 150 && elementPosition > -element.offsetHeight + 150) {
      element.classList.add("active");
    }else{
      element.classList.remove("active");
    }
  }
}

const fileInput = document.getElementById("choose");
  const imagePreview = document.getElementById("image-preview");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      imagePreview.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
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
function toggleCommentForm() {
  var form = document.getElementById("commentForm");
  if (form.style.display === "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
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
