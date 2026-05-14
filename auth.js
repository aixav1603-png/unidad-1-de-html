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

var adminUsersCache = [];

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

function getAuthHeaders(includeJson) {
  var headers = {};
  var token = getToken();
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  if (includeJson !== false) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

function fetchApi(path, options) {
  return fetch(API_BASE_URL + path, options).then(parseJsonResponse);
}

function extractPayloadFromProfileForm() {
  var profilePassword = document.getElementById('profilePassword').value;
  var confirmPassword = document.getElementById('profileConfirmPassword').value;

  if (profilePassword && profilePassword !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  var payload = {
    full_name: document.getElementById('profileFullName').value.trim(),
    email: normalizeEmail(document.getElementById('profileEmail').value),
    metadata: buildRegisterMetadata({
      edad: document.getElementById('profileAge').value,
      deportista: document.getElementById('profileSports').value,
      tipoDeporte: document.getElementById('profileSportType').value,
      objetivo: document.getElementById('profileGoal').value,
      nivel: document.getElementById('profileLevel').value
    })
  };

  if (profilePassword) {
    if (profilePassword.length < 8) {
      return { error: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    payload.password = profilePassword;
  }

  return { data: payload };
}

function fillProfileEditForm(user) {
  var profileMeta = user.metadata || {};
  var profileData = profileMeta.profile || {};

  document.getElementById('profileFullName').value = user.full_name || '';
  document.getElementById('profileEmail').value = user.email || '';
  document.getElementById('profilePassword').value = '';
  document.getElementById('profileConfirmPassword').value = '';
  document.getElementById('profileAge').value = profileData.age || '';
  document.getElementById('profileSports').value = profileData.practices_sport || '';
  document.getElementById('profileSportType').value = profileData.sport_type || '';
  document.getElementById('profileGoal').value = profileData.goal || '';
  document.getElementById('profileLevel').value = profileData.level || '';
}

function toggleProfileEditor(show) {
  var panel = document.getElementById('profileEditPanel');
  if (!panel) {
    return;
  }
  panel.style.display = show ? '' : 'none';
}

function updateProfileHeader(user) {
  if (!user) return;
  var goalItem = document.querySelector('[data-user-goal]');
  if (goalItem) {
    var profileData = (user.metadata && user.metadata.profile) || {};
    goalItem.textContent = profileData.goal || 'No hay objetivos registrados todavía.';
  }
}

function showProfileMessage(message, type) {
  showMessage(document.getElementById('profileEditMessage'), message, type);
}

function setupProfileEditor(user) {
  var editButton = document.getElementById('editProfileButton');
  var profileForm = document.getElementById('profileEditForm');
  if (!editButton || !profileForm || !user) {
    return;
  }

  fillProfileEditForm(user);
  editButton.addEventListener('click', function () {
    var panel = document.getElementById('profileEditPanel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'none' ? '' : 'none';
  });

  profileForm.addEventListener('submit', function (event) {
    event.preventDefault();

    var payloadResult = extractPayloadFromProfileForm();
    if (payloadResult.error) {
      showProfileMessage(payloadResult.error, 'error');
      return;
    }

    var payload = payloadResult.data;
    if (!payload.full_name) {
      showProfileMessage('El nombre completo es obligatorio.', 'error');
      return;
    }
    if (!payload.email) {
      showProfileMessage('El correo es obligatorio.', 'error');
      return;
    }

    var token = getToken();
    var messageBox = document.getElementById('profileEditMessage');
    var submitButton = profileForm.querySelector('[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }
    showProfileMessage('Guardando cambios...', 'info');

    fetchApi('/api/users/' + getStoredUser().id, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload)
    })
      .then(function (body) {
        if (!body.ok || !body.data) {
          throw new Error(body.message || flattenApiErrors(body.errors) || 'No fue posible actualizar el perfil.');
        }

        saveSession(getToken(), body.data);
        bindDashboardUI(getStoredUser());
        updateProfileHeader(body.data);
        fillProfileEditForm(body.data);
        showProfileMessage('Perfil actualizado correctamente.', 'exito');
      })
      .catch(function (error) {
        showProfileMessage(error.message || 'Error en la actualización del perfil.', 'error');
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
}

function buildUserMetadata(fields) {
  return buildRegisterMetadata(fields);
}

function renderAdminUsers(users) {
  adminUsersCache = Array.isArray(users) ? users : [];
  var cardsContainer = document.getElementById('adminUserCards');
  var tableBody = document.getElementById('adminUserTableBody');

  if (cardsContainer) {
    cardsContainer.innerHTML = '';
    if (adminUsersCache.length === 0) {
      cardsContainer.innerHTML = '<div><span>No hay usuarios registrados.</span></div>';
    }

    adminUsersCache.forEach(function (user) {
      var userRow = document.createElement('div');
      userRow.innerHTML = '<span>' + user.full_name + ' (' + user.role + ')</span>' +
        '<div>' +
        '<button class="btn-secundario admin-edit" data-user-id="' + user.id + '">Editar</button>' +
        '<button class="btn-secundario admin-delete" data-user-id="' + user.id + '">Eliminar</button>' +
        '</div>';
      cardsContainer.appendChild(userRow);
    });
  }

  if (tableBody) {
    tableBody.innerHTML = '';
    adminUsersCache.forEach(function (user) {
      var row = document.createElement('tr');
      row.innerHTML =
        '<td>' + user.full_name + '</td>' +
        '<td>' + user.email + '</td>' +
        '<td>' + user.role + '</td>' +
        '<td>' +
        '<button class="btn-secundario admin-edit" data-user-id="' + user.id + '">Editar</button> ' +
        '<button class="btn-secundario admin-delete" data-user-id="' + user.id + '">Eliminar</button>' +
        '</td>';
      tableBody.appendChild(row);
    });
  }
}

function filterAdminUsers(query) {
  query = String(query || '').trim().toLowerCase();
  if (!query) {
    renderAdminUsers(adminUsersCache);
    return;
  }

  var filtered = adminUsersCache.filter(function (user) {
    return (
      String(user.full_name || '').toLowerCase().includes(query) ||
      String(user.email || '').toLowerCase().includes(query) ||
      String(user.role || '').toLowerCase().includes(query)
    );
  });

  renderAdminUsers(filtered);
}

function fillAdminUserForm(user) {
  document.getElementById('adminUserId').value = user ? user.id : '';
  document.getElementById('adminFullName').value = user ? user.full_name : '';
  document.getElementById('adminEmail').value = user ? user.email : '';
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminConfirmPassword').value = '';
  document.getElementById('adminRole').value = user ? user.role : 'user';

  var profileData = (user && user.metadata && user.metadata.profile) || {};
  document.getElementById('adminAge').value = profileData.age || '';
  document.getElementById('adminSports').value = profileData.practices_sport || '';
  document.getElementById('adminSportType').value = profileData.sport_type || '';
  document.getElementById('adminGoal').value = profileData.goal || '';
  document.getElementById('adminLevel').value = profileData.level || '';

  var title = user ? 'Editar usuario' : 'Crear usuario';
  document.getElementById('adminFormTitle').textContent = title;
  document.getElementById('adminFormMessage').textContent = '';
}

function openAdminEditor(user) {
  var panel = document.getElementById('adminEditorPanel');
  if (!panel) return;
  fillAdminUserForm(user || null);
  panel.style.display = '';
  panel.scrollIntoView({ behavior: 'smooth' });
}

function closeAdminEditor() {
  var panel = document.getElementById('adminEditorPanel');
  if (!panel) return;
  panel.style.display = 'none';
}

function extractAdminFormPayload() {
  var id = document.getElementById('adminUserId').value;
  var nombre = document.getElementById('adminFullName').value.trim();
  var email = normalizeEmail(document.getElementById('adminEmail').value);
  var password = document.getElementById('adminPassword').value;
  var confirmPassword = document.getElementById('adminConfirmPassword').value;
  var role = document.getElementById('adminRole').value;

  if (!nombre) {
    return { error: 'El nombre completo es obligatorio.' };
  }
  if (!email) {
    return { error: 'El correo es obligatorio.' };
  }

  if (password && password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' };
  }
  if (password && password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' };
  }

  var payload = {
    full_name: nombre,
    email: email,
    role: role,
    metadata: buildRegisterMetadata({
      edad: document.getElementById('adminAge').value,
      deportista: document.getElementById('adminSports').value,
      tipoDeporte: document.getElementById('adminSportType').value,
      objetivo: document.getElementById('adminGoal').value,
      nivel: document.getElementById('adminLevel').value
    })
  };

  if (password) {
    payload.password = password;
  }

  return { data: payload, id: id };
}

function showAdminMessage(message, type) {
  showMessage(document.getElementById('adminFormMessage'), message, type);
}

function refreshAdminUsers() {
  var tableBody = document.getElementById('adminUserTableBody');
  var cardsContainer = document.getElementById('adminUserCards');
  if (!tableBody && !cardsContainer) {
    return;
  }

  fetchApi('/api/users', { headers: getAuthHeaders(false) })
    .then(function (body) {
      if (!body.ok || !body.data) {
        throw new Error(body.message || 'No se pudo obtener el listado de usuarios.');
      }
      renderAdminUsers(body.data);
    })
    .catch(function (error) {
      var messageBox = document.getElementById('adminMessage');
      showMessage(messageBox, error.message || 'Error al cargar usuarios.', 'error');
    });
}

function setupAdminDashboard() {
  var searchInput = document.getElementById('adminSearchInput');
  var createButton = document.getElementById('createUserButton');
  var adminForm = document.getElementById('adminUserForm');
  var cancelButton = document.getElementById('adminCancelButton');
  var cardsContainer = document.getElementById('adminUserCards');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      filterAdminUsers(this.value);
    });
  }

  if (createButton) {
    createButton.addEventListener('click', function () {
      openAdminEditor(null);
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var payloadResult = extractAdminFormPayload();
      if (payloadResult.error) {
        showAdminMessage(payloadResult.error, 'error');
        return;
      }

      var id = payloadResult.id;
      var method = id ? 'PUT' : 'POST';
      var path = '/api/users' + (id ? '/' + id : '');
      var targetMessage = document.getElementById('adminFormMessage');
      var submitButton = adminForm.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
      }
      showMessage(targetMessage, id ? 'Actualizando usuario...' : 'Creando usuario...', 'info');

      fetchApi(path, {
        method: method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payloadResult.data)
      })
        .then(function (body) {
          if (!body.ok) {
            throw new Error(body.message || flattenApiErrors(body.errors) || 'No se pudo guardar el usuario.');
          }
          showMessage(targetMessage, body.message, 'exito');
          closeAdminEditor();
          refreshAdminUsers();
        })
        .catch(function (error) {
          showMessage(targetMessage, error.message || 'Error al guardar el usuario.', 'error');
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
          }
        });
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      closeAdminEditor();
    });
  }

  if (cardsContainer) {
    cardsContainer.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (!button) return;
      var id = button.dataset.userId;
      if (!id) return;
      var user = adminUsersCache.find(function (item) {
        return String(item.id) === String(id);
      });
      if (button.classList.contains('admin-edit')) {
        openAdminEditor(user);
        return;
      }
      if (button.classList.contains('admin-delete')) {
        if (!window.confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
          return;
        }
        fetchApi('/api/users/' + id, {
          method: 'DELETE',
          headers: getAuthHeaders(false)
        })
          .then(function (body) {
            if (!body.ok) {
              throw new Error(body.message || 'No se pudo eliminar el usuario.');
            }
            refreshAdminUsers();
          })
          .catch(function (error) {
            showMessage(document.getElementById('adminMessage'), error.message || 'Error al eliminar usuario.', 'error');
          });
      }
    });
  }

  refreshAdminUsers();
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
      updateProfileHeader(body.data);
      setupProfileEditor(body.data);
      if (expectedRole === 'admin') {
        setupAdminDashboard();
      }
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
