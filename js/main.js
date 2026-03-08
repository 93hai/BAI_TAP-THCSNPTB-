/**
 * @author Đông Ngô <dongngo.2000@gmail.com>
 * 
 */

// Không được thay đổi ở đây - Not to change
$(document).ready(function () {
  setTimeout(function () {
    $(".spinner").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");
    $("body").delay(350).css({ overflow: "visible" });
  }, 600);
});

function start() {
  var btnYes = document.querySelector(".btn--yes");
  var btnNo = document.querySelector(".btn--no");
  var popup = document.querySelector(".modal");
  var overlay = document.querySelector(".modal__overlay");
  var btnClose = document.querySelector(".btn-close");
  var headerModar = document.querySelector(".heading-name");
  var desccriptionModar = document.querySelector(".message");

  window.onload = () => {
    document.querySelector(".music").play();
    document.querySelector(".music").volume = 1;
  };
  window.onkeypress = (e) => {
    if (e.charCode === 32) {
      document.querySelector(".music").play();
    }
  };

  document.querySelector(".header").innerHTML = `
        <h1 class="header-name">
            ${CONFIGDATA.titleHeader}
            <i class="ti-heart"></i>
        </h1>
        <p class="header-description">${CONFIGDATA.descriptionHeader}
            <i class="ti-face-smile"></i>
        </p>`;
  
  // Apply typewriter effect to header
  const headerName = document.querySelector('.header-name');
  const headerDesc = document.querySelector('.header-description');
  typeWriter(headerName, CONFIGDATA.titleHeader + ' ❤️');
  setTimeout(() => {
    typeWriter(headerDesc, CONFIGDATA.descriptionHeader + ' 😊');
  }, 2000);
  
  btnYes.innerHTML = `<i class="ti-thumb-up"></i> ${CONFIGDATA.buttonYes}`;
  btnNo.innerHTML = `<i class="ti-thumb-down"></i> ${CONFIGDATA.buttonNo}`;
  headerModar.innerHTML = `${CONFIGDATA.titleModar} <i class="ti-heart"></i>`;
  desccriptionModar.innerHTML = `${CONFIGDATA.descriptionModar}`;

  btnYes.onclick = () => {
    createConfetti(); // Add confetti effect
    popup.classList.add("show");
  };
  btnClose.onclick = () => {
    popup.classList.remove("show");
  };

  overlay.onclick = () => {
    popup.classList.remove("show");
  };

  // Typewriter effect for header text
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // Confetti effect
  function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.zIndex = '10000';
      confetti.style.pointerEvents = 'none';
      confetti.style.borderRadius = '50%';
      
      document.body.appendChild(confetti);
      
      const animation = confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'ease-out'
      });
      
      animation.onfinish = () => {
        confetti.remove();
      };
    }
  }

  // Function to get random position for the "No" button
  function getRandomPosition() {
    var randomX = Math.floor(Math.random() * (window.innerHeight - 50));
    var randomY = Math.floor(Math.random() * (window.innerWidth - 250));
    return { x: randomX, y: randomY };
  }

  // Function to move the button with delay
  function moveButton() {
    if (!canMove) return;
    canMove = false;
    
    var pos = getRandomPosition();
    btnNo.style.position = "fixed";
    btnNo.style.top = pos.x + "px";
    btnNo.style.left = pos.y + "px";
    btnNo.style.right = "auto";
    
    // Allow movement again after 300ms
    setTimeout(function() {
      canMove = true;
    }, 300);
  }

  // When hover over "No" button, it runs away
  btnNo.addEventListener("mouseenter", moveButton);

  // When click on "No" button, it also runs away
  btnNo.onclick = (e) => {
    e.preventDefault();
    moveButton();
  };
}

start();
