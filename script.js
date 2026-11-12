import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

const dialog = document.getElementById("panelDialog");
const title = document.getElementById("dialogTitle");
const content = document.getElementById("dialogContent");
const eyebrow = document.getElementById("dialogEyebrow");

const panels = {
  volume: {
    label: "ЗВУК",
    title: "Громкость",
    html: '<p class="dialog-note">Официальный API Яндекса позволяет управлять совместимыми устройствами умного дома и сценариями. Публичного метода для изменения громкости самой Станции Лайт через эту API-документацию нет. Поэтому пока не показываем фиктивный регулятор.</p>'
  },
  voice: {
    label: "ПЕРСОНАЛИЗАЦИЯ",
    title: "Голос Алисы",
    html: '<p class="dialog-note">Голос Алисы можно менять только штатными способами, которые доступны в приложении и настройках Яндекса для твоей модели. В публичном API умного дома нет команды для установки произвольного голоса или изменения прошивки Станции. Эта панель не будет притворяться, что умеет это.</p>'
  },
  commands: {
    label: "БЫСТРЫЙ ДОСТУП",
    title: "Мои команды",
    html: '<p class="dialog-note">Здесь можно будет запускать поддерживаемые сценарии Яндекса и управлять совместимыми устройствами умного дома после настройки официального OAuth-доступа.</p>'
  },
  scenarios: {
    label: "АВТОМАТИЗАЦИЯ",
    title: "Сценарии",
    html: '<p class="dialog-note">Официальный API Яндекса поддерживает запуск сценариев умного дома. Для реальной интеграции понадобится OAuth с разрешениями iot:view и iot:control, а также безопасная серверная часть — одного GitHub Pages недостаточно для хранения секретов.</p>'
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