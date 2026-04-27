async function loadSettings(userId) {
  const result = await api(`/api/settings?userId=${encodeURIComponent(userId)}`);
  const settings = result.settings;

  document.getElementById("settings-form-user-id").value = settings.userId;
  document.getElementById("settings-user-id").value = settings.userId;

  const form = document.getElementById("settings-form");
  form.elements.displayName.value = settings.displayName;
  form.elements.theme.value = settings.theme;
  form.elements.statusMessage.value = settings.statusMessage;
  form.elements.emailOptIn.checked = Boolean(settings.emailOptIn);
  
  const preview = document.getElementById("status-preview");
  preview.replaceChildren();
  const name = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = settings.displayName;// textcontent , values as text and not html code. Refactor status preview to use DOM manipulation instead of innerHTML for better security.
  name.appendChild(strong);
  
  const message = document.createElement("p");
  message.textContent = settings.statusMessage;
  
  preview.append(name, message);//same as note.js removing innerhtml and adding box layout method of UI to protect from xss attack. 

  writeJson("settings-output", settings);
}

(async function bootstrapSettings() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      writeJson("settings-output", { error: "Please log in first." });
      return;
    }

    await loadSettings(user.id);
  } catch (error) {
    writeJson("settings-output", { error: error.message });
  }
})();

document.getElementById("settings-query-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  await loadSettings(formData.get("userId"));
});

document.getElementById("settings-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = {
    userId: formData.get("userId"),
    displayName: formData.get("displayName"),
    theme: formData.get("theme"),
    statusMessage: formData.get("statusMessage"),
    emailOptIn: formData.get("emailOptIn") === "on"
  };

  const result = await api("/api/settings", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  writeJson("settings-output", result);
  await loadSettings(payload.userId);
});

document.getElementById("enable-email").addEventListener("click", async () => {
  const result = await api("/api/settings/toggle-email?enabled=1");
  writeJson("settings-output", result);
});

document.getElementById("disable-email").addEventListener("click", async () => {
  const result = await api("/api/settings/toggle-email?enabled=0");
  writeJson("settings-output", result);
});
