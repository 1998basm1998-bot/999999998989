// عناصر الحاسبة
const calcDisplay = document.getElementById("calcDisplay");
const buttons = document.querySelectorAll(".btn[data-value]");
const clearBtn = document.getElementById("clear");
const equalsBtn = document.getElementById("equals");

// عناصر الدردشة
const chatWrapper = document.getElementById("chatWrapper");
const calculator = document.getElementById("calculator");

// إعدادات السرّ (كلمة السر + توقيت الحذف)
let secretExpression = "5+5"; // القيمة الافتراضية
let deleteAfterSeconds = 0; // 0 = بدون حذف تلقائي

let expression = "";

// التعامل مع أزرار الأرقام والعمليات
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-value");
    expression += value;
    calcDisplay.textContent = expression;
  });
});

// زر C لمسح
clearBtn.addEventListener("click", () => {
  expression = "";
  calcDisplay.textContent = "0";
});

// زر =
equalsBtn.addEventListener("click", () => {
  // لو كانت العملية هي كلمة السر الحالية (مثلاً 5+5 أو 4+4 حسب الإعدادات)
  if (expression.replace(/\s+/g, "") === secretExpression.replace(/\s+/g, "")) {
    // نفتح واجهة الدردشة السريّة
    openSecretChat();
  }

  try {
    // حساب النتيجة كحاسبة عادية أيضاً
    const result = eval(expression || "0");
    calcDisplay.textContent = result;
    expression = String(result);
  } catch (e) {
    calcDisplay.textContent = "خطأ";
    expression = "";
  }
});

function openSecretChat() {
  calculator.classList.add("hidden");
  chatWrapper.classList.remove("hidden");
}

/* ===== منطق الدردشة ===== */

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const imageInput = document.getElementById("imageInput");
const micBtn = document.getElementById("micBtn");

// تبويبات الدردشة / الإعدادات
const tabChatBtn = document.getElementById("tabChatBtn");
const tabSettingsBtn = document.getElementById("tabSettingsBtn");
const chatContent = document.getElementById("chatContent");
const settingsContent = document.getElementById("settingsContent");

// عناصر الإعدادات
const passwordExpressionInput = document.getElementById("passwordExpression");
const deleteAfterSecondsInput = document.getElementById("deleteAfterSeconds");
const extraSettingInput = document.getElementById("extraSetting");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");

// شريط الأدوات الإضافية في الدردشة (إبقاء فقط زر حذف الكل)
const clearAllMessagesBtn = document.getElementById("clearAllMessagesBtn");

// تهيئة حقول الإعدادات بالقيم الحالية
passwordExpressionInput.value = secretExpression;
deleteAfterSecondsInput.value = deleteAfterSeconds || "";

// تبديل التبويبات
tabChatBtn.addEventListener("click", () => {
  tabChatBtn.classList.add("chat-tab-active");
  tabSettingsBtn.classList.remove("chat-tab-active");
  chatContent.classList.remove("hidden");
  settingsContent.classList.add("hidden");
});

tabSettingsBtn.addEventListener("click", () => {
  tabSettingsBtn.classList.add("chat-tab-active");
  tabChatBtn.classList.remove("chat-tab-active");
  settingsContent.classList.remove("hidden");
  chatContent.classList.add("hidden");
});

// حفظ الإعدادات
saveSettingsBtn.addEventListener("click", () => {
  const newSecret = passwordExpressionInput.value.trim();
  if (newSecret) {
    secretExpression = newSecret;
  }

  const secondsValue = parseInt(deleteAfterSecondsInput.value, 10);
  if (!isNaN(secondsValue) && secondsValue >= 0) {
    deleteAfterSeconds = secondsValue;
  }

  // يمكن لاحقاً استخدام extraSettingInput لقيم إضافية
  // حالياً نتركه بدون منطق معيّن للحفاظ على البساطة

  alert("تم حفظ الإعدادات بنجاح.");
});

// إرسال رسالة نصية
function sendMessage(text) {
  if (!text.trim()) return;

  const msgDiv = document.createElement("div");
  msgDiv.className = "msg msg-right";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;

  const time = document.createElement("div");
  time.className = "msg-time";
  const now = new Date();
  time.textContent = now.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  bubble.appendChild(time);
  msgDiv.appendChild(bubble);
  chatMessages.appendChild(msgDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  // حذف الرسالة تلقائياً إن كان توقيت الحذف > 0
  if (deleteAfterSeconds > 0) {
    setTimeout(() => {
      if (msgDiv.parentNode) {
        msgDiv.parentNode.removeChild(msgDiv);
      }
    }, deleteAfterSeconds * 1000);
  }
}

// حدث زر الإرسال
sendBtn.addEventListener("click", () => {
  sendMessage(chatInput.value);
  chatInput.value = "";
});

// إرسال عند الضغط على إنتر
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage(chatInput.value);
    chatInput.value = "";
  }
});

// رفع صورة
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "msg msg-right";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";

    const img = document.createElement("img");
    img.className = "msg-image";
    img.src = reader.result;

    const time = document.createElement("div");
    time.className = "msg-time";
    const now = new Date();
    time.textContent = now.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    bubble.appendChild(img);
    bubble.appendChild(time);
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // حذف الرسالة (الصورة) تلقائياً إن كان توقيت الحذف > 0
    if (deleteAfterSeconds > 0) {
      setTimeout(() => {
        if (msgDiv.parentNode) {
          msgDiv.parentNode.removeChild(msgDiv);
        }
      }, deleteAfterSeconds * 1000);
    }

    // إعادة تعيين input عشان تقدر ترفع نفس الصورة مرة ثانية لو حاب
    imageInput.value = "";
  };
  reader.readAsDataURL(file);
});

// زر المايك (شكل فقط + رسالة توضيح)
micBtn.addEventListener("click", () => {
  const info =
    "زر المايك حالياً شكلي فقط. لتفعيل التسجيل الصوتي تحتاج WebRTC/MediaRecorder و Backend.";
  alert(info);
});

/* ===== أدوات الدردشة الإضافية (حذف الكل فقط) ===== */

// حذف كل الرسائل
clearAllMessagesBtn.addEventListener("click", () => {
  chatMessages.innerHTML = "";
});

/* ===== PWA: تسجيل Service Worker وزر التثبيت ===== */

let deferredPrompt;
const installPwaBtn = document.getElementById("installPwaBtn");

// تسجيل Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => {
        console.error("Service worker registration failed:", err);
      });
  });
}

// التعامل مع حدث beforeinstallprompt لعرض زر التثبيت
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installPwaBtn.classList.remove("hidden");
});

installPwaBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    console.log("User accepted the install prompt");
  } else {
    console.log("User dismissed the install prompt");
  }
  deferredPrompt = null;
  installPwaBtn.classList.add("hidden");
});

// إخفاء الزر بعد التثبيت
window.addEventListener("appinstalled", () => {
  installPwaBtn.classList.add("hidden");
});
