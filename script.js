// Controle do tema dark/light
const toggleBtn = document.getElementById('toggle-theme');
const htmlEl = document.documentElement;

// Verifica preferência salva ou usa dark mode como padrão
let darkMode = localStorage.getItem('darkMode') !== 'false';

function applyTheme() {
  if (darkMode) {
    htmlEl.classList.add('dark');
    toggleBtn.textContent = 'Modo Light';
  } else {
    htmlEl.classList.remove('dark');
    toggleBtn.textContent = 'Modo Dark';
  }
}

// Alternar tema
toggleBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  applyTheme();
});

// Aplicar tema ao carregar
applyTheme();

// Scroll suave para âncoras
function smoothScroll(target, duration = 800) {
  const el = document.querySelector(target);
  if (!el) return;
  
  const headerH = document.querySelector('header').offsetHeight;
  const to = el.getBoundingClientRect().top + window.pageYOffset - headerH - 20;
  const start = window.pageYOffset;
  const dist = to - start;
  let startTime = null;

  // Função de easing (suavização)
  function ease(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2)-1) + b;
  }

  // Animação
  function anim(now) {
    if (!startTime) startTime = now;
    const t = now - startTime;
    window.scrollTo(0, ease(t, start, dist, duration));
    if (t < duration) requestAnimationFrame(anim);
  }

  requestAnimationFrame(anim);
}

// Configura todos os links internos
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    smoothScroll(a.getAttribute('href'));
    // Fecha menu mobile se estiver aberto
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});

// Controle do menu mobile
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
closeBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));

// Efeito de digitação
const typingText = document.getElementById('typing-text');
const phrases = [
  'Olá, me chamo Arthur Godoy Stacke',
  'Desenvolvedor Front-End', 
  'HTML5', 
  'Tailwind CSS', 
  'CSS3', 
  'JavaScript'
];
let pIdx = 0, cIdx = 0;

function type() {
  if (cIdx < phrases[pIdx].length) {
    typingText.textContent += phrases[pIdx].charAt(cIdx++);
    setTimeout(type, 80);
  } else {
    setTimeout(erase, 1200);
  }
}

function erase() {
  if (cIdx > 0) {
    typingText.textContent = phrases[pIdx].substring(0, --cIdx);
    setTimeout(erase, 50);
  } else {
    pIdx = (pIdx + 1) % phrases.length;
    setTimeout(type, 500);
  }
}

// Formulário de contato
const form = document.getElementById('contact-form');
const msgBox = document.getElementById('form-message');

form.addEventListener('submit', e => {
  e.preventDefault();
  
  const nome = document.getElementById('name').value.trim();
  const mensagem = document.getElementById('message').value.trim();
  
  // Validação
  if (!nome || !mensagem) {
    msgBox.textContent = 'Preencha todos os campos';
    msgBox.className = 'text-red-400 text-center mt-2 text-sm';
    return setTimeout(() => msgBox.textContent = '', 3000);
  }
  
  // Envia para WhatsApp (substitua SEUNUMERO)
  const text = encodeURIComponent(` Mensagem: ${mensagem}`);
  window.open(`https://wa.me/5551998862191?text=${text}`, '_blank');
  
  // Feedback visual
  msgBox.textContent = 'Mensagem enviada com sucesso!';
  msgBox.className = 'text-green-400 text-center mt-2 text-sm';
  form.reset();
  
  setTimeout(() => msgBox.textContent = '', 3000);
});

// Inicia efeitos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(type, 1000);
});