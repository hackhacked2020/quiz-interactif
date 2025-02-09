const quizdata = []; // Initialisation de l'array pour les données
let userAnswers = []; // Stocke les réponses données par l'utilisateur

const questionsWithImages = []; // Tableau pour suivre les indices des questions avec des images

async function loadQuizData() {
  try {
    const response = await fetch('quizdata_deb_sp_bke_2024.json');
    const data = await response.json();
    
    data.forEach((item, index) => {
      quizdata.push({
        question: item.question,
        a: item.a,
        b: item.b,
        c: item.c,
        d: item.d,
        e: item.e,
        f: item.f,
        correct: item.correct
      });

      // Si la question contient une image, ajoutez l'index à questionsWithImages
      if (item.question.includes('<img')) {
        questionsWithImages.push(index);
      }
    });
    
    console.log(quizdata);
    loadQuiz(); // Charger la première question du quiz
  } catch (error) {
    console.error('Erreur lors du chargement des données du quiz:', error);
  }
}

// Appeler la fonction pour charger les données lors du démarrage de la page
window.onload = loadQuizData;

const charArray = ["a", "b", "c", "d", "e", "f"];
const showImageBtn = document.getElementById("show-image-btn");
function loadQuiz() {
  const currQuizData = quizdata[currentQuiz];
  questionEl.innerHTML = currQuizData.question;

  // Réinitialiser toutes les options visibles ou non
  alllist.forEach((list, index) => {
    const optionKey = charArray[index];
    const optionText = currQuizData[optionKey];
    
    if (optionText) {
      list.style.display = "block"; // Rendre l'option visible
      list.querySelector("label").innerHTML = optionText; // Ajouter le texte
      list.querySelector("input").checked = false; // Décocher
      list.style.background = "rgb(235, 240, 241)"; // Réinitialiser le style
    } else {
      list.style.display = "none"; // Masquer l'option si elle n'existe pas
    }
  });
  ////////////////////////
  const lastQuestionWithImageIndex = questionsWithImages.filter((index) => index < currentQuiz).pop();

  if (lastQuestionWithImageIndex !== undefined) {
    const lastQuestionData = quizdata[lastQuestionWithImageIndex];
    const imgTag = lastQuestionData.question.match(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/);
    if (imgTag && imgTag[1]) {
      showImageBtn.style.display = "block"; // Afficher le bouton
      return;
    }
  }
  ///////////////////////
}

const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const next_btn = document.getElementsByClassName("next-btn");
const submit_btn = document.getElementsByClassName("submit-btn");
const counter = document.getElementsByClassName("counter");
const timer = document.getElementsByClassName("timer");
const timelevel = document.querySelector(".time-bar");
const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");
const list3 = document.getElementById("list3");
const list4 = document.getElementById("list4");
const alllist = document.querySelectorAll(".listclass");
const quizbox = document.querySelector(".quix-box");
const scorebox = document.querySelector(".wrapper");
const performance = document.querySelector(".performance");
const startquizbtn = document.querySelector(".start-button");
const instructios = document.querySelector(".instructions");
const quizpage = document.querySelector(".quiz-box");
const resultpage = document.querySelector(".result-box");

// audio section
const audio_corr = document.getElementById("audio_corr");
const audio_wron = document.getElementById("audio_wron");
const audio_appl = document.getElementById("audio_appl");

let getresult = false;
let currentQuiz = 0;
let duration;
let max_time = 120;
let correctAnswer = [false, false, false, false, false];

//about verdict icon declaration
var icon = document.createElement("span");
icon.classList.add("verdict_icons");
icon.setAttribute("class", "verdict_icons");

//  load quiz function starts

//next button function starts

next_btn[0].addEventListener("click", () => {
  if (getresult == false) {
    flag = false;
    icon.innerHTML = "";
    submit_btn[0].style.background = "grey";
      submit_btn[0].disabled = true;
    submit_btn[0].innerHTML = "Valider";
    alllist.forEach((list) => {
      list.style.background = "rgb(235, 240, 241)";
      list.firstElementChild.checked = false;
      
    });

    timelevel.style.setProperty("--level", 100 + "%");
    timelevel.style.transition = "none";

    if (currentQuiz < quizdata.length - 1) {
      currentQuiz++;
      counter[0].querySelector("span").innerHTML = currentQuiz + 1;
      clearInterval(duration);
      loadQuiz();
      startTimer(max_time);
    }
  } else {
    quizpage.style.display = "none";
    resultpage.style.display = "block";

    let score = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
      if (correctAnswer[i] === true) score++;
    }

    // Résumé des résultats
    const resultSummary = document.getElementById("result-summary"); // Ajoutez un élément HTML avec cet ID dans votre page
    resultSummary.innerHTML = ""; // Réinitialiser le contenu
    //////////////
    // Calcul de la note sur 20
const noteSur20 = (score * 20) / quizdata.length;
    /////////////
    let resultContent = "";

// Afficher le score et la performance dans une section distincte
resultContent += `
  <div class="score-section">
    <center>
      <h3>Score: 
        <span style="background-color: ${
          score >= quizdata.length / 2 ? "green" : "red"
        }; color: white; padding: 5px; border-radius: 3px;">
          ${score} / ${quizdata.length}
        </span>
      </h3> 
      <br> 
      <h5>Soit (${score} x 20 / ${quizdata.length}) = </h5>
      <br> 
      <h3>
        <span style="background-color: ${
          (score * 20) / quizdata.length >= 10 ? "green" : "red"
        }; color: white; padding: 5px; border-radius: 3px;">
          ${((score * 20) / quizdata.length).toFixed(2)} / 20
        </span>
      </h3>
    </center>
    <p class="performance-text">
      ${
        score >= quizdata.length / 2
          ? "Excellent 🤩"
          : score === Math.floor(quizdata.length / 3)
          ? "Bon 😀"
          : score === Math.floor(quizdata.length / 4)
          ? "Moyen 🙂"
          : "Insuffisant 🙁"
      }
    </p>
  </div>
`;
         
         resultSummary.innerHTML += resultContent;
///////////////
    quizdata.forEach((quiz, index) => {
  const isCorrect = correctAnswer[index]; // Vérifie si la réponse est correcte
  const emoji = isCorrect ? "✅" : "❌"; // Emoji basé sur la réponse

  const questionSummary = `
    <div>
      <h4>Question ${index + 1}: ${emoji}</h4>
      <p>${quiz.question}</p>
      <p><strong>Vos réponses :</strong> ${
        userAnswers[index]?.length
          ? userAnswers[index].map((answer) => quiz[answer]).join(", ")
          : "Aucune réponse"
      }</p>
      <p><strong>Bonnes réponses :</strong> ${quiz.correct
        .map((answer) => quiz[answer])
        .join(", ")}</p>
    </div>
    <hr>
  `;

  resultSummary.innerHTML += questionSummary;
});

    // Calcul du score final
 /*   scorebox.firstElementChild.innerHTML = score;
    if (score >= 3) {
      audio_appl.play();
    }
    performance.firstElementChild.innerHTML =
      score >= 4
        ? "Excellent 🤩"
        : score === 3
        ? "Bon 😀"
        : score === 2
        ? "Moyen 🙂"
        : "Insuffisant 🙁";*/
        
  }
});
// digital timer function starts

var timelimit = 120;
function startTimer(currTime) {
  duration = setInterval(setClock, 1000);
  const tickSound = document.getElementById("tick-sound"); // Chargez l'élément audio
  
  function setClock() {
    if (currTime <= 10 && currTime > 0) {
    submit_btn[0].style.background = "red";
      submit_btn[0].innerHTML = currTime; // Afficher le temps restant dans le bouton "submit"
      
      tickSound.currentTime = 0; // Réinitialisez le son au début
      tickSound.play().catch((err) => console.log("Erreur lors de la lecture du son :", err)); // Jouer le son
    }
    
    if (currTime < 10) {
      currTime = "0" + currTime; // Ajoute un zéro devant les chiffres inférieurs à 10
    }

    if (currTime >= 0) {
      timer[0].innerHTML = currTime; // Affiche le temps sur l'écran
      setLevel(timelevel, currTime);
      currTime--;
      timelimit = currTime;
      
      if (timelimit == -1) {
        audio_wron.play();
        submit_btn[0].style.background = "red";
        submit_btn[0].style.width = "100px";
        submit_btn[0].innerHTML = "😭 👉🏽"; // Temps écoulé, afficher un message d'erreur
        submit_btn[0].disabled = true;

        alllist[
          quizdata[currentQuiz].correct.charCodeAt(0) - "a".charCodeAt(0)
        ].style.background = "#9deea8";
      }
    }
    
    if (currentQuiz == quizdata.length - 1) {
      next_btn[0].style.background = "#f709a888";
      next_btn[0].style.border = "#f709a8d5";
      next_btn[0].innerHTML = "Résultat";
      next_btn[0].disabled = true;
      getresult = true;
      next_btn[0].style.background = "#f709a8d5";
      next_btn[0].disabled = false;
    }
  }
}
//function to set time bar

function setLevel(element, value) {
  element.style.setProperty("--level", (value * 100) / 120 + "%");
  element.style.transition = "width 1s linear";
}
// function to track which option is clicked by thr user

function getselected() {
  const selectedAnswers = []; // Contient les réponses sélectionnées par l'utilisateur
  const correctAnswers = quizdata[currentQuiz].correct; // Contient les réponses correctes pour la question actuelle

  alllist.forEach((list, index) => {
    if (list.firstElementChild.checked) {
      selectedAnswers.push(charArray[index]); // Ajouter la lettre de l'option sélectionnée (a, b, c, d)
    }
  });

  userAnswers[currentQuiz] = selectedAnswers; // Enregistrer les réponses de l'utilisateur

  // Vérifier si les réponses sélectionnées sont correctes
  const isCorrect =
    selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every((answer) => correctAnswers.includes(answer));

  if (isCorrect) {
    correctAnswer[currentQuiz] = true;
    selectedAnswers.forEach((answer) => {
      alllist[answer.charCodeAt(0) - "a".charCodeAt(0)].style.background =
        "#9deea8"; // Marquer les réponses correctes en vert
    });
    audio_corr.play();
  } else {
    correctAnswers.forEach((answer) => {
      alllist[answer.charCodeAt(0) - "a".charCodeAt(0)].style.background =
        "#9deea8"; // Afficher les bonnes réponses en vert
    });
    audio_wron.play();
  }
}

// submit button function starts

var flag = false;
submit_btn[0].addEventListener("click", () => {
  clearInterval(duration);
  flag = true;
  submit_btn[0].style.background = "green";
  submit_btn[0].disabled = false;
  getselected();
});

// function to make whole question container behave like label or clickable declared in inline html tags as onclickx

function toggleCheckbox(listId) {
  const list = document.getElementById(listId);

  if (flag === false && timelimit > 0) {
    // Basculer l'état de la checkbox et ajuster le style
    const checkbox = list.querySelector("input[type='checkbox']");
    if (checkbox.checked) {
      checkbox.checked = false; // Décoche la case
      list.style.background = "rgb(235, 240, 241)"; // Réinitialise le style
    } else {
      checkbox.checked = true; // Coche la case
      list.style.background = "rgb(126, 221, 240)"; // Change le style
    }

    // Activer ou désactiver le bouton "Submit" en fonction des cases cochées
    const anyChecked = document.querySelectorAll(".listclass input[type='checkbox']:checked").length > 0;

    if (anyChecked) {
      submit_btn[0].style.background = "green";
      submit_btn[0].disabled = false;
    } else {
      submit_btn[0].style.background = "grey";
      submit_btn[0].disabled = true;
    }
  }
}

// Fonctions spécifiques pour chaque liste
function selectList1() {
  toggleCheckbox("list1");
}

function selectList2() {
  toggleCheckbox("list2");
}

function selectList3() {
  toggleCheckbox("list3");
}

function selectList4() {
  toggleCheckbox("list4");
}

function selectList5() {
  toggleCheckbox("list5");
}

function selectList6() {
  toggleCheckbox("list6");
}

function clickhome() {
  resultpage.style.display = "none";
  startquizbtn.style.display = "block";
  instructios.style.display = "none";
  location.reload();
}
function startquiz() {
  startquizbtn.style.display = "none";
  instructios.style.display = "block";
  quizpage.style.display = "none";
  submit_btn[0].style.background = "grey";
      submit_btn[0].disabled = true;
      counter[0].querySelectorAll("span")[2].innerHTML = quizdata.length;
}
function quitbtn() {
  instructios.style.display = "none";
  startquizbtn.style.display = "block";
}
function continuebtn() {
  loadQuiz(); //calling load quiz funtion
  startTimer(max_time); // starting the timer
  quizpage.style.display = "block";
  instructios.style.display = "none";
}

function showImage() {
  // Trouver la dernière question avec une image avant la question actuelle
  const lastQuestionWithImageIndex = questionsWithImages.filter((index) => index < currentQuiz).pop();

  if (lastQuestionWithImageIndex !== undefined) {
    const lastQuestionData = quizdata[lastQuestionWithImageIndex];
    const imgTag = lastQuestionData.question.match(/<img[^>]+src=['"]([^'"]+)['"][^>]*>/);
    if (imgTag && imgTag[1]) {
      modalImage.src = imgTag[1]; // Afficher l'image dans le modal
      modal.style.display = "block"; // Afficher le modal
    }
  }
}

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".close");

closeModal.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Par exemple, si vous avez un bouton pour voir l'image
document.getElementById("show-image-btn").addEventListener("click", showImage);
