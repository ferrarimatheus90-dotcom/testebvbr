<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Bruno Viana - Especialista em Vendas & IA. Consultoria estratégica para escala real através de Inteligência Digital.">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@700&display=swap"
        rel="stylesheet">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
    <header class="header">
        <div class="container header-content">
            <a href="<?php echo home_url(); ?>" class="logo">

                <span>BRUNO VIANA</span>
            </a>
            <nav class="nav-menu">
                <a href="#sobre">Sobre</a>
                <a href="#metodologia">Metodologia</a>
                <a href="#protocol" class="btn-nav">Agendar</a>
            </nav>
        </div>
    </header>