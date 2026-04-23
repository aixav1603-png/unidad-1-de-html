const users = [
  { user: "user1@sportclub.cl", password: "1234", role: "user", name: "Usuario Uno" },
  { user: "user2@sportclub.cl", password: "1234", role: "user", name: "Usuario Dos" },
  { user: "coach1@sportclub.cl", password: "1234", role: "coach", name: "Coach Uno" },
  { user: "coach2@sportclub.cl", password: "1234", role: "coach", name: "Coach Dos" },
  { user: "admin1@sportclub.cl", password: "1234", role: "admin", name: "Admin Uno" },
  { user: "admin2@sportclub.cl", password: "1234", role: "admin", name: "Admin Dos" }
];

const roleRoutes = {
  user: "user-dashboard.html",
  coach: "coach-dashboard.html",
  admin: "admin-dashboard.html"
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

function showMessage(container, message, type) {
  if (!container) {
    return;
  }

  container.textContent = message;
  container.className = `mensaje ${type}`;
}

function redirectToRoleDashboard(role) {
  const route = roleRoutes[role];
  if (route) {
    window.location.href = route;
  }
}

function saveLoggedUser(user) {
  const sessionUser = {
    user: normalizeEmail(user.user),
    role: user.role,
    name: user.name
  };
  localStorage.setItem("user", JSON.stringify(sessionUser));
}

function setupLoginPage() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  const messageBox = document.getElementById("loginMessage");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const activeUser = getStoredUser();
  if (activeUser && roleRoutes[activeUser.role]) {
    redirectToRoleDashboard(activeUser.role);
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = normalizeEmail(emailInput.value);
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage(messageBox, "Completa correo y contrasena.", "error");
      return;
    }

    const matchedUser = users.find(function (item) {
      return normalizeEmail(item.user) === email && item.password === password;
    });

    if (!matchedUser) {
      showMessage(messageBox, "Correo o contrasena incorrectos.", "error");
      return;
    }

    saveLoggedUser(matchedUser);
    showMessage(messageBox, "Ingreso correcto. Redirigiendo...", "exito");
    setTimeout(function () {
      redirectToRoleDashboard(matchedUser.role);
    }, 600);
  });
}

function setupDashboardPage() {
  const currentPage = window.location.pathname.split("/").pop();
  const expectedRoleByPage = {
    "user-dashboard.html": "user",
    "coach-dashboard.html": "coach",
    "admin-dashboard.html": "admin"
  };

  const expectedRole = expectedRoleByPage[currentPage];
  if (!expectedRole) {
    return;
  }

  const storedUser = getStoredUser();
  if (!storedUser) {
    window.location.href = "login.html";
    return;
  }

  if (storedUser.role !== expectedRole) {
    redirectToRoleDashboard(storedUser.role);
    return;
  }

  const nameTargets = document.querySelectorAll("[data-user-name]");
  nameTargets.forEach(function (target) {
    target.textContent = storedUser.name || storedUser.user;
  });

  const emailTargets = document.querySelectorAll("[data-user-email]");
  emailTargets.forEach(function (target) {
    target.textContent = storedUser.user;
  });

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}

setupLoginPage();
setupDashboardPage();
