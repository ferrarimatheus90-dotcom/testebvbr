<?php get_header(); ?>

<main>
    <!-- Section 01: Hero -->
    <section class="hero" id="hero">
        <div class="container hero-content">
            <span class="eyebrow">Otimização de Vendas e Marketing</span>
            <h1 class="headline">Construir crescimento com <br><span class="highlight">Marketing que vende.</span></h1>
            <p class="subheadline">Consultoria estratégica focada em aumentar suas taxas de conversão e ROI através
                de processos de vendas validados e ferramentas de otimização.</p>
            <a href="#protocol" class="btn-primary">Aumentar Minhas Conversões</a>
        </div>
        <div class="hero-bg-effect"></div>
    </section>

    <!-- Section 02: O Manifesto -->
    <section class="manifesto">
        <div class="container">
            <p class="manifesto-text">"Vender é uma ciência.<br>Escalar é <span class="highlight">tecnologia</span>."
            </p>
        </div>
    </section>

    <!-- Section 02.5: Sobre (New) -->
    <section class="about" id="sobre">
        <div class="container about-grid">
            <div class="about-content">
                <span class="eyebrow">Sobre o Especialista</span>
                <h2>Bruno Viana</h2>
                <p>Profissional apaixonado por marketing com 25 anos de experiência no mercado.</p>
                <p>Ao longo de duas décadas e meia, vi a internet nascer, amadurecer e se tornar o maior canal de
                    vendas do mundo. Minha jornada não começou com hacks de curto prazo, mas com a construção sólida
                    de marcas e estratégias comerciais.</p>
                <p>Hoje, uno essa bagagem estratégica clássica com o que há de mais avançado em IA e automação para
                    criar funis de vendas à prova de falhas.</p>
                <ul class="stats-list">
                    <ul class="stats-list">
                        <li><strong>+R$ 10M</strong> em vendas otimizadas</li>
                        <li><strong>+50</strong> funis reestruturados</li>
                        <li><strong>ROI</strong> como métrica principal</li>
                    </ul>
            </div>
            <div class="about-visual">
                <div class="profile-frame">
                    <!-- Updated image path for WordPress -->
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/bruno-viana.jpg?v=2" alt="Bruno Viana"
                        class="profile-img">
                    <div class="scan-line"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 02.6: Metodologia (New) -->
    <section class="methodology" id="metodologia">
        <div class="container">
            <div class="section-header">
                <span class="eyebrow">Como Aceleramos Seus Resultados</span>
                <h2>Engenharia de Vendas</h2>
            </div>
            <div class="steps-grid">
                <div class="step-card">
                    <span class="step-number">01</span>
                    <h3>Auditoria de Funil</h3>
                    <p>Analisamos cada etapa da jornada do seu cliente para encontrar onde você está deixando
                        dinheiro na mesa.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">02</span>
                    <h3>Otimização de Conversão</h3>
                    <p>Refinamos scripts, ofertas e a experiência do usuário para maximizar a chance de compra a
                        cada interação.</p>
                </div>
                <div class="step-card">
                    <span class="step-number">03</span>
                    <h3>Ferramentas de Escala</h3>
                    <p>Implementamos a tecnologia certa para que sua equipe venda mais, com menos esforço manual.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 03: Pilares -->
    <section class="pillars">
        <div class="container">
            <div class="grid-pillars">
                <div class="pillar-card interactive-icon">
                    <div class="icon-wrapper">
                        <span class="icon-emoji">📈</span>
                        <div class="shock-wave"></div>
                    </div>
                    <h3>Conversão Extrema</h3>
                    <p>Técnicas avançadas para transformar visitantes curiosos em clientes pagantes.</p>
                    <ul class="pillar-details">
                        <li>Auditoria de UX/UI Profunda</li>
                        <li>Copywriting Persuasivo (Neuromarketing)</li>
                        <li>Testes A/B Contínuos</li>
                    </ul>
                </div>
                <div class="pillar-card interactive-icon">
                    <div class="icon-wrapper">
                        <span class="icon-emoji">🛠️</span>
                        <div class="shock-wave"></div>
                    </div>
                    <h3>Ferramentas de Venda</h3>
                    <p>Implementação de CRMs e automações que potencializam a força comercial.</p>
                    <ul class="pillar-details">
                        <li>Implementação de CRM Personalizado</li>
                        <li>Automação de Follow-up (Email/WhatsApp)</li>
                        <li>Dashboards de KPIs em Tempo Real</li>
                    </ul>
                </div>
                <div class="pillar-card interactive-icon">
                    <div class="icon-wrapper">
                        <span class="icon-emoji">🧠</span>
                        <div class="shock-wave"></div>
                    </div>
                    <h3>Estratégia & ROI</h3>
                    <p>Foco total no retorno sobre o investimento. Marketing sem vendas é apenas custo.</p>
                    <ul class="pillar-details">
                        <li>Análise de CAC vs LTV</li>
                        <li>Planejamento de Escala Previsível</li>
                        <li>Otimização de Mídia Paga (Ads)</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Section 04: O Protocolo (CTA/Agent) -->
    <section class="protocol" id="protocol">
        <div class="container">
            <?php echo do_shortcode('[bruno_chat]'); ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>