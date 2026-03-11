const levels = [
    { name: "Nível 1: Letras Base", content: "asdfg hjklç" },
    { name: "Nível 1: Letras Base", content: "qwert yuiop" },
    { name: "Nível 1: Letras Base", content: "zxcvb nm" },
    { name: "Nível 2: Acentuação", content: "café maçã avô você" },
    { name: "Nível 2: Acentuação", content: "moto FeLiCiDaDe arroz DJ" },
    { name: "Nível 2: Acentuação", content: "Geografia variável anjo avó" },
    { name: "Nível 3: Frases Curtas", content: "O sol brilha para todos." },
    { name: "Nível 3: Frases Curtas", content: "Eu uso Linux." },
    { name: "Nível 3: Frases Curtas", content: "Trabalhei o dia inteiro. Estou exausta!" },
    { name: "Nível 3: Frases Curtas", content: "sei lá..." },
    { name: "Nível 4: Frases grandes", content: "A digitação rápida exige prática constante. O domínio vem através da disciplina!" },
    { name: "Nível 4: Frases grandes", content: "Falaram que a imaginação é mais importante que o conhecimento, será?" },
    { name: "Nível 4: Frases grandes", content: "Amanheceu ensolarado, mas o vento frio trouxe a melancolia e as núvens cinzentas de tristeza." },
    { name: "Nível 4: Frases grandes", content: "Formatarei meu computador. Instalarei Linux! OO que acha, Pedro?" },
    { name: "Nível 4: Frases grandes", content: "Sim, Bowie! Eu estou cara a cara com o homem que vendeu o mundo!" },
    
];

let currentLevelIdx = 0;
let currentCharIdx = 0;
let mistakes = 0;
let isComposing = false; // Trava para acentos

const wordDisplay = document.getElementById('word-display');
const hiddenInput = document.getElementById('hidden-input');

// --- SISTEMA DE SOM ---
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
const soundSuccess = () => playSound(600, 'sine', 0.1, 0.1);
const soundError = () => playSound(150, 'triangle', 0.2, 0.2);

// --- LÓGICA DE CARREGAMENTO ---
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
    hiddenInput.value = "";
}

// --- CONTROLE DE ACENTUAÇÃO (COMPOSITION) ---
hiddenInput.addEventListener('compositionstart', () => {
    isComposing = true; // Usuário apertou o acento
});

hiddenInput.addEventListener('compositionend', (e) => {
    isComposing = false; // Usuário terminou de combinar (ex: acento + e)
    handleInput(e.data); // Valida o caractere final gerado
});

hiddenInput.addEventListener('input', (e) => {
    // Se não estiver no meio de uma acentuação, valida caracteres normais
    if (!isComposing && e.inputType !== "deleteContentBackward") {
        handleInput(e.data);
    }
});

function handleInput(typedChar) {
    if (!typedChar) return;

    const targetText = levels[currentLevelIdx].content;
    const expectedChar = targetText[currentCharIdx];
    const boxes = document.querySelectorAll('.char-box');

    if (typedChar === expectedChar) {
        soundSuccess();
        boxes[currentCharIdx].classList.replace('current', 'correct');
        boxes[currentCharIdx].classList.remove('wrong');
        currentCharIdx++;
        
        if (currentCharIdx < targetText.length) {
            boxes[currentCharIdx].classList.add('current');
        } else {
            nextLevel();
        }
    } else {
        soundError();
        boxes[currentCharIdx].classList.add('wrong');
        mistakes++;
    }
    
    hiddenInput.value = ""; // Limpa para a próxima tecla
    updateUI();
}

function nextLevel() {
    currentLevelIdx++;
    if (currentLevelIdx < levels.length) {
        setTimeout(loadLevel, 300);
    } else {
        alert("Carreira concluída com sucesso!");
        currentLevelIdx = 0;
        loadLevel();
    }
}

function updateUI() {
    const progress = (currentLevelIdx / levels.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('mistake-count').innerText = mistakes;
}

document.addEventListener('keydown', () => hiddenInput.focus());
window.addEventListener('load', loadLevel);