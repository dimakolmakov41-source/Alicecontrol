const dialog = document.getElementById("panelDialog");
const title = document.getElementById("dialogTitle");
const content = document.getElementById("dialogContent");
const eyebrow = document.getElementById("dialogEyebrow");

const panels = {
  volume: {
    label: "ЗВУК",
    title: "Громкость",
    html: '<p class="dialog-note">Регулировка громкости станет доступна после подключения через поддерживаемый интерфейс Яндекса. Сейчас колонка не подключена.</p>'
  },
  voice: {
    label: "ПЕРСОНАЛИЗАЦИЯ",
    title: "Голос Алисы",
    html: '<p class="dialog-note">Здесь будут собраны доступные варианты голоса и официальные настройки Алисы. Изменение голоса возможно только в пределах вариантов, которые предоставляет Яндекс для твоей модели и аккаунта.</p>'
  },
  commands: {
    label: "БЫСТРЫЙ ДОСТУП",
    title: "Мои команды",
    html: '<p class="dialog-note">Здесь появятся быстрые команды для поддерживаемых действий и устройств умного дома.</p>'
  },
  scenarios: {
    label: "АВТОМАТИЗАЦИЯ",
    title: "Сценарии",
    html: '<p class="dialog-note">Сценарии можно будет связать с поддерживаемыми устройствами умного дома через официальный доступ Яндекса.</p>'
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