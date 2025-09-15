<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitación de Boda Alicia y Brandon</title>
    <!-- Google Fonts pour des styles similaires -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <style>
        /* Réinitialisation CSS & Styles généraux */
        body, h1, h2, p, span, div {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-font: 'Playfair Display', serif; /* Pour les noms et le grand chiffre de la date */
            --script-font: 'Great Vibes', cursive; /* Pour les textes manuscrits et le monogramme */
            --secondary-font: 'Montserrat', sans-serif; /* Pour le texte courant */
            --text-color: #333; /* Couleur de texte principale */
            --gold-color: #b8860b; /* Une couleur or générique, ajuster pour une correspondance exacte */
            --light-gold-decoration: #d4af37; /* Or plus clair pour les décorations */
        }

        body {
            font-family: var(--secondary-font);
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0; /* Fond doux pour simuler l'environnement du téléphone */
            color: var(--text-color);
        }

        .invitation-container {
            width: 100%;
            max-width: 375px; /* Simule la largeur d'un écran de téléphone */
            background-color: #fff; /* Le fond blanc principal sera géré par .content-section */
            box-shadow: 0 0 15px rgba(0,0,0,0.1);
            overflow: hidden; /* Cache les éléments qui dépassent */
            position: relative; /* Pour le positionnement absolu des décorations */
            text-align: center;
            min-height: 800px; /* Hauteur approximative basée sur l'image */
        }

        /* Section de l'image d'en-tête (couple) */
        .header-image {
        
        background-color : red;
        
            /* L'IMAGE DU COUPLE ICI - REMPLACEZ CETTE URL PAR LA VÔTRE POUR VOTRE INVITATION */
            /* J'ai mis une image d'exemple d'Unsplash pour visualiser la vague */
            background-image: url('https://images.unsplash.com/photo-1517457210348-b767004e0e7d?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
            background-size: cover;
            background-position: center 30%; /* Ajuster pour garder le couple visible */
            height: 300px; /* Hauteur fixe pour la zone de l'image */
            position: relative; /* Pour le positionnement absolu du texte et le z-index */
            z-index: 1; /* Assure qu'il est en dessous de la vague mais au-dessus du conteneur */
            display: flex; /* Pour centrer le contenu */
            flex-direction: column;
            justify-content: flex-end; /* Pousser le texte vers le bas */
            align-items: center;
            color: #fff;
            padding-bottom: 20px; /* Espace depuis le bas de l'image */
        }

        .monogram {
            font-family: var(--script-font);
            font-size: 8em; /* Grande taille pour le monogramme */
            color: var(--gold-color);
            position: absolute; /* Positionner au-dessus de l'image */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* Centrer */
            line-height: 0.8;
            opacity: 0.8; /* Légèrement transparent pour se fondre avec l'arrière-plan */
            z-index: 1; /* Derrière les noms */
            /* Pour un monogramme exact, une image SVG serait idéale */
        }

        .couple-names {
            font-family: var(--primary-font);
            font-size: 1.8em;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative; /* Au-dessus du monogramme */
            z-index: 2;
            padding-bottom: 10px; /* Espace depuis le bas de header-image */
            line-height: 1.2;
        }

        .couple-names span {
            font-family: var(--script-font);
            font-size: 0.8em; /* Plus petit pour 'y' */
            display: block;
            margin: -8px 0; /* Ajuster l'espacement vertical pour 'y' */
            text-transform: lowercase;
            font-style: italic;
        }

        /* Section de contenu blanche et la vague */
        .content-section {
            background-color: #fff;
            padding: 20px 25px;
            position: relative; /* Nécessaire pour positionner le pseudo-élément et les décorations */
            z-index: 3; /* Assure que le contenu est au-dessus de la vague et de l'image d'en-tête */
            padding-top: 30px; /* Ajouter plus de padding supérieur pour créer un espace visuel */
            margin-top: -30px; /* Remonte la section pour la faire chevaucher l'image d'en-tête */
        }

        /* La VAGUE/PAPIER DÉCHIRÉ */
        .content-section::before {
            content: '';
            position: absolute;
            top: -50px; /* Ajuster cette valeur pour contrôler le chevauchement avec header-image */
            left: 0;
            right: 0;
            height: 70px; /* Hauteur de l'image de la vague */
            /* SVG encodé en base64 pour une vague lisse. Pour un effet "déchiré", le chemin SVG serait plus complexe. */
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 100' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C200,80 400,0 600,40 S800,80 1000,40 V100 H0 Z' fill='%23ffffff'%3E%3C/path%3E%3C/svg%3E");
            background-size: 100% 100%; /* S'adapte à la largeur et hauteur du pseudo-élément */
            background-repeat: no-repeat;
            z-index: 2; /* Entre l'image d'en-tête (1) et le contenu (3) */
            pointer-events: none; /* Permet aux clics de passer à travers si nécessaire */
            /* Pour un effet de papier déchiré plus réaliste, remplacez le background-image
             * par l'URL d'un SVG ou PNG transparent avec un bord déchiqueté blanc.
             * Ex: background-image: url('path/to/torn-paper-white.svg');
             */
        }

        .blessing, .parents {
            margin-bottom: 20px;
        }

        .blessing p {
            font-family: var(--script-font);
            font-size: 1.5em;
            line-height: 1.5;
            margin-bottom: 15px;
            color: #555; /* Couleur légèrement plus douce pour le texte script */
        }

        .parents div {
            display: flex;
            justify-content: space-around;
            text-align: left;
            flex-wrap: wrap; /* Permettre le retour à la ligne sur les petits écrans */
        }

        .parents div > div {
            flex-basis: 45%; /* Distribuer l'espace équitablement */
            min-width: 150px; /* Empêcher un rétrécissement excessif */
            margin-bottom: 15px;
        }

        .parents p {
            margin: 3px 0;
            font-size: 0.9em;
            line-height: 1.4;
            color: #555;
        }

        h2.we-marry {
            font-family: var(--script-font);
            font-size: 2.5em;
            margin-top: 30px;
            margin-bottom: 10px;
            color: var(--text-color);
        }

        .invite-message {
            font-size: 1em;
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .date-section {
            display: flex;
            justify-content: center;
            align-items: baseline; /* Aligner le bas des éléments */
            gap: 10px;
            margin-bottom: 40px;
            border-bottom: 1px solid #eee; /* Ligne de séparation légère */
            padding-bottom: 20px;
        }

        .date-section .day-text {
            border-bottom: 1px solid var(--text-color);
            padding-bottom: 5px;
            font-size: 1.1em;
            letter-spacing: 1px;
            font-weight: 700;
        }

        .date-section .day-number {
            font-family: var(--primary-font);
            font-size: 5em; /* Grand chiffre */
            font-weight: 700;
            line-height: 1;
            margin: -10px 0; /* Ajuster la position verticale */
        }

        .date-section .month-year {
            display: flex;
            flex-direction: column;
            text-align: left;
        }

        .date-section .month {
            border-bottom: 1px solid var(--text-color);
            padding-bottom: 5px;
            font-size: 1.1em;
            letter-spacing: 1px;
            margin-bottom: 5px;
            font-weight: 700;
        }

        .date-section .year {
            font-size: 1.1em;
            font-weight: 700;
        }

        .church-info {
            margin-top: 30px;
            margin-bottom: 40px;
        }

        .church-icon {
            font-size: 3em; /* Grande icône */
            color: var(--gold-color);
            margin-bottom: 15px;
            line-height: 1;
            display: inline-block; /* Assurer l'alignement vertical */
        }

        .church-name {
            font-family: var(--script-font);
            font-size: 1.9em;
            margin-bottom: 10px;
            line-height: 1.3;
        }

        .church-address {
            font-size: 0.9em;
            line-height: 1.6;
            color: #555;
        }

        .location-button {
            background-color: var(--gold-color);
            color: #fff;
            padding: 12px 40px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 700;
            display: inline-block;
            margin-top: 20px;
            margin-bottom: 10px;
            font-family: var(--secondary-font);
            font-size: 0.9em;
            letter-spacing: 1px;
            transition: background-color 0.3s ease;
        }

        .location-button:hover {
            background-color: #a07a0b;
        }

        .page-indicator {
            font-size: 0.8em;
            color: #777;
            margin-bottom: 30px;
        }

        .hearts-icon {
            font-size: 2em; /* Taille pour les cœurs */
            color: var(--gold-color);
            margin-bottom: 20px;
            line-height: 1;
        }

        /* Décorations de feuilles dorées (ce seraient idéalement des PNG transparents) */
        .decoration-left, .decoration-right {
            position: absolute;
            width: 80px; /* Ajuster la taille */
            height: 120px; /* Ajuster la taille */
            background-repeat: no-repeat;
            background-size: contain;
            pointer-events: none; /* Permet les clics à travers */
            z-index: 0; /* Derrière le contenu */
            /* URL de placeholder, remplacer par les images réelles des feuilles */
            background-image: url('https://via.placeholder.com/80x120/d4af37/ffffff?text=Leaf');
        }

        .decoration-left {
            bottom: 0px;
            left: -30px; /* Ajuster la position */
            transform: rotate(180deg); /* Si l'image est orientée différemment */
        }

        .decoration-right {
            top: 40%; /* Ajuster la position */
            right: -30px; /* Ajuster la position */
        }

        /* Ajustements responsifs */
        @media (max-width: 400px) {
            .invitation-container {
                max-width: 100%; /* Pleine largeur sur les petits appareils */
            }
            .monogram {
                font-size: 7em;
            }
            .couple-names {
                font-size: 1.6em;
            }
            .blessing p {
                font-size: 1.3em;
            }
            h2.we-marry {
                font-size: 2.2em;
            }
            .date-section .day-number {
                font-size: 4em;
            }
            .church-name {
                font-size: 1.7em;
            }
            .parents div {
                flex-direction: column;
                align-items: center;
            }
            .parents div > div {
                flex-basis: 100%;
                margin-bottom: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="invitation-container">
        <!-- Section supérieure avec l'image du couple et leurs noms -->
        <div class="header-image">
            <div class="monogram">AB</div>
            <h1 class="couple-names">ALICIA <br><span>y</span><br> BRANDON</h1>
        </div>

        <!-- Le contenu principal commence ici, avec un fond blanc -->
        <div class="content-section">
            <!-- Bénédiction et noms des parents -->
            <section class="blessing">
                <p>Con la bendición de Dios <br>y de nuestros padres</p>
                <div class="parents">
                    <div>
                        <p>Alicia Chávez Ruiz</p>
                        <p>Nazario Escobedo Berrones</p>
                    </div>
                    <div>
                        <p>Blanca Esthela Hernández Alvarado</p>
                        <p>Eusebio Rodríguez Martínez</p>
                    </div>
                </div>
            </section>

            <!-- Annonce de mariage -->
            <section class="wedding-announcement">
                <h2 class="we-marry">¡Nos Casamos!</h2>
                <p class="invite-message">Los esperamos <br>para celebrar juntos el día</p>

                <!-- Date du mariage -->
                <div class="date-section">
                    <span class="day-text">SÁBADO</span>
                    <span class="day-number">18</span>
                    <div class="month-year">
                        <span class="month">MAYO</span>
                        <span class="year">2024</span>
                    </div>
                </div>
            </section>

            <!-- Informations sur l'église -->
            <section class="church-info">
                <div class="church-icon">⛪</div> <!-- Icône d'église Unicode -->
                <p class="church-name">Parr. del Sagrado Corazón de Jesús</p>
                <p class="church-address">5 de Mayo, Centro, 64000 Monterrey, N.L., <br>6:00 pm</p>
            </section>

            <!-- Bouton de localisation et indicateur de page -->
            <a href="#" class="location-button">UBICACIÓN</a>
            <p class="page-indicator">1 de 1</p>

            <!-- Icône de cœurs -->
            <div class="hearts-icon">❤❤</div> <!-- Deux icônes de cœur Unicode -->
        </div>

        <!-- Décorations de feuilles dorées (positionnées par rapport à .invitation-container) -->
        <div class="decoration-left"></div>
        <div class="decoration-right"></div>
    </div>
</body>
</html>