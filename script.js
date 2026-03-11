const lessons = {
    basico: ["asdfg", "hjklç", "asdfg hjklç", "fdfs jklk"],
    medio: ["casa carro", "escola teclado", "computador curso", "brasil tecnologia"],
    avancado: [
        "A prática leva à perfeição em tudo o que fazemos.",
        "Desenvolver código limpo é uma arte fundamental.",
        "O aprendizado contínuo abre portas para o futuro."
    ]
};

let currentLevel = 'basico';
let lessonIndex = 0;
let isCareer = false;
let startTime;

const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const progressDisplay = document.getElementById('progress-display');

function startMode(mode) {
    isCareer = mode === 'carreira';
    currentLevel = isCareer ? 'basico' : mode;
    lessonIndex = 0;
    
    document.getElementById('mode-selection').classList.add('hidden');
    document.getElementById('play-area').classList.remove('hidden');
    
    loadLesson();
}

function loadLesson() {
    const currentText = lessons[currentLevel][lessonIndex];
    textDisplay.innerHTML = currentText.split('').map(char => `<span>${char}</span>`).join('');
    textInput.value = "";
    document.getElementById('lesson-title').innerText = `Nível ${currentLevel.toUpperCase()} - Lição ${lessonIndex + 1}`;
    textInput.focus();
    startTime = new Date();
}

textInput.addEventListener('input', () => {
    const arrayQuote = textDisplay.querySelectorAll('span');
    const arrayValue = textInput.value.split('');
    let done = true;

    arrayQuote.forEach((charSpan, index) => {
        const char = arrayValue[index];
        if (char == null) {
            charSpan.classList.remove('correct', 'incorrect');
            done = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            done = false;
        }
    });

    if (done) nextStep();
});

function nextStep() {
    lessonIndex++;
    
    // Verifica se terminou as lições do nível atual
    if (lessonIndex >= lessons[currentLevel].length) {
        if (isCareer) {
            if (currentLevel === 'basico') { currentLevel = 'medio'; lessonIndex = 0; }
            else if (currentLevel === 'medio') { currentLevel = 'avancado'; lessonIndex = 0; }
            else { alert("Parabéns! Você concluiu a carreira!"); return resetGame(); }
        } else {
            alert("Nível Concluído!");
            return resetGame();
        }
    }
    
    updateProgress();
    loadLesson();
}

function updateProgress() {
    const total = isCareer ? 
        (lessons.basico.length + lessons.medio.length + lessons.avancado.length) : 
        lessons[currentLevel].length;
    
    // Cálculo simples de progresso baseado no index
    const perc = Math.round((lessonIndex / total) * 100);
    progressDisplay.innerText = `${perc}%`;
}

function resetGame() {
    document.getElementById('mode-selection').classList.remove('hidden');
    document.getElementById('play-area').classList.add('hidden');
    progressDisplay.innerText = "0%";
}