// --- Ссылки на элементы из предыдущего шага ---
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

// --- НОВЫЕ ССЫЛКИ И ПЕРЕМЕННЫЕ ДЛЯ РАСПОЗНАВАНИЯ РЕЧИ ---
const recordButton = document.getElementById('recordButton');
let isRecording = false; // Флаг, который отслеживает, идет ли запись

// 1. Проверяем, поддерживает ли браузер Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();

    // Настройки для распознавания
    recognition.lang = 'ru-RU'; // Язык распознавания
    recognition.continuous = true; // Продолжать слушать, даже если есть паузы
    recognition.interimResults = true; // Показывать промежуточные (нефинальные) результаты

    // --- ОБРАБОТЧИКИ СОБЫТИЙ РАСПОЗНАВАНИЯ ---

    // Событие, когда распознавание началось
    recognition.onstart = () => {
        console.log('Распознавание речи началось...');
        // Можно добавить визуальный эффект для кнопки, например, анимацию
        recordButton.style.animation = 'pulse 1.5s infinite';
    };

    // Событие, когда получен результат
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
        
        // Помещаем промежуточный или финальный результат в поле ввода
        messageInput.value = finalTranscript + interimTranscript;
    };

    // Событие при ошибке
    recognition.onerror = (event) => {
        console.error('Ошибка распознавания речи:', event.error);
    };

    // Событие, когда распознавание закончилось
    recognition.onend = () => {
        console.log('Распознавание речи завершено.');
        isRecording = false;
        recordButton.style.animation = ''; // Убираем анимацию
        
        // Если в поле ввода есть текст после распознавания, отправляем его
        const recognizedText = messageInput.value.trim();
        if (recognizedText) {
            // "Кликаем" на отправку формы программно
            messageForm.requestSubmit();
        }
    };

} else {
    // Если API не поддерживается, сообщаем пользователю
    console.error('Ваш браузер не поддерживает Web Speech API. Попробуйте Google Chrome.');
    // Можно отключить кнопку или показать сообщение
    recordButton.disabled = true;
    alert('Распознавание речи не поддерживается в вашем браузере. Пожалуйста, используйте Google Chrome.');
}


// 2. Обработчик клика на кнопку микрофона
recordButton.addEventListener('click', () => {
    if (isRecording) {
        // Если запись идет, останавливаем ее
        recognition.stop();
        isRecording = false;
    } else {
        // Если запись не идет, начинаем ее
        // Очищаем поле ввода перед началом новой записи
        messageInput.value = '';
        recognition.start();
        isRecording = true;
    }
});


// --- Код для чата из предыдущего шага (немного изменен) ---

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const userText = messageInput.value.trim();
    if (userText) {
        displayMessage(userText, 'user');
        messageInput.value = ''; // Очищаем поле ввода
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