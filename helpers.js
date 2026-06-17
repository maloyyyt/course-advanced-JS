export function saveUserToLocalStorage(user) {
  window.localStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromLocalStorage(user) {
  try {
    return JSON.parse(window.localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

export function removeUserFromLocalStorage(user) {
  window.localStorage.removeItem("user");
}

export function escapeHtml(text) {
  if (!text) {
    return "";
  }
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatTimeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return "только что";
  }
  if (minutes < 60) {
    return `${minutes} ${declension(minutes, "минуту", "минуты", "минут")} назад`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ${declension(hours, "час", "часа", "часов")} назад`;
  }

  const days = Math.floor(hours / 24);
  return `${days} ${declension(days, "день", "дня", "дней")} назад`;
}

function declension(number, one, few, many) {
  const n = Math.abs(number) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) {
    return many;
  }
  if (n1 > 1 && n1 < 5) {
    return few;
  }
  if (n1 === 1) {
    return one;
  }
  return many;
}
