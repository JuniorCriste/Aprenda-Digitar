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
    { name: "Nível 4: Textos", content: "O rato roeu a roupa do rei de Roma e a rainha reclamou que o rato roeu rápido demais. Três pratos de trigo para três tigres tristes comerem enquanto o rato roía outra roupa." },
    { name: "Nível 4: Textos", content: "Era uma vez um coelhinho curioso que adorava explorar o jardim atrás de sua casa, um dia ele encontrou uma borboleta colorida e decidiu segui-la entre as flores, no caminho conheceu um passarinho que cantava alegremente no galho de uma árvore, os três viraram amigos e passaram a tarde brincando e rindo juntos, e quando o sol se pôs o coelhinho voltou para casa muito feliz por ter feito novos amigos." },
    { name: "Nível 4: Textos", content: "Estudar informática é importante porque ajuda a entender e usar melhor as tecnologias presentes no dia a dia. Com esse conhecimento, é possível trabalhar com mais eficiência, resolver problemas e acessar mais oportunidades profissionais. Além disso, a informática desenvolve o raciocínio lógico e prepara as pessoas para um mundo cada vez mais digital..." },
    { name: "Nível 4: Textos", content: "Eu sempre me emociono quando ouço Michael Jackson; parece que cada música fala direto comigo, especialmente quando toca “Heal the world, make it a better place”. Às vezes fico arrepiado lembrando que preciso mudar também, e a frase “I'm starting with the man in the mirror” sempre me pega. Tem dias solitários em que coloco os fones e sinto conforto em “You are not alone, I am here with you”. Quando a emoção aperta de verdade, eu quase choro escutando “Will you be there”. E no meio de tudo isso, ainda sinto a força de “They don't care about us”, que me faz refletir sobre o mundo." }
    
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