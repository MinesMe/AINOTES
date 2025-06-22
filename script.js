// --- Ссылки на элементы из HTML ---
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const recordButton = document.getElementById('recordButton');

// Флаг, который отслеживает, идет ли запись
let isRecording = false;

// 1. Проверяем, поддерживает ли браузер Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition && recordButton) {
    recognition = new SpeechRecognition();

    // Настройки для распознавания
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    // --- Обработчики событий распознавания ---

    recognition.onstart = () => {
        isRecording = true;
        recordButton.style.animation = 'pulse 1.5s infinite';
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        messageInput.value = finalTranscript + interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
    };

    recognition.onend = () => {
        isRecording = false;
        recordButton.style.animation = '';
        
        const recognizedText = messageInput.value.trim();
        if (recognizedText) {
            displayMessage(recognizedText, 'user');
            simulateAiResponse(recognizedText);
            messageInput.value = '';
        }
    };

    // --- Обработчик клика на кнопку микрофона ---
    recordButton.addEventListener('click', () => {
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

} else {
    if(!SpeechRecognition) {
        alert('Распознавание речи не поддерживается в вашем браузере. Пожалуйста, используйте Google Chrome.');
    }
    if(recordButton) {
        recordButton.disabled = true;
    }
}


// --- Функции для чата ---

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userText = messageInput.value.trim();
    if (userText) {
        displayMessage(userText, 'user');
        messageInput.value = '';
        simulateAiResponse(userText);
    }
});

function displayMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function simulateAiResponse(userText) {
    setTimeout(() => {
        const aiText = `Я получил ваш текст: "${userText}". Теперь я должен отправить его в GPT.`;
        displayMessage(aiText, 'ai');
    }, 1000);
}