/**
 * AINotes - AI Assistant Script
 * This script handles speech recognition, chat functionality, and dynamic UI updates.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. КОНСТАНТЫ И ПЕРЕМЕННЫЕ ---
    const recordButton = document.getElementById('recordButton');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // HTML-код для аватаров, чтобы легко вставлять их в сообщения
    const AI_AVATAR_HTML = `<img src="devka.jpg" alt="AI Assistant">`;
    const USER_AVATAR_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
    const THINKING_INDICATOR_ID = 'thinking-message';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isRecording = false;

    // --- 2. ИНИЦИАЛИЗАЦИЯ ---

    // Настройка распознавания речи, если оно поддерживается
    if (SpeechRecognition) {
        setupSpeechRecognition();
    } else {
        console.warn("Web Speech API не поддерживается в этом браузере.");
        if (recordButton) recordButton.disabled = true;
    }

    // Привязка обработчиков событий к элементам
    setupEventListeners();

    // Показываем приветственное сообщение
    showWelcomeMessage();

    // --- 3. НАСТРОЙКА ФУНКЦИЙ ---

    function setupSpeechRecognition() {
        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false; // Лучше false, чтобы он останавливался после паузы
        recognition.interimResults = false; // Промежуточные результаты не нужны

        recognition.onstart = () => {
            isRecording = true;
            recordButton.style.animation = 'pulse 1.5s infinite';
        };

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript.trim();
            if (spokenText) {
                messageInput.value = spokenText;
                messageForm.dispatchEvent(new Event('submit')); // Программно отправляем форму
            }
        };

        recognition.onerror = (event) => {
            console.error('Ошибка распознавания речи:', event.error);
        };

        recognition.onend = () => {
            isRecording = false;
            recordButton.style.animation = '';
        };
    }

    function setupEventListeners() {
        if (recordButton && recognition) {
            recordButton.addEventListener('click', () => {
                if (isRecording) {
                    recognition.stop();
                } else {
                    recognition.start();
                }
            });
        }

        if (messageForm) {
            messageForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const userText = messageInput.value.trim();
                if (userText) {
                    displayMessage(userText, 'user');
                    messageInput.value = '';
                    getAiResponse(userText);
                }
            });
        }
    }

    function showWelcomeMessage() {
        setTimeout(() => {
            displayMessage('Привет! Я ваш персональный ИИ-ассистент. Спросите меня о чем-нибудь или начните запись голоса.', 'ai');
        }, 500);
    }

    /**
     * Создает и отображает сообщение в чате
     * @param {string} text - Текст сообщения
     * @param {'user' | 'ai'} sender - Отправитель
     */
    function displayMessage(text, sender) {
        // Убираем индикатор "думает", если он есть
        hideThinkingIndicator();

        const messageWrapper = document.createElement('div');
        messageWrapper.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerHTML = sender === 'ai' ? AI_AVATAR_HTML : USER_AVATAR_HTML;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        messageWrapper.appendChild(avatar);
        messageWrapper.appendChild(messageContent);
        chatMessages.appendChild(messageWrapper);

        // Прокручиваем вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showThinkingIndicator() {
        // Проверяем, что индикатора еще нет
        if (!document.getElementById(THINKING_INDICATOR_ID)) {
            const thinkingMessage = `
                <div class="message ai" id="${THINKING_INDICATOR_ID}">
                    <div class="avatar">${AI_AVATAR_HTML}</div>
                    <div class="message-content">
                        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', thinkingMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function hideThinkingIndicator() {
        const indicator = document.getElementById(THINKING_INDICATOR_ID);
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Симулирует ответ от ИИ
     * @param {string} userText - Текст пользователя для ответа
     */
    function getAiResponse(userText) {
        showThinkingIndicator();

        setTimeout(() => {
            // Здесь в будущем будет реальный запрос к API
            const responseText = `Отлично! Вы сказали: "${userText}". Теперь я готов к интеграции с настоящим API, чтобы давать осмысленные ответы.`;
            displayMessage(responseText, 'ai');
        }, 2000); // Задержка для симуляции
    }
});