console.log("PERHATIAN! HIRAUKAN SAJA YANG GET 404, ITU KARENA USER TIDAK MENGUPLOAD IMAGE!!!")

// Kode untuk mengatur paginasi

// Ambil element paginasi
const pagination = document.getElementById("pagination");

// Inisialisasi data paginasi
const currentPage = 1; // Halaman saat ini
const itemsPerPage = 10; // Jumlah item per halaman
const totalItems = 100; // Total jumlah item

// Hitung jumlah halaman
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Buat tombol-tombol paginasi
for (let i = 1; i <= totalPages; i++) {
  const button = document.createElement("button");
  button.innerText = i;
  button.addEventListener("click", () => {
    // Menangani klik pada tombol halaman
    currentPage = i;
    displayItems(); // Menampilkan item sesuai halaman yang dipilih
  });
  pagination.appendChild(button);
}

// Fungsi untuk menampilkan item sesuai halaman yang dipilih
function displayItems() {
  // Menghapus item-item sebelumnya
  // dan menampilkan item-item baru sesuai halaman yang dipilih
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Logika untuk menampilkan item-item pada halaman yang dipilih
  // ... (tambahkan kode Anda di sini)
}

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
function showComment(te) {
  var x = document.getElementById("testt" + te);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
function copyLink(te) {
  // get the current noteId
  const noteId = te

  var result = ""

  var fn_arr = fn.split(/[ ]+/)

  for (var i in fn_arr)
    result = result + fn_arr[i].substr(0, 1);
  
    result = result + localsName;
    result = result + te.substr;

  // create the link with the noteId
  const link = window.location.href + "share/" + noteId;
  document.getElementById("link").value = "Link: " + link;
  // copy the link to the clipboard
  navigator.clipboard.writeText(link);

  // alert the user that the link has been copied
  alert("Udah Di salin nih, tinggal kamu kasih aja linknya ke teman kamu(kalau tidak tersalin, silahkan copy text yang terdapat dibawah tombol)");
}

// JavaScript
document.addEventListener("DOMContentLoaded", function() {
  var lazyLoadImages = document.querySelectorAll('.lazy-load');

  // Fungsi untuk memuat gambar saat gambar masuk dalam viewport
  function lazyLoad() {
    for (var i = 0; i < lazyLoadImages.length; i++) {
      if (isElementInViewport(lazyLoadImages[i])) {
        if (lazyLoadImages[i].getAttribute('data-src')) {
          lazyLoadImages[i].src = lazyLoadImages[i].getAttribute('data-src');
          lazyLoadImages[i].removeAttribute('data-src');
        }
      }
    }
  }

  // Fungsi untuk mengecek apakah elemen berada dalam viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Menjalankan fungsi lazyLoad saat halaman dimuat dan saat window di-scroll
  window.addEventListener('DOMContentLoaded', lazyLoad);
  window.addEventListener('scroll', lazyLoad);
});
function revealOnScroll() {
  for (let element of revealElements) {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight;

    if (elementPosition < screenPosition - 150 && elementPosition > -element.offsetHeight + 150) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  }
}
function handleImageError(event, imgElement) {
  imgElement.remove(); // Remove the image element
  event.preventDefault(); // Prevent the error from being logged
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

    if (!isPageActive) {
      blink();
    } else {
      document.title = pageTitle;
      clearInterval(blinkEvent);
    }
  });

  function blink() {
    blinkEvent = setInterval(function() {
      if (document.title === attentionMessage) {
        document.title = pageTitle;
      } else {
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
