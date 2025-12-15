const openModalBtn = document.querySelector('.openModalBtn');
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modalBody');
const buttonExt = document.querySelector('#buttonExt');
const confBtn = document.querySelector('#confBtn');
const registrationForm = document.querySelector('.registrationForm');

const usernameLabel = document.querySelector('#usernameLabel');
const usernameInput = document.querySelector('.usernameInput');

const emailLabel = document.querySelector('#emailLabel');
const emailInput = document.querySelector('.emailInput');

const passwordLabel = document.querySelector('#passwordLabel');
const passwordInput = document.querySelector('.passwordInput');

const confPasswordLabel = document.querySelector('#confPasswordLabel');
const confPasswordInput = document.querySelector('.confPasswordInput');

// const firstNameLabel = document.querySelector('#firstNameLabel');
// const firstNameInput = document.querySelector('.firstNameInput');

// const lastNameLabel = document.querySelector('#lastNameLabel');
// const lastNameInput = document.querySelector('.lastNameInput');

const ageUserLabel = document.querySelector('#ageUserLabel');
const ageUserInput = document.querySelector('.ageUserInput');

function renderStatusMessage(parent, data) {
  if (parent.lastElementChild.nodeName === 'P') {
    parent.lastElementChild.remove();
  }
  const statusMessageElement = document.createElement('p');
  parent.appendChild(statusMessageElement);
  statusMessageElement.textContent = data.text;
  statusMessageElement.style.color = data.color;
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
      text: 'username is already taken',
      color: 'red',
    };
  } else {
    return {
      text: 'username is correct',
      color: 'green',
    };
  }
}

function passwordValidation(value) {
  const ckeckSymbol = checkOnSymbol(value);
  return value.length >= 6 && ckeckSymbol
    ? {
        text: 'password is correct',
        color: 'green',
      }
    : {
        text: 'password is invalid',
        color: 'red',
      };
}

function passwordsEqual(pass, confPass) {
  if (pass !== confPass) {
    return { text: 'password is invalid', color: 'red' };
  } else return { text: 'Пароли должны совпадать', color: 'green' };
}

function emailValidation(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value)
    ? {
        text: 'email is correct',
        color: 'green',
      }
    : {
        text: 'email is invalid',
        color: 'red',
      };
}

function ageValidation(value) {
  return Number(value) >= 10 && Number(value) <= 100
    ? {
        text: 'age is correct',
        color: 'green',
      }
    : {
        text: 'age is invalid',
        color: 'red',
      };
}

// modal window
const toggleModalWindow = () => {
  modal.classList.toggle('modalHidden');
};
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

// input events
emailInput.addEventListener('input', (event) => {
  const statusData = emailValidation(event.target.value);
  renderStatusMessage(emailLabel, statusData);
});
passwordInput.addEventListener('input', (event) => {
  const statusData = passwordValidation(event.target.value);
  renderStatusMessage(passwordLabel, statusData);
});
confPasswordInput.addEventListener('input', (event) => {
  const statusData = passwordsEqual(event.target.value, passwordInput.value);
  renderStatusMessage(confPasswordLabel, statusData);
});
ageUserInput.addEventListener('input', (event) => {
  const statusData = ageValidation(event.target.value);
  renderStatusMessage(ageUserLabel, statusData);
});
usernameInput.addEventListener('input', async (event) => {
  const statusData = await usernameValidation(event.target.value);
  console.log(statusData);
  renderStatusMessage(usernameLabel, statusData);
});
