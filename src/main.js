import "./style.css";
import { Questions } from "./questions.js";


// ==========================================
// RECUPERATION DES ELEMENTS
// ==========================================

const app = document.querySelector("#app");
const startButton = document.querySelector("#start");


// Temps avant de passer automatiquement
// à la question suivante
const TIMEOUT = 5000;


// ==========================================
// MELANGER UN TABLEAU
// ==========================================

function shuffleArray(array) {

  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {

    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[randomIndex]
    ] = [
      shuffled[randomIndex],
      shuffled[i]
    ];
  }

  return shuffled;
}


// ==========================================
// RECUPERER 5 QUESTIONS ALEATOIRES
// ==========================================

function getRandomQuestions(questions, number) {

  const shuffledQuestions = shuffleArray(questions);

  return shuffledQuestions.slice(0, number);
}


// ==========================================
// BOUTON START
// ==========================================

startButton.addEventListener("click", startQuiz);


// ==========================================
// DEMARRER LE QUIZ
// ==========================================

function startQuiz() {

  // On prend seulement 5 questions
  // parmi toutes les questions
  const quizQuestions = getRandomQuestions(
    Questions,
    5
  );

  let currentQuestion = 0;

  let score = 0;

  displayQuestion(currentQuestion);


  // ==========================================
  // NETTOYER L'ECRAN
  // ==========================================

  function clean() {

    app.innerHTML = "";

  }


  // ==========================================
  // BARRE DE PROGRESSION
  // ==========================================

  function getProgressBar(max, value) {

    const progress = document.createElement("progress");

    progress.max = max;

    progress.value = value;

    return progress;
  }


  // ==========================================
  // AFFICHER UNE QUESTION
  // ==========================================

  function displayQuestion(index) {

    clean();


    // Récupérer la question actuelle
    const question = quizQuestions[index];


    // Si toutes les questions sont terminées
    if (!question) {

      displayFinishMessage();

      return;
    }


    // ========================================
    // BARRE DE PROGRESSION
    // ========================================

    const progress = getProgressBar(
      quizQuestions.length,
      index
    );

    app.appendChild(progress);


    // ========================================
    // NUMERO DE LA QUESTION
    // ========================================

    const questionNumber =
      document.createElement("p");

    questionNumber.classList.add(
      "question-number"
    );

    questionNumber.innerText =
      `Question ${index + 1}/${quizQuestions.length}`;

    app.appendChild(questionNumber);


    // ========================================
    // QUESTION
    // ========================================

    const title =
      getTitleElement(question.question);

    app.appendChild(title);


    // ========================================
    // MELANGER LES REPONSES
    // ========================================

    const shuffledAnswers =
      shuffleArray(question.answers);


    const answersDiv =
      createAnswers(shuffledAnswers);

    app.appendChild(answersDiv);


    // ========================================
    // BOUTON VALIDER
    // ========================================

    const submitButton =
      getSubmitButton();

    submitButton.addEventListener(
      "click",
      submit
    );

    app.appendChild(submitButton);
  }


  // ==========================================
  // VALIDER LA REPONSE
  // ==========================================

  function submit() {

    const selectedAnswer =
      app.querySelector(
        'input[name="answer"]:checked'
      );


    // Aucune réponse choisie
    if (!selectedAnswer) {

      alert(
        "Veuillez sélectionner une réponse !"
      );

      return;
    }


    // Désactiver les réponses
    disableAllAnswers();


    // Récupérer la réponse choisie
    const value =
      selectedAnswer.value;


    // Récupérer la question actuelle
    const question =
      quizQuestions[currentQuestion];


    // Vérifier la réponse
    const isCorrect =
      question.correct === value;


    // Ajouter un point
    if (isCorrect) {

      score++;

    }


    // Afficher les couleurs
    showFeedback(
      isCorrect,
      question.correct,
      value
    );


    // Afficher le message
    const feedback =
      getFeedBackMessage(
        isCorrect,
        question.correct
      );

    app.appendChild(feedback);


    // Afficher le bouton suivant
    displayNextQuestionButton();
  }


  // ==========================================
  // DESACTIVER LES REPONSES
  // ==========================================

  function disableAllAnswers() {

    const answers =
      app.querySelectorAll(
        'input[name="answer"]'
      );


    answers.forEach((answer) => {

      answer.disabled = true;

    });
  }


  // ==========================================
  // BOUTON QUESTION SUIVANTE
  // ==========================================

  function displayNextQuestionButton() {

    let remainingTimeout = TIMEOUT;


    // Supprimer le bouton Valider
    const submitButton =
      app.querySelector("button");


    if (submitButton) {

      submitButton.remove();

    }


    // ========================================
    // CREER LE BOUTON SUIVANT
    // ========================================

    const nextButton =
      document.createElement("button");


    nextButton.innerText =
      `Suivant (${remainingTimeout / 1000}s)`;


    app.appendChild(nextButton);


    // ========================================
    // COMPTE A REBOURS
    // ========================================

    const interval = setInterval(() => {

      remainingTimeout -= 1000;


      if (remainingTimeout > 0) {

        nextButton.innerText =
          `Suivant (${remainingTimeout / 1000}s)`;

      }

    }, 1000);


    // ========================================
    // PASSER A LA QUESTION SUIVANTE
    // ========================================

    function handleNextQuestion() {

      clearInterval(interval);

      clearTimeout(timeout);

      currentQuestion++;

      displayQuestion(currentQuestion);
    }


    // ========================================
    // PASSAGE AUTOMATIQUE
    // ========================================

    const timeout = setTimeout(() => {

      handleNextQuestion();

    }, TIMEOUT);


    // ========================================
    // PASSAGE MANUEL
    // ========================================

    nextButton.addEventListener(
      "click",
      handleNextQuestion
    );
  }


  // ==========================================
  // CREER LES REPONSES
  // ==========================================

  function createAnswers(answers) {

    const answersDiv =
      document.createElement("div");


    answersDiv.classList.add("answers");


    for (const answer of answers) {

      const label =
        getAnswerElement(answer);


      answersDiv.appendChild(label);
    }


    return answersDiv;
  }


  // ==========================================
  // FIN DU QUIZ
  // ==========================================

  function displayFinishMessage() {

    clean();


    const h1 =
      document.createElement("h1");


    h1.innerText =
      "🎉 Bravo !";


    const p =
      document.createElement("p");


    p.innerText =
      `Tu as obtenu ${score} sur ${quizQuestions.length} !`;


    app.appendChild(h1);

    app.appendChild(p);


    // ========================================
    // BOUTON RECOMMENCER
    // ========================================

    const restartButton =
      document.createElement("button");


    restartButton.innerText =
      "Recommencer";


    restartButton.addEventListener(
      "click",
      startQuiz
    );


    app.appendChild(restartButton);
  }
}


// ==========================================
// CREER LE TITRE
// ==========================================

function getTitleElement(text) {

  const title =
    document.createElement("h3");


  title.innerText = text;


  return title;
}


// ==========================================
// CREER UN ID
// ==========================================

function formatId(text) {

  return text
    .replaceAll(" ", "-")
    .replaceAll('"', "")
    .replaceAll("'", "")
    .toLowerCase();
}


// ==========================================
// CREER UNE REPONSE
// ==========================================

function getAnswerElement(text) {

  const label =
    document.createElement("label");


  const input =
    document.createElement("input");


  const id =
    formatId(text);


  input.id = id;

  input.type = "radio";

  input.name = "answer";

  input.value = text;


  label.htmlFor = id;


  // Le bouton radio
  label.appendChild(input);


  // Le texte de la réponse
  label.append(text);


  return label;
}


// ==========================================
// BOUTON VALIDER
// ==========================================

function getSubmitButton() {

  const submitButton =
    document.createElement("button");


  submitButton.innerText =
    "Valider";


  return submitButton;
}


// ==========================================
// AFFICHER LES RESULTATS
// ==========================================

function showFeedback(
  isCorrect,
  correct,
  answer
) {

  const inputs =
    app.querySelectorAll(
      'input[name="answer"]'
    );


  inputs.forEach((input) => {

    const label =
      input.closest("label");


    // Toujours afficher la bonne réponse
    if (input.value === correct) {

      label.classList.add(
        "correct"
      );
    }


    // Afficher la mauvaise réponse
    // seulement si elle a été choisie
    if (
      !isCorrect &&
      input.value === answer
    ) {

      label.classList.add(
        "incorrect"
      );
    }

  });
}


// ==========================================
// MESSAGE DE FEEDBACK
// ==========================================

function getFeedBackMessage(
  isCorrect,
  correct
) {

  const paragraph =
    document.createElement("p");


  paragraph.innerText = isCorrect
    ? "✅ Bravo ! Tu as la bonne réponse."
    : `❌ Désolé ! La bonne réponse était : ${correct}`;


  return paragraph;
}