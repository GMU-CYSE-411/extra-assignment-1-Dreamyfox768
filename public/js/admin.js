(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent =
        "The client says this is not your area, but the page still tries to load admin data.";
      return;
    } //Removing code below so non-admins can not call admin API, that way it does not load admin data

    const result = await api("/api/admin/users");
    document.getElementById("admin-users").textContent = result.users// Changes .innerhtml to textcontent so safer DOM API
      .map(
        (entry) => `
          <tr>
            <td>${entry.id}</td>
            <td>${entry.username}</td>
            <td>${entry.role}</td>
            <td>${entry.displayName}</td>
            <td>${entry.noteCount}</td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
