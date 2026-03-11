const levels = [
    { name: "Nível 1: Letras Base", content: "asdfg hjklç" },
    { name: "Nível 1: Letras Base", content: "qwert yuiop" },
    { name: "Nível 1: Letras Base", content: "zxcvb nm" },
    { name: "Nível 2: Acentuação", content: "café maçã avô você" },
    { name: "Nível 2: Acentuação", content: "moto FeLiCiDaDe arroz DJ" },
    { name: "Nível 2: Acentuação", content: "Geografia variável anjo avó" },
    { name: "Nível 3: Frases Curtas", content: "O sol brilha para todos." }
];
let currentLevelIdx = 0;
let currentCharIdx = 0;
let mistakes = 0;
let isComposing = false;
let startTime = null;
let timerInterval = null;

const wordDisplay = document.getElementById('word-display');
const hiddenInput = document.getElementById('hidden-input');
const wpmDisplay = document.getElementById('wpm-display');
const progressBar = document.getElementById('progress-bar');
const mistakeCount = document.getElementById('mistake-count');

// --- ÁUDIO (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(f, t, v, d) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = t; o.frequency.setValueAtTime(f, audioCtx.currentTime);
    g.gain.setValueAtTime(v, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + d);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + d);
}

// --- LOGICA DE RENDERIZAÇÃO ---
function loadLevel() {
    const text = levels[currentLevelIdx].content;
    document.getElementById('level-name').innerText = levels[currentLevelIdx].name;
    wordDisplay.innerHTML = '';
    currentCharIdx = 0;
    startTime = null;
    clearInterval(timerInterval);
    if(wpmDisplay) wpmDisplay.innerText = "0";

    const words = text.split(' ');
    let charCounter = 0;

    words.forEach((word, wordIdx) => {
        const colorClass = (wordIdx % 2 === 0) ? 'word-color-1' : 'word-color-2';
        word.split('').forEach(char => {
            createCharBox(char, colorClass, charCounter);
            charCounter++;
        });
        if (wordIdx < words.length - 1) {
            createCharBox(' ', colorClass, charCounter);
            charCounter++;
        }
    });
    
    hiddenInput.value = "";
    updateUI();
}

function createCharBox(char, colorClass, index) {
    const box = document.createElement('div');
    box.classList.add('char-box', colorClass);
    box.innerText = char === ' ' ? '␣' : char;
    if (index === 0) box.classList.add('current');
    wordDisplay.appendChild(box);
}

// --- CONTROLE DE WPM ---
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timeElapsed = (new Date() - startTime) / 60000; // minutos
        if (timeElapsed > 0) {
            const wpm = Math.round((currentCharIdx / 5) / timeElapsed);
            if(wpmDisplay) wpmDisplay.innerText = wpm > 0 ? wpm : 0;
        }
    }, 1000);
}

// --- INPUT E ACENTUAÇÃO ---
hiddenInput.addEventListener('compositionstart', () => isComposing = true);
hiddenInput.addEventListener('compositionend', (e) => {
    isComposing = false;
    handleInput(e.data);
});
hiddenInput.addEventListener('input', (e) => {
    if (!startTime && e.data) startTimer();
    if (!isComposing && e.data) handleInput(e.data);
});

function handleInput(typedChar) {
    const targetText = levels[currentLevelIdx].content;
    const boxes = document.querySelectorAll('.char-box');

    if (typedChar === targetText[currentCharIdx]) {
        playSound(600, 'sine', 0.1, 0.1);
        boxes[currentCharIdx].classList.replace('current', 'correct');
        currentCharIdx++;
        
        if (currentCharIdx < targetText.length) {
            boxes[currentCharIdx].classList.add('current');
            // Scroll automático para a letra atual
            boxes[currentCharIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            clearInterval(timerInterval);
            nextLevel();
        }
    } else {
        playSound(150, 'triangle', 0.2, 0.2);
        boxes[currentCharIdx].classList.add('wrong');
        mistakes++;
    }
    hiddenInput.value = "";
    updateUI();
}

function nextLevel() {
    currentLevelIdx++;
    if (currentLevelIdx < levels.length) {
        setTimeout(loadLevel, 300);
    } else {
        alert("Excelente! Você completou todos os módulos disponíveis.");
        currentLevelIdx = 0;
        loadLevel();
    }
}

function updateUI() {
    const progress = (currentLevelIdx / levels.length) * 100;
    if(progressBar) progressBar.style.width = `${progress}%`;
    if(mistakeCount) mistakeCount.innerText = mistakes;
}

// Foco automático
document.addEventListener('keydown', () => hiddenInput.focus());
window.addEventListener('load', loadLevel);