(function migrateLegacySession() {
  var hasUser = localStorage.getItem("user");
  var hasToken = localStorage.getItem("token");
  if (hasUser && !hasToken) {
    localStorage.removeItem("user");
  }
})();

var API_BASE_URL =
  (typeof window !== "undefined" && window.__API_BASE__) || "http://localhost:3000";

var roleRoutes = {
  user: "user-dashboard.html",
  coach: "coach-dashboard.html",
  admin: "admin-dashboard.html"
};

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return null;
  }
}

function getToken() {
  return localStorage.getItem("token");
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function mapApiUserToSession(apiUser) {
  return {
    user: normalizeEmail(apiUser.email),
    name: apiUser.full_name || apiUser.email,
    role: apiUser.role,
    id: apiUser.id
  };
}

function saveSession(token, apiUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(mapApiUserToSession(apiUser)));
}

function showMessage(container, message, type) {
  if (!container) {
    return;
  }

  container.textContent = message;
  container.className = "mensaje " + type;
}

function flattenApiErrors(errors) {
  if (!errors) {
    return "";
  }
  var parts = [];

  function walk(value) {
    if (typeof value === "string") {
      parts.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value && typeof value === "object") {
      Object.keys(value).forEach(function (key) {
        walk(value[key]);
      });
    }
  }

  walk(errors);
  return parts.join(" ");
}

function redirectToRoleDashboard(role) {
  var route = roleRoutes[role];
  if (route) {
    window.location.href = route;
  }
}

async function parseJsonResponse(response) {
  var text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return { ok: false, message: "Respuesta del servidor no válida." };
  }
}

function setupLoginPage() {
  var form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  var messageBox = document.getElementById("loginMessage");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var submitBtn = form.querySelector('[type="submit"]');

  var activeUser = getStoredUser();
  var token = getToken();
  if (activeUser && token && roleRoutes[activeUser.role]) {
    redirectToRoleDashboard(activeUser.role);
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = normalizeEmail(emailInput.value);
    var password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage(messageBox, "Completa correo y contraseña.", "error");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    showMessage(messageBox, "Validando credenciales...", "exito");

    fetch(API_BASE_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(parseJsonResponse)
      .then(function (body) {
        if (!body.ok || !body.data || !body.data.token || !body.data.user) {
          var msg =
            body.message ||
            flattenApiErrors(body.errors) ||
            "Correo o contraseña incorrectos.";
          showMessage(messageBox, msg, "error");
          return;
        }

        saveSession(body.data.token, body.data.user);
        showMessage(messageBox, "Ingreso correcto. Redirigiendo...", "exito");
        setTimeout(function () {
          redirectToRoleDashboard(body.data.user.role);
        }, 600);
      })
      .catch(function () {
        showMessage(
          messageBox,
          "No se pudo conectar con el servidor. ¿Está corriendo la API en " +
            API_BASE_URL +
            "?",
          "error"
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      });
  });
}

function buildRegisterMetadata(fields) {
  var meta = {
    sports: [],
    profile: {}
  };

  if (fields.edad !== "" && fields.edad !== null && fields.edad !== undefined) {
    meta.profile.age = Number(fields.edad);
  }
  if (fields.deportista) {
    meta.profile.practices_sport = fields.deportista;
  }
  if (fields.tipoDeporte && String(fields.tipoDeporte).trim()) {
    var sportName = String(fields.tipoDeporte).trim();
    meta.sports.push({
      name: sportName,
      frequency_per_week: 0
    });
    meta.profile.sport_type = sportName;
  }
  if (fields.objetivo && String(fields.objetivo).trim()) {
    meta.profile.goal = String(fields.objetivo).trim();
  }
  if (fields.nivel) {
    meta.profile.level = fields.nivel;
  }

  return meta;
}

function setupRegisterPage() {
  var form = document.getElementById("registerForm");
  if (!form) {
    return;
  }

  var messageBox = document.getElementById("registerMessage");
  var submitBtn = form.querySelector('[type="submit"]');

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var nombre = document.getElementById("nombre").value.trim();
    var email = normalizeEmail(document.getElementById("email").value);
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showMessage(messageBox, "Las contraseñas no coinciden.", "error");
      return;
    }

    if (password.length < 8) {
      showMessage(
        messageBox,
        "La contraseña debe tener al menos 8 caracteres (requisito del servidor).",
        "error"
      );
      return;
    }

    var payload = {
      full_name: nombre || "Usuario",
      email: email,
      password: password,
      metadata: buildRegisterMetadata({
        edad: document.getElementById("edad").value,
        deportista: document.getElementById("deportista").value,
        tipoDeporte: document.getElementById("tipoDeporte").value,
        objetivo: document.getElementById("objetivo").value,
        nivel: document.getElementById("nivel").value
      })
    };

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    showMessage(messageBox, "Enviando registro...", "exito");

    fetch(API_BASE_URL + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(parseJsonResponse)
      .then(function (body) {
        if (!body.ok) {
          var msg =
            body.message ||
            flattenApiErrors(body.errors) ||
            "No fue posible completar el registro.";
          showMessage(messageBox, msg, "error");
          return;
        }

        showMessage(
          messageBox,
          "Cuenta creada. Ya puedes iniciar sesión con tu correo y contraseña.",
          "exito"
        );
        form.reset();
        setTimeout(function () {
          window.location.href = "login.html";
        }, 1400);
      })
      .catch(function () {
        showMessage(
          messageBox,
          "No se pudo conectar con el servidor. ¿Está corriendo la API en " +
            API_BASE_URL +
            "?",
          "error"
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      });
  });
}

function bindDashboardUI(storedUser) {
  var nameTargets = document.querySelectorAll("[data-user-name]");
  nameTargets.forEach(function (target) {
    target.textContent = storedUser.name || storedUser.user;
  });

  var emailTargets = document.querySelectorAll("[data-user-email]");
  emailTargets.forEach(function (target) {
    target.textContent = storedUser.user;
  });
}

function setupDashboardPage() {
  var currentPage = window.location.pathname.split("/").pop();
  var expectedRoleByPage = {
    "user-dashboard.html": "user",
    "coach-dashboard.html": "coach",
    "admin-dashboard.html": "admin"
  };

  var expectedRole = expectedRoleByPage[currentPage];
  if (!expectedRole) {
    return;
  }

  var token = getToken();
  var storedUser = getStoredUser();

  if (!storedUser || !token) {
    window.location.href = "login.html";
    return;
  }

  if (storedUser.role !== expectedRole) {
    redirectToRoleDashboard(storedUser.role);
    return;
  }

  bindDashboardUI(storedUser);

  fetch(API_BASE_URL + "/api/auth/me", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("session");
      }
      return parseJsonResponse(response);
    })
    .then(function (body) {
      if (!body.ok || !body.data) {
        throw new Error("session");
      }
      saveSession(token, body.data);
      bindDashboardUI(getStoredUser());
    })
    .catch(function () {
      clearSession();
      window.location.href = "login.html";
    });

  var logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      clearSession();
      window.location.href = "login.html";
    });
  }
}

setupLoginPage();
setupRegisterPage();
setupDashboardPage();
