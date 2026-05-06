const validUsers = {
    "use.123@gmail.com": { password: "123456", role: "user", redirect: "Home.html" },
    "admin.123@gmail.com": { password: "123456", role: "admin", redirect: "admin.html" },
    "superadmin.123@gmail.com": { password: "123456", role: "superadmin", redirect: "super admin.html" }
};

function normalizeEmail(value) {
    return value.trim().toLowerCase();
}

function showAlert(message) {
    window.alert(message);
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const username = normalizeEmail(form.username.value || "");
    const password = (form.password.value || "").trim();

    if (!username || !password) {
        showAlert('Please enter username and password.');
        return;
    }

    const account = validUsers[username];
    if (!account || account.password !== password) {
        showAlert('Incorrect email or password.');
        return;
    }

    sessionStorage.setItem('userLoggedIn', 'true');
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('role', account.role);
    window.location.href = account.redirect;
}

function redirectAlreadyLoggedIn() {
    if (sessionStorage.getItem('userLoggedIn') === 'true') {
        const role = sessionStorage.getItem('role') || 'user';
        const target = role === 'admin' ? 'admin.html' : role === 'superadmin' ? 'super admin.html' : 'Home.html';
        const currentLocation = window.location.href.toLowerCase();
        if (!currentLocation.includes(target.toLowerCase())) {
            window.location.href = target;
        }
    }
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        return;
    }
    loginForm.addEventListener('submit', handleLoginSubmit);
    redirectAlreadyLoggedIn();
}

function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) {
        return;
    }
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();
        showAlert('Thank you for your feedback!');
        feedbackForm.reset();
    });
}

function logoutUser(event) {
    if (event) {
        event.preventDefault();
    }
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    window.location.href = 'loginPage.html';
}

function initLogoutLinks() {
    const logoutLinks = document.querySelectorAll('.logout-link, #logout-btn');
    if (!logoutLinks.length) {
        return;
    }
    logoutLinks.forEach(link => {
        link.addEventListener('click', logoutUser);
    });
}

function displayUserGreeting() {
    const greetingElement = document.getElementById('userGreeting');
    if (!greetingElement) {
        return;
    }
    const username = sessionStorage.getItem('username');
    greetingElement.textContent = username ? `Welcome, ${username}` : 'Welcome to Uni-Navigate';
}

function checkLogin(allowedRoles = ['user', 'admin', 'superadmin']) {
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'loginPage.html';
        return;
    }

    const role = sessionStorage.getItem('role') || 'user';
    if (!allowedRoles.includes(role)) {
        window.location.href = 'Home.html';
    }
}

function initPageChecks() {
    if (document.body.classList.contains('admin-page')) {
        checkLogin(['admin', 'superadmin']);
    }

    if (document.body.classList.contains('superadmin-page')) {
        checkLogin(['superadmin']);
    }

    if (document.body.classList.contains('home-page')) {
        checkLogin(['user', 'admin', 'superadmin']);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    initLoginPage();
    initFeedbackForm();
    initLogoutLinks();
    displayUserGreeting();
    initPageChecks();
});

window.checkLogin = checkLogin;
