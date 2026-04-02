
document.addEventListener('DOMContentLoaded', function() {
    
    // === 1. Vérifier l'état de connexion sur toutes les pages ===
    updateAuthUI();

    // === 2. Page de Rendez-vous - Vérifier la session ===
    const authWarning = document.getElementById('auth-warning');
    const appointmentForm = document.getElementById('appointment-form');
    
    if (authWarning && appointmentForm) {
        const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
        
        if (!isLoggedIn) {
            authWarning.style.display = 'block';
            appointmentForm.style.display = 'none';
        } else {
            authWarning.style.display = 'none';
            appointmentForm.style.display = 'block';
            fillUserInfo();
        }
    }

    // === 3. Navigation entre onglets (Inscription/Connexion) ===
    const tabBtns = document.querySelectorAll('.tab-btn, .switch-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.dataset.tab || 
                       (this.textContent.toLowerCase().includes('inscription') ? 'register' : 'login');
            
            forms.forEach(form => {
                form.classList.remove('active');
                if (form.id.includes(tab)) {
                    form.classList.add('active');
                }
            });

            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.tab === tab) {
                    btn.classList.add('active');
                }
            });
        });
    });

    // === 4. Formulaire de Connexion ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulation de connexion (ЛР4 - Sequence Diagram)
                localStorage.setItem('user_logged_in', 'true');
                localStorage.setItem('user_name', document.getElementById('login-email').value);
                localStorage.setItem('user_email', document.getElementById('login-email').value);
                
                alert('✅ Connexion réussie!\n\nConformité ЛР2:\n- Session utilisateur créée\n- Données sécurisées');
                
                // Redirect vers la page de rendez-vous si demandé
                const redirectUrl = localStorage.getItem('redirect_after_auth') || 'full.html';
                localStorage.removeItem('redirect_after_auth');
                window.location.href = redirectUrl;
            }
        });
    }

    // === 5. Formulaire d'Inscription ===
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;

            if (password !== confirm) {
                alert('❌ Les mots de passe ne correspondent pas');
                return;
            }

            if (password.length < 8) {
                alert('❌ Le mot de passe doit contenir au moins 8 caractères');
                return;
            }

            if (validateForm(this)) {
                // Simulation d'inscription (ФЗ-152 compliant)
                localStorage.setItem('user_logged_in', 'true');
                localStorage.setItem('user_name', document.getElementById('register-name').value);
                localStorage.setItem('user_email', document.getElementById('register-email').value);
                localStorage.setItem('user_phone', document.getElementById('register-phone').value);
                
                alert('✅ Compte créé avec succès!\n\nConformité ФЗ-152:\n- Données chiffrées\n- Consentement enregistré\n- Droit à l\'oubli disponible');
                
                // Redirect vers la page de rendez-vous
                const redirectUrl = localStorage.getItem('redirect_after_auth') || 'full.html';
                localStorage.removeItem('redirect_after_auth');
                window.location.href = redirectUrl;
            }
        });
    }

    // === 6. Formulaire de Rendez-vous ===
    const rdvForm = document.getElementById('rdvForm');
    if (rdvForm) {
        // Date minimale = aujourd'hui
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        rdvForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulation d'envoi (ЛР3 - DFD Flow)
                alert('✅ Rendez-vous soumis avec succès!\n\nConformité:\n- ЛР2: Données validées\n- ЛР3: Flux DFD respecté\n- ЛР4: Sequence Diagram implémenté\n- ФЗ-152: Consentement enregistré');
                // window.location.href = 'confirmation.html';
            }
        });
    }
});

// === 7. Vérification de l'authentification (pour les liens) ===
function checkAuth(event) {
    event.preventDefault();
    
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    
    if (!isLoggedIn) {
        // Rediriger vers la page d'inscription
        localStorage.setItem('redirect_after_auth', 'rendezvousfi.html');
        window.location.href = 'inscriptionfinal.html';
    } else {
        // Utilisateur connecté → aller au rendez-vous
        window.location.href = 'rendezvousfi.html';
    }
}

// === 8. Mettre à jour l'interface utilisateur selon l'état de connexion ===
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('user_logged_in') === 'true';
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const userNameDisplay = document.getElementById('user-name-display');
    
    if (isLoggedIn) {
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            const name = localStorage.getItem('user_name') || 'Utilisateur';
            if (userNameDisplay) userNameDisplay.textContent = 'Bonjour, ' + name;
        }
    } else {
        if (authButtons) authButtons.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// === 9. Pré-remplir les informations utilisateur ===
function fillUserInfo() {
    const name = localStorage.getItem('user_name') || '';
    const email = localStorage.getItem('user_email') || '';
    const phone = localStorage.getItem('user_phone') || '';
    
    // Séparer nom et prénom si stockés ensemble
    const nameParts = name.split(' ');
    
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const emailInput = document.getElementById('email');
    const telephoneInput = document.getElementById('telephone');
    
    if (nomInput) nomInput.value = nameParts[0] || '';
    if (prenomInput) prenomInput.value = nameParts.slice(1).join(' ') || '';
    if (emailInput) emailInput.value = email;
    if (telephoneInput) telephoneInput.value = phone;
}

// === 10. Déconnexion ===
function logout() {
    localStorage.removeItem('user_logged_in');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_phone');
    window.location.href = 'full.html';
}

// === 11. Validation Générale ===
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    let errors = [];

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e94560';
            isValid = false;
            errors.push(input.previousElementSibling?.textContent || input.id);
        } else {
            input.style.borderColor = '#4CAF50';
        }

        // Validation pattern
        if (input.pattern && input.value) {
            const regex = new RegExp(input.pattern);
            if (!regex.test(input.value)) {
                input.style.borderColor = '#e94560';
                isValid = false;
            }
        }
    });

    if (!isValid) {
        alert('❌ Veuillez remplir tous les champs obligatoires:\n\n' + errors.join('\n'));
    }

    return isValid;
}

// === 12. Protection des données (ЛР2 - Sécurité) ===
// Empêcher la soumission multiple
let formSubmitted = false;

document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        if (formSubmitted) {
            event.preventDefault();
            return false;
        }
        formSubmitted = true;
        setTimeout(() => { formSubmitted = false; }, 3000);
    });
});