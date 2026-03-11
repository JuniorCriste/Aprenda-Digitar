const courseData = [
    { name: "Início: Letras Base", content: "asdfg hjklç" },
    { name: "Expansão: Teclas Superiores", content: "querty uiop" },
    { name: "Palavras Comuns", content: "casa café balão informática" },
    { name: "Frases Completas", content: "A prática constante leva à perfeição técnica." },
    { name: "Desafio Final", content: "Programação e lógica são fundamentais para o sucesso." }
];

let currentLevel = 0;
let currentCharIndex = 0;
let mistakes = 0;
let startTime;

const wordDisplay = document.getElementById('word-display');
const hiddenInput = document.getElementById('hidden-input');
const progressBar = document.getElementById('progress-bar');

function initLevel() {
    const text = courseData[currentLevel].content;
    wordDisplay.innerHTML = '';
    currentCharIndex = 0;
    
    document.getElementById('level-name').innerText = courseData[currentLevel].name;

    text.split('').forEach((char, i) => {
        const span = document.createElement('div');
        span.classList.add('char-box');
        span.innerText = char === ' ' ? '␣' : char; // Representação visual para espaço
        if (i === 0) span.classList.add('current');
        wordDisplay.appendChild(span);
    });
    
    updateProgress();
}

window.addEventListener('click', () => hiddenInput.focus());

hiddenInput.addEventListener('input', (e) => {
    const targetText = courseData[currentLevel].content;
    const typedChar = e.target.value.slice(-1);
    const charBoxes = document.querySelectorAll('.char-box');

    if (!startTime) startTime = new Date();

    if (typedChar === targetText[currentCharIndex]) {
        charBoxes[currentCharIndex].classList.remove('current', 'wrong');
        charBoxes[currentCharIndex].classList.add('correct');
        
        currentCharIndex++;
        
        if (currentCharIndex < targetText.length) {
            charBoxes[currentCharIndex].classList.add('current');
        } else {
            finishLevel();
        }
    } else {
        charBoxes[currentCharIndex].classList.add('wrong');
        mistakes++;
        updateAccuracy();
    }
    
    hiddenInput.value = ''; // Limpa para a próxima letra
});

function finishLevel() {
    currentLevel++;
    if (currentLevel < courseData.length) {
        initLevel();
    } else {
        alert("Parabéns! Você concluiu o treinamento profissional!");
        currentLevel = 0;
        initLevel();
    }
}

function updateProgress() {
    const perc = (currentLevel / courseData.length) * 100;
    progressBar.style.width = `${perc}%`;
}

function updateAccuracy() {
    const totalTyped = currentCharIndex + mistakes;
    const acc = Math.round(((totalTyped - mistakes) / totalTyped) * 100);
    document.getElementById('accuracy').innerText = `${acc}%`;
}

// Inicializa o primeiro nível
initLevel();