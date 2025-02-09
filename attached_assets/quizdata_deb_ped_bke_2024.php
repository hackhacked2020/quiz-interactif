<?php
session_start();

// Vérification si la session est active
if (!isset($_SESSION['sessionToken'])) {
    // Rediriger vers la page d'accueil ou de connexion
    header('Location: ../index.php');
    exit;
}

// Votre code pour les utilisateurs authentifiés
//echo "Bienvenue, vous êtes connecté.";
echo "🏆";
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>INFAS WEBSITE TOGETHER</title>
      <style>
    body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: white; 
  /*background-image: url('logo.jpg'); 
  background-color: transparent; 
  background-color: rgb(31, 18, 88);
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; */
}




.search-bar {
  display: block;
  margin: 20px auto;
  width: 90%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  outline: none;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.search-bar:focus {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border-color: #6495ed;
}



    /* Drawer */
    .drawer {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      z-index: 1000;
    }

    .drawer:hover {
      background-color: #555;
      transform: translateX(-50%) scale(1.1);
    }
  
      /* Style du menu latéral */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 5cm; /* Largeur de 5 cm */
      height: 100%;
      background-color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      z-index: 1000;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      transform: translateX(-100%); /* Cacher le menu initialement */
      transition: transform 0.3s ease;
    }

    .sidebar.show {
      transform: translateX(0); /* Afficher le menu latéral */
    }

    /* Style des icônes */
    .icon {
      width: 5cm; /* Taille de l'icône */
      height: 5cm;
      background-color: #444;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 0;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .icon:hover {
      background-color: #555;
    }

    .icon i {
      font-size: 2.5cm; /* Taille de l'icône dans chaque bouton */
    }

    /* Style pour le bouton du menu */
    .menu-button {
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: #333;
      color: white;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 1001;
    }

    .menu-button:hover {
      background-color: #555;
    }
/* Style pour l'overlay */
/* Overlay pour empêcher les interactions avec l'arrière-plan */
.overlay {
  display: none; /* Caché par défaut */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
  z-index: 999; /* Niveau au-dessus du contenu */
}

/* Empêcher le défilement lorsqu'un drawer est ouvert */
.body-disabled {
  overflow: hidden;
}
  </style><link rel="stylesheet" href="../../../../styles.css" />
  </head>

  <body>
    <!-- quote -->
    <div class="intro">
      <!--<p>Quizzer</p>-->
      <p><button onclick="window.location.href='../../../index.php';"><h1>RETOUR</h1></button></p>
    </div>
    <!-- start quiz button  -->
    <div class="start-button">
      <button onclick="startquiz()">COMMENCER</button>
    </div>
    <!-- instruction for quiz -->

    <div class="instructions">
      <h2>Instructions</h2>
      <p>1. Vous aurez <span>2 minutes (120 secondes)</span> pour chaque question.</p>
<p>2. Vous ne pouvez pas choisir d'options une fois le temps écoulé.</p>
<p>3. N'oubliez pas de cliquer sur le bouton <b>VALIDER</b> après avoir choisi votre option.</p>
<p>4. Une fois validé, vous ne pouvez pas modifier votre sélection.</p>
<p>5. Vous ne pouvez pas voir la question précédente.</p>
<p>6. Il y a un point pour chaque bonne réponse.</p>
      <div class="button">
        <button class="quit" onclick="quitbtn()">Quitter</button>
        <button class="continue" onclick="continuebtn()">Continuer</button>
      </div>
    </div>

    <div class="quiz-box">
      <header>
        <div class="counter">
          <span>1</span>
          <span>/</span>
          <span>48</span>
          <span>questions</span>
        </div>
        <div class="timer-box">
          <span>TPS :</span>
          <span class="timer">120</span>
        </div>
        <div class="time-bar">
          <!-- <p>This is time bar</p> -->
        </div>
      </header>
      <section>
        <div class="scroll">
        <h2 id="question">Question Text</h2>
        <ul>
          <li class="listclass" id="list1" onclick="selectList1()">
            <input type="checkbox" id="a" name="answer" class="answer" />
            <label id="a_text" for="a">Option 1 </label>
          </li>

          <li class="listclass" id="list2" onclick="selectList2()">
            <input type="checkbox" id="b" name="answer" class="answer" />
            <label id="b_text" for="b">Option 2</label>
          </li>

          <li class="listclass" id="list3" onclick="selectList3()">
            <input type="checkbox" id="c" name="answer" class="answer" />
            <label id="c_text" for="c">Option 3</label>
          </li>

          <li class="listclass" id="list4" onclick="selectList4()">
            <input type="checkbox" id="d" name="answer" class="answer" />
            <label id="d_text" for="d">Option 4</label>
          </li>
          
          <li class="listclass" id="list5" onclick="selectList5()">
            <input type="checkbox" id="e" name="answer" class="answer" />
            <label id="e_text" for="e">Option 5</label>
          </li>

          <li class="listclass" id="list6" onclick="selectList6()">
            <input type="checkbox" id="f" name="answer" class="answer" />
            <label id="f_text" for="f">Option 6</label>
          </li>
        </ul>
        </div>
      </section>


  <script>
    
    // Fonction pour afficher/cacher le menu latéral
    function toggleDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  if (sidebar.classList.contains('show')) {
    // Fermer le drawer
    sidebar.classList.remove('show');
    overlay.style.display = 'none';
    body.classList.remove('body-disabled');
  } else {
    // Ouvrir le drawer
    sidebar.classList.add('show');
    overlay.style.display = 'block';
    body.classList.add('body-disabled');
  }
}

function closeDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  // Fermer le drawer
  sidebar.classList.remove('show');
  overlay.style.display = 'none';
  body.classList.remove('body-disabled');
}

    // Fonction pour rediriger vers une autre page
    function navigateTo(url) {
      window.location.href = url; // Redirige vers l'URL de l'icône cliquée
    }



  </script>      
      <!-- Modal pour afficher l'image -->
<div id="imageModal" class="modal">
  <span class="close">&times;</span>
  <img id="modalImage" class="modal-content" />
</div>

<!-- Bouton pour afficher l'image -->
<button id="show-image-btn">Voir les données liées à cette question.</button>

  <footer>
  <button class="submit-btn">Valider</button>
  <button class="next-btn">Suivant</button>
</footer>
    </div>


<div class="result-box">
      <div id="result-summary"></div>
      <button class="homebtn" onclick="clickhome()">RETOUR</button>
    </div>
    
    <audio
      src="./correctaudio.mp3"
      preload="auto"
      type="audio/mpeg"
      id="audio_corr"
    ></audio>
    <audio
      preload="auto"
      src="./wrongaudio.mp3"
      type="audio/mpeg"
      id="audio_wron"
    ></audio>
    <audio src="./applauseaudio.mp3" type="audio/mpeg" id="audio_appl"></audio>
    <audio id="tick-sound" src="./tick.mp3"></audio>
      <!-- Conteneur pour la ListView Accordion -->
  <div id="accordion" class="listview"></div>
<!-- Overlay -->
<div id="overlay" class="overlay" onclick="closeDrawer()"></div>
<div id="sidebar" class="sidebar">
  <div class="icon" onclick="navigateTo('https://www.google.com')">
    <i>💊</i>
  </div>
  <div class="icon" onclick="navigateTo('https://www.wikipedia.org')">
    <i>🧠</i>
  </div>
  <div class="icon" onclick="navigateTo('https://www.github.com')">
    <i>👨‍⚕️</i>
  </div>
</div>
<div class="drawer" onclick="toggleDrawer()">☰</div>


  <script>
    
    // Fonction pour afficher/cacher le menu latéral
    function toggleDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  if (sidebar.classList.contains('show')) {
    // Fermer le drawer
    sidebar.classList.remove('show');
    overlay.style.display = 'none';
    body.classList.remove('body-disabled');
  } else {
    // Ouvrir le drawer
    sidebar.classList.add('show');
    overlay.style.display = 'block';
    body.classList.add('body-disabled');
  }
}

function closeDrawer() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const body = document.body;

  // Fermer le drawer
  sidebar.classList.remove('show');
  overlay.style.display = 'none';
  body.classList.remove('body-disabled');
}

    // Fonction pour rediriger vers une autre page
    function navigateTo(url) {
      window.location.href = url; // Redirige vers l'URL de l'icône cliquée
    }



  </script><script src="quizdata_deb_ped_bke_2024.js"></script>
  </body>
</html>