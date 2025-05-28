// Controle do tema dark/light
const toggleBtn = document.getElementById('toggle-theme');
const htmlEl = document.documentElement;

// Verifica preferência salva ou usa dark mode como padrão
let darkMode = localStorage.getItem('darkMode') !== 'false';

function applyTheme() {
    if (darkMode) {
        htmlEl.classList.add('dark');
    } else {
        htmlEl.classList.remove('dark');
    }
    // Atualiza o emoji do botão
    toggleBtn.textContent = darkMode ? '☀️' : '🌙';
}

// Alternar tema
toggleBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyTheme();
});

// Aplicar tema ao carregar
applyTheme();

// Detecta se é desktop (>= 768px) ou mobile
function isDesktop() {
    return window.innerWidth >= 768;
}

// Scroll suave customizado para desktop
function smoothScroll(target, baseSpeed = 0.5, minDuration = 300, maxDuration = 700) {
    const el = document.querySelector(target);
    if (!el) return;

    const headerH = document.querySelector('header').offsetHeight;
    const to = el.getBoundingClientRect().top + window.pageYOffset - headerH - 20;

    const start = window.pageYOffset;
    const distance = Math.abs(to - start);

    const duration = Math.min(maxDuration, Math.max(minDuration, distance * baseSpeed));

    let startTime = null;

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function anim(now) {
        if (!startTime) startTime = now;
        const t = now - startTime;
        window.scrollTo(0, ease(t, start, to - start, duration));
        if (t < duration) requestAnimationFrame(anim);
    }

    requestAnimationFrame(anim);
}

// Evento de clique nos links com âncoras
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = link.getAttribute('href');

        if (isDesktop()) {
            // No desktop: scroll suave customizado
            smoothScroll(target);
        } else {
            // No mobile: scroll suave nativo
            const el = document.querySelector(target);
            if (!el) return;

            // Fecha menu mobile se aberto
            if (!mobileMenu.classList.contains('-translate-y-full')) {
                closeMobileMenu();
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Adiciona CSS global para scroll suave nativo (mobile e desktop)
const style = document.createElement('style');
style.textContent = `
    html {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);

// Controle do menu mobile
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;

function openMobileMenu() {
    mobileMenu.style.display = 'flex'; // Exibe o menu
    setTimeout(() => {
        mobileMenu.classList.remove('-translate-y-full', 'opacity-0');
        mobileMenu.classList.add('opacity-100');
        body.classList.add('no-scroll');
    }, 10);
}

function closeMobileMenu() {
    mobileMenu.classList.add('-translate-y-full', 'opacity-0');
    mobileMenu.classList.remove('opacity-100');
    mobileMenu.addEventListener('transitionend', function handler() {
        mobileMenu.style.display = 'none';
        body.classList.remove('no-scroll');
        mobileMenu.removeEventListener('transitionend', handler);
    }, { once: true });
}

menuBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('-translate-y-full')) {
        openMobileMenu();
    } else {
        closeMobileMenu();
    }
});

// Fecha menu ao clicar em link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Fecha menu se redimensionar para desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
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

    if (!nome || !mensagem) {
        msgBox.textContent = 'Preencha todos os campos';
        msgBox.className = 'text-red-400 text-center mt-2 text-sm';
        return setTimeout(() => msgBox.textContent = '', 3000);
    }

    const text = encodeURIComponent(`Mensagem: ${mensagem}`);
    window.open(`https://wa.me/5551998862191?text=${text}`, '_blank');

    msgBox.textContent = 'Mensagem enviada com sucesso!';
    msgBox.className = 'text-green-400 text-center mt-2 text-sm';
    form.reset();

    setTimeout(() => msgBox.textContent = '', 3000);
});

// Animações das seções (Intersection Observer) só no desktop
const sections = document.querySelectorAll('main section.section-animated');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    if (!isDesktop()) return; // Desliga animação no mobile

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Inicia efeitos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);

    if (isDesktop()) {
        const homeSection = document.getElementById('home');
        if (homeSection) homeSection.classList.add('is-visible');
    }
});
