import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const authButton = document.getElementById("authButton");
const accountStatus = document.getElementById("accountStatus");
const connectionText = document.getElementById("connectionText");
const connectionDot = document.getElementById("connectionDot");

authButton.addEventListener("click", async () => {
  authButton.disabled = true;
  try {
    if (auth.currentUser) {
      await signOut(auth);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    accountStatus.textContent = authErrorMessage(error);
  } finally {
    authButton.disabled = false;
  }
});

onAuthStateChanged(auth, async user => {
  if (user) {
    authButton.textContent = "Выйти";
    accountStatus.textContent = `Вход выполнен: ${user.displayName || user.email}`;
    connectionText.textContent = "FIREBASE: ПОДКЛЮЧЁН";
    connectionDot.style.background = "#54d88a";
    try {
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName || "",
        email: user.email || "",
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      accountStatus.textContent += " · Не удалось сохранить профиль: " + authErrorMessage(error);
    }
  } else {
    authButton.textContent = "Войти через Google";
    accountStatus.textContent = "Вход не выполнен. Настройки пока не синхронизируются.";
    connectionText.textContent = "FIREBASE: ГОТОВ К ВХОДУ";
    connectionDot.style.background = "#e1ad58";
  }
});

function authErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("auth/unauthorized-domain")) return "Домен GitHub Pages не добавлен в Authorized domains Firebase Authentication.";
  if (code.includes("auth/operation-not-allowed")) return "В Firebase Authentication ещё не включён вход через Google.";
  if (code.includes("permission-denied")) return "Firestore запрещает запись. Нужны безопасные правила доступа.";
  if (code.includes("auth/popup-blocked")) return "Браузер заблокировал окно входа. Разреши всплывающие окна.";
  return error?.message || "Неизвестная ошибка Firebase.";
}

const dialog = document.getElementById("panelDialog");
const title = document.getElementById("dialogTitle");
const content = document.getElementById("dialogContent");
const eyebrow = document.getElementById("dialogEyebrow");

const panels = {
  volume: {
    label: "ЗВУК",
    title: "Громкость",
    html: '<p class="dialog-note">Для самой Станции Лайт публичный API умного дома не предоставляет универсального регулятора громкости. После подключения аккаунта покажем только реально доступные функции.</p>'
  },
  voice: {
    label: "ПЕРСОНАЛИЗАЦИЯ",
    title: "Голос Алисы",
    html: '<p class="dialog-note">Изменение голоса доступно только штатными способами Яндекса, если они поддерживаются твоей моделью и аккаунтом. Панель не будет имитировать изменение голоса.</p>'
  },
  commands: {
    label: "БЫСТРЫЙ ДОСТУП",
    title: "Мои команды",
    html: '<p class="dialog-note">Здесь появятся команды для устройств и сценариев, которые реально вернёт API Яндекса.</p>'
  },
  scenarios: {
    label: "АВТОМАТИЗАЦИЯ",
    title: "Сценарии",
    html: '<p class="dialog-note">После настройки OAuth Яндекса здесь можно будет показывать и запускать доступные сценарии умного дома.</p>'
  }
};

document.querySelectorAll("[data-panel]").forEach(button => {
  button.addEventListener("click", () => {
    const panel = panels[button.dataset.panel];
    if (!panel) return;
    eyebrow.textContent = panel.label;
    title.textContent = panel.title;
    content.innerHTML = panel.html;
    dialog.showModal();
  });
});

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
