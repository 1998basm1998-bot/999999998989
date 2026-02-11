let displayValue = "";
let isRecording = false;

// --- منطق الحاسبة ---
function appendNumber(num) {
    displayValue += num;
    updateDisplay();
}

function appendOperator(op) {
    displayValue += op;
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').innerText = displayValue || "0";
}

function clearDisplay() {
    displayValue = "";
    updateDisplay();
}

function calculate() {
    if (displayValue === "5+5") {
        document.getElementById('calculator').classList.add('hidden');
        document.getElementById('chat-interface').classList.remove('hidden');
        return;
    }
    try {
        displayValue = eval(displayValue.replace('×', '*').replace('÷', '/')).toString();
        updateDisplay();
    } catch {
        displayValue = "Error";
        updateDisplay();
    }
}

// --- منطق الدردشة ---
const messageInput = document.getElementById('messageInput');
const actionIcon = document.getElementById('actionIcon');
const mainBtn = document.getElementById('mainActionBtn');

// تبديل الأيقونة بناءً على وجود نص
function toggleButtons() {
    if (messageInput.value.trim() !== "") {
        actionIcon.className = "fas fa-paper-plane";
    } else {
        actionIcon.className = "fas fa-microphone";
    }
}

function handleMainAction() {
    const text = messageInput.value.trim();
    
    if (text !== "") {
        // إرسال نص
        addMessage(text, 'sent');
        messageInput.value = "";
        toggleButtons();
    } else {
        // تسجيل صوتي
        toggleVoiceRecording();
    }
}

function toggleVoiceRecording() {
    isRecording = !isRecording;
    if (isRecording) {
        mainBtn.classList.add('recording-active');
        messageInput.placeholder = "جاري التسجيل...";
        messageInput.disabled = true;
    } else {
        mainBtn.classList.remove('recording-active');
        messageInput.placeholder = "اكتب رسالة...";
        messageInput.disabled = false;
        addMessage('<div class="audio-msg"><i class="fas fa-play"></i> <span>مقطع صوتي 0:05</span></div>', 'sent', false, true);
    }
}

// رفع الصور
function handleImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addMessage(e.target.result, 'sent', true);
        };
        reader.readAsDataURL(file);
    }
}

function addMessage(content, type, isImage = false, isHTML = false) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${type}`;
    
    if (isImage) {
        const img = document.createElement('img');
        img.src = content;
        msgDiv.appendChild(img);
    } else if (isHTML) {
        msgDiv.innerHTML = content;
    } else {
        msgDiv.innerText = content;
    }
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}