// ---------- 1. Selecionar elementos ----------
const modal      = document.getElementById('myModal');
const openBtn    = document.getElementById('openModalBtn');
const closeBtn   = document.getElementById('closeModalBtn');
const form       = document.getElementById('modalForm');

// Preenche o e-mail salvo, se houver
window.addEventListener('DOMContentLoaded', () => {
  const savedEmail = localStorage.getItem('gby_email');
  const rememberFlag = localStorage.getItem('gby_lembrar');

  if (savedEmail && form.elements['email']) {
    form.elements['email'].value = savedEmail;
  }

  const rememberCheckbox = document.getElementById('remember');
  if (rememberFlag === 'true' && rememberCheckbox) {
    rememberCheckbox.checked = true;
  }
});

// ---------- 2. Funções auxiliares ----------
function showError(input, msg) {
  const errorEl = input.parentElement.querySelector('.error-msg');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.style.visibility = 'visible';
  }
  input.classList.add('input-error');
}

function clearError(input) {
  const errorEl = input.parentElement.querySelector('.error-msg');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.visibility = 'hidden';
  }
  input.classList.remove('input-error');
}

function validateForm() {
  let isValid = true;

  // ----- E-mail (obrigatório + formato) -----
  const email = form.elements['email'];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    showError(email, 'O e-mail é obrigatório.');
    isValid = false;
  } else if (!emailPattern.test(email.value)) {
    showError(email, 'Informe um e-mail válido.');
    isValid = false;
  } else {
    clearError(email);
  }

  // ----- Senha (obrigatório) -----
  const senha = form.elements['senha'];
  if (!senha.value) {
    showError(senha, 'A senha é obrigatória.');
    isValid = false;
  } else {
    clearError(senha);
  }

  return isValid;
}

// ---------- 3. Controle do modal ----------
function openModal() {
  if (modal.showModal) {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}
function closeModal() {
  if (modal.close) {
    modal.close();
  } else {
    modal.removeAttribute('open');
  }
  form.reset();
  [...form.elements].forEach(el => {
    if (el.tagName === 'INPUT') clearError(el);
  });
}

// ---------- 4. Eventos ----------
if (openBtn) openBtn.addEventListener('click', openModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);

// Submissão do formulário (validação e API)
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (validateForm()) {
    const email = form.elements['email'].value.trim();
    const senha = form.elements['senha'].value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const resultado = await response.json();

      if (response.ok && resultado.sucesso) {
        // Trata o "Lembrar de mim"
        const rememberCheckbox = document.getElementById('remember');
        if (rememberCheckbox && rememberCheckbox.checked) {
          localStorage.setItem('gby_lembrar', 'true');
          localStorage.setItem('gby_email', email);
        } else {
          localStorage.removeItem('gby_lembrar');
          localStorage.removeItem('gby_email');
        }

        alert(resultado.mensagem);
        closeModal();
        window.location.href = '/app';
      } else {
        alert(resultado.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro de conexão com o servidor.');
    }
  } else {
    console.warn('Validação falhou.');
  }
});
