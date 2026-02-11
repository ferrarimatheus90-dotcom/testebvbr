/* Animação de Partículas em Fundo (Configurável) */
document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // CONFIGURAÇÕES (Edite aqui para alterar o efeito)
    // ==========================================
    const configuracao = {
        quantidadeParticulas: 300,       // Número de bolinhas na tela
        distanciaConexao: 100,          // Distância máxima para criar linhas entre elas
        velocidadeBase: 0.5,            // Velocidade de movimento das partículas (maior = mais rápido)
        tamanhoBase: 5,                 // Tamanho máximo das bolinhas
        raioMouse: 10,                 // Raio de interação do mouse
        corParticula: '0, 122, 255',    // Cor RGB (Azul Tech) - Ex: '255, 0, 0' para vermelho
        opacidadeMaxima: 1.2            // Opacidade máxima das bolinhas (0.0 a 1.0)
    };

    // ==========================================
    // LÓGICA DO SISTEMA (Não precisa editar abaixo)
    // ==========================================

    const canvas = document.createElement('canvas');
    const heroBg = document.getElementById('particles-js');
    if (!heroBg) return;

    heroBg.innerHTML = ''; // Limpa se já existir algo
    heroBg.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let largura, altura;
    let particulas = [];

    // Ajusta o tamanho do canvas para a tela inteira
    function redimensionar() {
        largura = canvas.width = window.innerWidth;
        altura = canvas.height = window.innerHeight;
    }

    // Classe que representa cada bolinha
    class Particula {
        constructor() {
            this.x = Math.random() * largura;
            this.y = Math.random() * altura;
            // Define direção aleatória
            this.vx = (Math.random() - 0.5) * configuracao.velocidadeBase;
            this.vy = (Math.random() - 0.5) * configuracao.velocidadeBase;
            this.tamanho = Math.random() * configuracao.tamanhoBase;
            this.opacidade = Math.random() * configuracao.opacidadeMaxima;
        }

        atualizar() {
            this.x += this.vx;
            this.y += this.vy;

            // Se sair da tela, volta pelo outro lado (efeito infinito)
            if (this.x < 0) this.x = largura;
            if (this.x > largura) this.x = 0;
            if (this.y < 0) this.y = altura;
            if (this.y > altura) this.y = 0;
        }

        desenhar() {
            ctx.fillStyle = `rgba(${configuracao.corParticula}, ${this.opacidade})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function iniciarParticulas() {
        particulas = [];
        for (let i = 0; i < configuracao.quantidadeParticulas; i++) {
            particulas.push(new Particula());
        }
    }

    function animar() {
        ctx.clearRect(0, 0, largura, altura);

        particulas.forEach((p, index) => {
            p.atualizar();
            p.desenhar();

            // Desenhar linhas de conexão
            for (let j = index + 1; j < particulas.length; j++) {
                const p2 = particulas[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < configuracao.distanciaConexao) {
                    // A linha fica mais transparente quanto mais longe
                    const opacidadeLinha = 0.1 * (1 - distancia / configuracao.distanciaConexao);
                    ctx.strokeStyle = `rgba(${configuracao.corParticula}, ${opacidadeLinha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        // Efeito interativo do mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x;
            const dy = mouse.y;

            // Brilho sutil ao redor do mouse
            const gradiente = ctx.createRadialGradient(dx, dy, 0, dx, dy, configuracao.raioMouse);
            gradiente.addColorStop(0, `rgba(${configuracao.corParticula}, 0.30)`);
            gradiente.addColorStop(1, 'transparent');
            ctx.fillStyle = gradiente;
            ctx.beginPath();
            ctx.arc(dx, dy, configuracao.raioMouse, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animar);
    }

    const mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
        redimensionar();
        iniciarParticulas();
    });

    redimensionar();
    iniciarParticulas();
    animar();
});
