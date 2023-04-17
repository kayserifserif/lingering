import { ProsePlay } from "proseplay";

const lines = document.querySelectorAll(".line") as NodeListOf<HTMLElement>,
  initials = document.querySelectorAll(".initial") as NodeListOf<HTMLElement>,
  echoes = document.querySelectorAll(".echo") as NodeListOf<HTMLElement>,
  ppEchoes: ProsePlay[] = [];

const positions: {[id: string]: number} = {
  "line-1-2": 220,
  "line-1-3": 260,

  "line-2-2": 220,
  "line-2-3": 260,

  "line-3-2": 380,
  "line-3-3": 710,
  "line-3-4": 770,
  
  "line-4-2": 510,
  "line-4-3": 750,

  "line-5-2": 650
}

echoes.forEach(line => {
  const pp = new ProsePlay(line);
  pp.parse(line.innerText);
  if (line.classList.contains("echo")) {
    ppEchoes.push(pp);
  }
});

let lastY = 0;
let hasScrolled = false;
window.scroll({ top: 0 });
setTimeout(() => {
  window.addEventListener("scroll", handleScroll);
}, 15);

function handleScroll() {
  if (window.scrollY < lastY) { // scrolling up
    if (window.scrollY === 0) {
      hasScrolled = false;
      echoes.forEach((echo, i) => {
        const initial = document.querySelector(`#${echo.id.slice(0, 6)}-1`) as HTMLElement;
        const top = parseInt(getComputedStyle(initial).top);
        echo.style.top = `${top}px`;
        ppEchoes[i].slideWindow(0, 0, { millis: 15 });
      });
      initials.forEach(initial => {
        initial.style.opacity = `1`;
      });
      lastY = 0;
    }
    return;
  }

  if (!hasScrolled) {
    echoes.forEach((echo, i) => {
      let top = parseInt(getComputedStyle(echo).top);
      let diff = positions[echo.id] - top;
      ppEchoes[i].slideWindow(0, 1, { millis: diff * 15 });
    });
    hasScrolled = true;
  }

  echoes.forEach(echo => {
    let top = parseInt(getComputedStyle(echo).top);
    if (top >= positions[echo.id]) {
      echo.style.top = `${positions[echo.id]}px`;
    } else {
      top += window.scrollY - lastY;
      echo.style.top = `${top}px`;
    }

    let opacity = parseFloat(getComputedStyle(echo).opacity);
    opacity = opacity + (window.scrollY - lastY) * 0.005;
    opacity = Math.max(opacity, 0.7);
    echo.style.opacity = `${opacity}`;
  });
  
  initials.forEach(initial => {
    let opacity = parseFloat(getComputedStyle(initial).opacity);
    opacity = opacity - (window.scrollY - lastY) * 0.005;
    opacity = Math.max(opacity, 0.2);
    initial.style.opacity = `${opacity}`;
  });

  lastY = window.scrollY;
}