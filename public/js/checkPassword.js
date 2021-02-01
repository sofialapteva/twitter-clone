const registerForm = document.forms.registerForm;
let password = document.forms.registerForm.password;
let passwordCheck = document.forms.registerForm.passwordCheck;
let error = document.querySelector('#error');

[password, passwordCheck].forEach(el => el.addEventListener('input', (e) => {
  if (password.value !== passwordCheck.value) {
    error.innerHTML = 'Пароли не совпадают';
  } else {
    error.innerHTML = '';
  }
}))
