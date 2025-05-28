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
    const to = el.getBoundingClientRect().top + window.pageYOffset - headerH - 20; // Mantém um pequeno offset

    const start = window.pageYOffset;
    const dist = to - start;
    let startTime = null;

    // Função de easing (suavização)
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
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
        // Fechar o menu mobile ao clicar em um link
        if (!mobileMenu.classList.contains('-translate-y-full')) {
            closeMobileMenu();
        }
    });
});


// Controle do menu mobile
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

function openMobileMenu() {
    mobileMenu.style.display = 'flex'; // Exibe o menu
    // Pequeno delay para garantir que 'display: flex' seja aplicado antes da transição
    setTimeout(() => {
        mobileMenu.classList.remove('-translate-y-full', 'opacity-0'); // Remove classes para animar
        mobileMenu.classList.add('opacity-100'); // Garante que a opacidade chegue a 100%
        body.classList.add('no-scroll'); // Ainda útil se o menu ficar muito grande e cobrir parte da tela
    }, 10);
}

function closeMobileMenu() {
    mobileMenu.classList.add('-translate-y-full', 'opacity-0'); // Move o menu para cima e o torna transparente
    mobileMenu.classList.remove('opacity-100'); // Remove a opacidade total
    // Espera a transição terminar para esconder completamente e reabilitar a rolagem
    mobileMenu.addEventListener('transitionend', function handler() {
        mobileMenu.style.display = 'none'; // Esconde o menu após a transição
        body.classList.remove('no-scroll'); // Reabilita rolagem
        mobileMenu.removeEventListener('transitionend', handler); // Remove o listener
    }, { once: true }); // Executa o listener apenas uma vez
}

// Alterna o menu mobile ao clicar no botão de hambúrguer
menuBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('-translate-y-full')) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
});

// Ajuste no clique dos links do menu mobile para fechar o menu
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu(); // Fecha o menu quando um link é clicado
    });
});

// Fecha o menu se a tela for redimensionada para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) { // 768px é o breakpoint 'md' do Tailwind CSS
        closeMobileMenu();
    }
});

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
let pIdx = 0,
    cIdx = 0;

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

// Lógica de animação de entrada das seções (Intersection Observer)
const sections = document.querySelectorAll('main section.section-animated'); // Seleciona apenas as seções que devem ser animadas

const observerOptions = {
    root: null, // O viewport é o root
    rootMargin: '0px',
    threshold: 0.1 // 10% da seção visível para acionar
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Adiciona a classe 'is-visible' para iniciar a transição (no desktop)
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Para de observar depois de animar uma vez
        }
    });
}, observerOptions);

// Observa cada seção
sections.forEach(section => {
    sectionObserver.observe(section);
});


// Inicia efeitos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);

    // No desktop, garantir que a primeira seção (home) já esteja visível
    // e com a classe 'is-visible' aplicada, para não ter um "salto"
    const homeSection = document.getElementById('home');
    if (homeSection && window.innerWidth >= 768) { // Apenas se for desktop
        homeSection.classList.add('is-visible');
    }
});