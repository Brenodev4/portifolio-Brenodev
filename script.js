// ==========================================================================
// Breno Sousa — Portfólio — interações
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    anoRodape();
    menuMobile();
    linkAtivoNaRolagem();
    efeitoTerminal();
    revelarAoRolar();
    formularioContato();
    barraDeProgresso();
    holofoteDoCursor();
    inclinacaoNoHover();
    cargoRotativo();
});

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const suportaHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Ano dinâmico no rodapé
function anoRodape() {
    const span = document.getElementById('anoAtual');
    if (span) span.textContent = new Date().getFullYear();
}

// Menu mobile (hambúrguer)
function menuMobile() {
    const botao = document.getElementById('navToggle');
    const lista = document.getElementById('navLista');
    if (!botao || !lista) return;

    botao.addEventListener('click', () => {
        const aberto = lista.classList.toggle('aberto');
        botao.classList.toggle('ativo', aberto);
        botao.setAttribute('aria-expanded', String(aberto));
    });

    lista.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            lista.classList.remove('aberto');
            botao.classList.remove('ativo');
            botao.setAttribute('aria-expanded', 'false');
        });
    });
}

// Destaca o link da seção visível na navegação
function linkAtivoNaRolagem() {
    const secoes = document.querySelectorAll('main[id], section[id]');
    const links = document.querySelectorAll('.navegacao a[data-section]');
    if (!secoes.length || !links.length) return;

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const id = entrada.target.getAttribute('id');
                links.forEach(link => {
                    link.classList.toggle('link-ativo', link.dataset.section === id);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secoes.forEach(secao => observer.observe(secao));
}

// Efeito de "digitação" no terminal do hero
function efeitoTerminal() {
    const alvo = document.getElementById('terminalCodigo');
    if (!alvo) return;

    const linhas = [
        '{',
        '  "nome": "Breno Sousa",',
        '  "cargo": "Desenvolvedor Backend",',
        '  "stack": ["Python", "PHP", "MySQL", "JavaScript", "React"],',
        '  "foco": "APIs e regras de negócio robustas",',
        '  "status": "disponível para novos projetos"',
        '}'
    ];

    if (prefersReduced) {
        alvo.textContent = linhas.join('\n');
        return;
    }

    let linhaAtual = 0;
    let colunaAtual = 0;

    function digitar() {
        if (linhaAtual >= linhas.length) return;

        const linha = linhas[linhaAtual];
        if (colunaAtual <= linha.length) {
            const textoAteAgora = linhas.slice(0, linhaAtual).join('\n');
            const separador = linhaAtual > 0 ? '\n' : '';
            alvo.textContent = textoAteAgora + separador + linha.slice(0, colunaAtual);
            colunaAtual++;
            setTimeout(digitar, 14 + Math.random() * 18);
        } else {
            linhaAtual++;
            colunaAtual = 0;
            setTimeout(digitar, 90);
        }
    }

    digitar();
}

// Revela elementos com a classe .reveal conforme entram na tela
function revelarAoRolar() {
    const elementos = document.querySelectorAll('.reveal');
    if (!elementos.length) return;

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach(el => observer.observe(el));
}

// Envio do formulário de contato — abre o cliente de e-mail do visitante
// já preenchido com os dados digitados, endereçado ao e-mail do Breno.
function formularioContato() {
    const form = document.getElementById('formulario');
    const status = document.getElementById('formStatus');
    const EMAIL_DESTINO = 'sousabreno793@gmail.com';
    if (!form || !status) return;

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (!form.checkValidity()) {
            status.textContent = 'Preencha todos os campos antes de enviar.';
            status.style.color = 'var(--vermelho)';
            return;
        }

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const mensagem = form.mensagem.value.trim();

        const assunto = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
        const corpo = encodeURIComponent(
            `Nome: ${nome}\nE-mail: ${email}\n\nMensagem:\n${mensagem}`
        );

        window.location.href = `mailto:${EMAIL_DESTINO}?subject=${assunto}&body=${corpo}`;

        status.textContent = 'Abrindo seu aplicativo de e-mail para concluir o envio...';
        status.style.color = 'var(--acento)';
        form.reset();
    });
}

// Barra fina no topo mostrando o progresso de rolagem da página
function barraDeProgresso() {
    const barra = document.getElementById('barraProgresso');
    if (!barra) return;

    function atualizar() {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const percentual = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
        barra.style.width = `${percentual}%`;
    }

    atualizar();
    window.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
}

// Halo de luz sutil que acompanha o cursor pelo fundo da página
function holofoteDoCursor() {
    const holofote = document.getElementById('holofote');
    if (!holofote || !suportaHover || prefersReduced) return;

    window.addEventListener('pointermove', (evento) => {
        holofote.style.setProperty('--x', `${evento.clientX}px`);
        holofote.style.setProperty('--y', `${evento.clientY}px`);
    }, { passive: true });
}

// Alterna o cargo exibido ao lado do nome, com um leve fade entre as trocas
function cargoRotativo() {
    const alvo = document.getElementById('cargoRotativo');
    if (!alvo) return;

    const cargos = ['Backend', 'Fullstack', 'de APIs', 'em Python & PHP'];
    let indice = 0;

    if (prefersReduced) return;

    setInterval(() => {
        alvo.classList.add('trocando');

        setTimeout(() => {
            indice = (indice + 1) % cargos.length;
            alvo.textContent = cargos[indice];
            alvo.classList.remove('trocando');
        }, 220);
    }, 2600);
}

// Leve inclinação 3D ao passar o mouse sobre o terminal e os cards de projeto
function inclinacaoNoHover() {
    if (!suportaHover || prefersReduced) return;

    const elementos = document.querySelectorAll('.terminal, .projetos-card');

    elementos.forEach(el => {
        el.addEventListener('pointerenter', () => {
            el.style.animationPlayState = 'paused';
        });

        el.addEventListener('pointermove', (evento) => {
            const retangulo = el.getBoundingClientRect();
            const px = (evento.clientX - retangulo.left) / retangulo.width - 0.5;
            const py = (evento.clientY - retangulo.top) / retangulo.height - 0.5;
            const inclinacaoX = (py * -6).toFixed(2);
            const inclinacaoY = (px * 6).toFixed(2);
            el.style.transform = `perspective(900px) rotateX(${inclinacaoX}deg) rotateY(${inclinacaoY}deg) translateY(-4px)`;
        });

        el.addEventListener('pointerleave', () => {
            el.style.transform = '';
            el.style.animationPlayState = '';
        });
    });
}
