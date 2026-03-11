const levels = [
    { name: "Nível 1: Letras Base", content: "asdfg hjklç" },
    { name: "Nível 2: Acentuação Simples", content: "café maçã avô você" },
    { name: "Nível 3: Frases Curtas", content: "O sol brilha para todos." },
    { name: "Nível 4: Desafio Profissional", content: "A digitação rápida requer muita prática e paciência." }
];

let currentLevelIdx = 0;
let currentCharIdx = 0;
let mistakes = 0;
let startTime = null;

const wordDisplay = document.getElementById('word-display');
const hiddenInput = document.getElementById('hidden-input');
const progressBar = document.getElementById('progress-bar');
const accuracyText = document.getElementById('accuracy');
const mistakeText = document.getElementById('mistake-count');

// --- SISTEMA DE SOM (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type, vol, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const soundSuccess = () => playSound(580, 'sine', 0.1, 0.1);
const soundError = () => playSound(120, 'triangle', 0.2, 0.2);

// --- LÓGICA DO JOGO ---

function loadLevel() {
    const level = levels[currentLevelIdx];
    document.getElementById('level-name').innerText = level.name;
    wordDisplay.innerHTML = '';
    currentCharIdx = 0;
    
    level.content.split('').forEach((char, i) => {
        const box = document.createElement('div');
        box.classList.add('char-box');
        box.innerText = char === ' ' ? '␣' : char;
        if (i === 0) box.classList.add('current');
        wordDisplay.appendChild(box);
    });
    
    updateUI();
}

// O segredo para os acentos é observar o valor final do input
hiddenInput.addEventListener('input', (e) => {
    if (!startTime) startTime = new Date();
    
    const targetText = levels[currentLevelIdx].content;
    const typedValue = e.target.value; // Pega o que foi digitado (ex: "é")
    const expectedChar = targetText[currentCharIdx];
    const boxes = document.querySelectorAll('.char-box');

    if (typedValue === "") return;

    // Compara o caractere completo (incluindo o acento já processado pelo navegador)
    if (typedValue === expectedChar) {
        soundSuccess();
        boxes[currentCharIdx].classList.replace('current', 'correct');
        boxes[currentCharIdx].classList.remove('wrong');
        
        currentCharIdx++;
        
        if (currentCharIdx < targetText.length) {
            boxes[currentCharIdx].classList.add('current');
        } else {
            nextLevel();
        }
        e.target.value = ""; // Limpa para o próximo
    } else {
        // Se o que foi digitado não é o começo de um caractere composto
        // Isso evita que o acento sozinho conte como erro antes da letra
        if (!expectedChar.startsWith(typedValue)) {
            soundError();
            boxes[currentCharIdx].classList.add('wrong');
            mistakes++;
            e.target.value = ""; // Limpa erro
        }
    }
    updateUI();
});

function nextLevel() {
    currentLevelIdx++;
    if (currentLevelIdx < levels.length) {
        setTimeout(loadLevel, 500);
    } else {
        alert("Parabéns! Carreira concluída!");
        currentLevelIdx = 0;
        mistakes = 0;
        startTime = null;
        loadLevel();
    }
}

function updateUI() {
    // Progresso baseado nos níveis
    const progress = (currentLevelIdx / levels.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Precisão
    const totalTyped = currentCharIdx + mistakes;
    const acc = totalTyped === 0 ? 100 : Math.round(((totalTyped - mistakes) / totalTyped) * 100);
    accuracyText.innerText = `${acc}%`;
    mistakeText.innerText = mistakes;
}

// Manter o foco sempre no input
document.addEventListener('keydown', () => hiddenInput.focus());
window.addEventListener('click', () => hiddenInput.focus());

// Iniciar
loadLevel();