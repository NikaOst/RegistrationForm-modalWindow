const openModalBtn = document.querySelector('.openModalBtn');
const modal = document.querySelector('#modalReg');
const successWindow = document.querySelector('#successWindow');
const modalBody = document.querySelector('.modalBody');
const buttonExt = document.querySelector('#buttonExt');
const confBtn = document.querySelector('#confBtn');
const registrationForm = document.querySelector('.registrationForm');
const loader = document.querySelector('#loader');

const usernameLabel = document.querySelector('#usernameLabel');
const usernameInput = document.querySelector('.usernameInput');

const emailLabel = document.querySelector('#emailLabel');
const emailInput = document.querySelector('.emailInput');

const passwordLabel = document.querySelector('#passwordLabel');
const passwordInput = document.querySelector('.passwordInput');

const confPasswordLabel = document.querySelector('#confPasswordLabel');
const confPasswordInput = document.querySelector('.confPasswordInput');

const ageUserLabel = document.querySelector('#ageUserLabel');
const ageUserInput = document.querySelector('.ageUserInput');

const errorMessage = document.querySelector('#errorMessage');

function renderValidationStatus(parent, input, data) {
  if (parent.lastElementChild?.nodeName === 'P') {
    parent.lastElementChild.remove();
  }
  const statusMessageElement = document.createElement('p');
  parent.appendChild(statusMessageElement);
  if (data?.color && data?.text) {
    statusMessageElement.textContent = data.text;
    statusMessageElement.style.color = data.color;
    if (input) input.style.borderColor = data.color;
  } else if (input) {
    input.style.border = '2px solid gray';
  }
}

async function getUsers() {
  try {
    const data = await fetch('https://dummyjson.com/users', { method: 'GET' });
    if (!data) {
      throw new Error('Data not found');
    }
    return await data.json();
  } catch (error) {
    return error;
  }
}

async function addUser(user) {
  try {
    const data = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: user,
    });
    if (!data) {
      throw new Error('Data not found');
    }
    const createdUser = await data.json();
    const resTest = responseValidation(data.status);
    if (resTest.success) {
      return { createdUser, message: 'User was created' };
    } else return { error: resTest.error, messageError: resTest.messageError };
  } catch (error) {
    return error;
  }
}

// validation
function checkOnSymbol(value) {
  const symbols = ['-', '_', '*', '+', '$', '#', '^', '@'];
  let i = 0;
  while (i < symbols.length) {
    if (value.includes(symbols[i])) {
      return true;
    }
    ++i;
  }
  return false;
}

async function usernameValidation(value) {
  // для проверки - emilys уже существует
  const data = await getUsers();
  if (
    data.users.find((user) => {
      return user.username === value;
    }) !== undefined
  ) {
    return {
      text: 'Такой логин уже существует',
      color: 'red',
    };
  }
}

function passwordValidation(value) {
  const ckeckSymbol = checkOnSymbol(value);
  if (value.length < 6 || !ckeckSymbol) {
    return {
      text: 'Пароль должен быть более 6 символов и иметь специальные символы - _ * + $ # ^ @',
      color: 'red',
    };
  }
}

function passwordsEqual(pass, confPass) {
  if (pass !== confPass) {
    return { text: 'Пароли должны совпадать', color: 'red' };
  }
}

function emailValidation(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value))
    return {
      text: 'Эмейл должен совпадать с шаблоном email@domain.tld',
      color: 'red',
    };
  return emailPattern.test(value);
}

function ageValidation(value) {
  if (Number(value) < 18 || Number(value) > 100)
    return {
      text: 'Возраст должен быть в диапазоне от 18 до 100',
      color: 'red',
    };
}

function responseValidation(res) {
  if (res >= 200 && res <= 299) {
    return { success: true, error: null, messageError: null };
  } else if (res >= 400 && res <= 499) {
    return { success: false, error: `Error ${res}`, messageError: 'Server Error' };
  } else return { success: false, error: `Error ${res}`, messageError: 'Network Error' };
}

// modal window
const toggleModalWindow = () => {
  modal.classList.toggle('modalHidden');
};
const toggleSuccessWindow = () => {
  successWindow.classList.toggle('modalHidden');
};
const toggleLoader = () => {
  loader.classList.toggle('loader');
};

function renderWaitingFunc(btnStatus, btnText) {
  confBtn.disabled = btnStatus;
  toggleLoader();
  confBtn.textContent = btnText;
}

openModalBtn.addEventListener('click', toggleModalWindow);
modal.addEventListener('click', toggleModalWindow);
modalBody.addEventListener('click', (e) => e.stopPropagation());
buttonExt.addEventListener('click', toggleModalWindow);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.add('modalHidden');
  }
});
registrationForm.addEventListener('reset', toggleModalWindow);
registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const dataForm = new FormData(registrationForm);
  const newUser = {
    username: dataForm.get('username'),
    email: dataForm.get('email'),
    password: dataForm.get('password'),
    firstName: dataForm.get('firstName'),
    lastName: dataForm.get('lastName'),
    age: dataForm.get('age'),
  };

  renderWaitingFunc(true, 'Отправка...');
  const res = await addUser(JSON.stringify(newUser));
  renderWaitingFunc(false, 'Регистрация');

  if (res.message) {
    registrationForm.reset();
    console.log(res.createdUser);
    toggleSuccessWindow();
    setTimeout(() => {
      toggleSuccessWindow();
    }, 2000);
  } else {
    renderValidationStatus(errorMessage, null, {
      text: `${res.error}:${res.messageError}`,
      color: 'red',
    });
  }
});

// input events
emailInput.addEventListener('input', (event) => {
  const statusData = emailValidation(event.target.value);
  renderValidationStatus(emailLabel, emailInput, statusData);
});
passwordInput.addEventListener('input', (event) => {
  const statusData = passwordValidation(event.target.value);
  renderValidationStatus(passwordLabel, passwordInput, statusData);
});
confPasswordInput.addEventListener('input', (event) => {
  const statusData = passwordsEqual(event.target.value, passwordInput.value);
  renderValidationStatus(confPasswordLabel, confPasswordInput, statusData);
});
ageUserInput.addEventListener('input', (event) => {
  const statusData = ageValidation(event.target.value);
  renderValidationStatus(ageUserLabel, ageUserInput, statusData);
});
usernameInput.addEventListener('input', async (event) => {
  const statusData = await usernameValidation(event.target.value);
  renderValidationStatus(usernameLabel, usernameInput, statusData);
});
