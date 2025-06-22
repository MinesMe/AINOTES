// --- Ссылки на элементы из HTML ---
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const recordButton = document.getElementById('recordButton');

const AI_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.99 9.01c0-0.45-0.19-0.88-0.52-1.19l-7.5-7.5c-0.63-0.63-1.71-0.63-2.34 0l-7.5 7.5c-0.33 0.31-0.52 0.74-0.52 1.19s0.19 0.88 0.52 1.19l7.5 7.5c0.63 0.63 1.71 0.63 2.34 0l7.5-7.5c0.33-0.31 0.52-0.74 0.52-1.19zM11.5 16.5v-3.5h-3v-2h3V7.5l4 4.5-4 4.5z"/></svg>`;
const USER_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
const THINKING_ELEMENT_ID = 'thinking-message';

// Приветственное сообщение при загрузке
window.addEventListener('load', () => {
    displayMessage('Привет! Я ваш персональный ИИ-ассистент. Спросите меня о чем-нибудь или начните запись голоса.', 'ai');
});

let isRecording = false;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition && recordButton) {
    recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => { isRecording = true; recordButton.style.animation = 'pulse 1.5s infinite'; };
    recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        }
        messageInput.value = finalTranscript;
    };
    recognition.onerror = (event) => console.error('Ошибка распознавания:', event.error);
    recognition.onend = () => {
        isRecording = false;
        recordButton.style.animation = '';
        if (messageInput.value.trim()) messageForm.requestSubmit();
    };

    recordButton.addEventListener('click', () => {
        if (isRecording) recognition.stop();
        else recognition.start();
    });

} else {
    console.log('Web Speech API не поддерживается.');
    if(recordButton) recordButton.disabled = true;
}

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userText = messageInput.value.trim();
    if (userText) {
        displayMessage(userText, 'user');
        messageInput.value = '';
        simulateAiResponse(userText);
    }
});

function showThinkingIndicator() {
    chatMessages.insertAdjacentHTML('beforeend', `
        <div class="message ai" id="${THINKING_ELEMENT_ID}">
            <div class="avatar">${AI_AVATAR_SVG}</div>
            <div class="message-content">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
        </div>
    `);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideThinkingIndicator() {
    const thinkingElement = document.getElementById(THINKING_ELEMENT_ID);
    if (thinkingElement) thinkingElement.remove();
}

function displayMessage(text, sender) {
    const avatar = sender === 'ai' ? AI_AVATAR_SVG : USER_AVATAR_SVG;
    const messageHtml = `
        <div class="message ${sender}">
            <div class="avatar">${avatar}</div>
            <div class="message-content">${text}</div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateAiResponse(userText) {
    showThinkingIndicator();
    setTimeout(() => {
        hideThinkingIndicator();
        const aiText = `Отлично! Вы сказали: "${userText}". Теперь я готов к интеграции с настоящим API, чтобы давать осмысленные ответы.`;
        displayMessage(aiText, 'ai');
    }, 2500); // Увеличим задержку для демонстрации индикатора
}