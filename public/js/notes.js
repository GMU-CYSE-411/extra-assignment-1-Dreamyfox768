function noteCard(note) {
  const article = document.createElement("article");
  article.className = "note-card";

  const title = document.createElement("h3");
  title.textContent = note.title;

  const owner = document.createElement("p");
  owner.textContent = "Owner: " + note.ownerUsername;

  const id = document.createElement("p");
  id.textContent = "ID: " + note.id;

  const pinned = document.createElement("p");
  pinned.textContent = "Pinned: " + note.pinned;

  const body = document.createElement("div");
  body.className = "note-body";
  body.textContent = note.body;

  article.appendChild(title);
  article.appendChild(owner);
  article.appendChild(id);
  article.appendChild(pinned);
  article.appendChild(body);

  return article;
}
//adding code below for making box layout display for UI so using safer DOM API like appendchild and not innerhtml

async function loadNotes(ownerId, search) {
  const query = new URLSearchParams();

  if (ownerId) {
    query.set("ownerId", ownerId);
  }

  if (search) {
    query.set("search", search);
  }

  const result = await api(`/api/notes?${query.toString()}`);
  const notesList = document.getElementById("notes-list");
  notesList.textContent = result.notes.map(noteCard).join(""); // remover inner html and using either textcotent or appendChild
//: removing innerhtml so text is not seen as html}

(async function bootstrapNotes() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("notes-list").textContent = "Please log in first.";
      return;
    }

    document.getElementById("notes-owner-id").value = user.id;
    document.getElementById("create-owner-id").value = user.id;
    await loadNotes(user.id, "");
  } catch (error) {
    document.getElementById("notes-list").textContent = error.message;
  }
})();

document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await loadNotes(formData.get("ownerId"), formData.get("search"));
});

document.getElementById("create-note-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = {
    ownerId: formData.get("ownerId"),
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on"
  };

  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  await loadNotes(payload.ownerId, "");
  event.currentTarget.reset();
  document.getElementById("create-owner-id").value = payload.ownerId;
});
