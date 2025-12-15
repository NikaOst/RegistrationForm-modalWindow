const openModalBtn = document.querySelector('.openModalBtn');
const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modalBody');
const buttonExt = document.querySelector('#buttonExt');
const registrationForm = document.querySelector('.registrationForm');

const usernameLabel = document.querySelector('#usernameLabel');
const usernameInput = document.querySelector('.usernameInput');

const emailLabel = document.querySelector('#emailLabel');
const emailInput = document.querySelector('.emailInput');

const passwordLabel = document.querySelector('#passwordLabel');
const passwordInput = document.querySelector('.passwordInput');

const confPasswordLabel = document.querySelector('#confPasswordLabel');
const confPasswordInput = document.querySelector('.confPasswordInput');

const firstNameLabel = document.querySelector('#firstNameLabel');
const firstNameInput = document.querySelector('.firstNameInput');

const lastNameLabel = document.querySelector('#lastNameLabel');
const lastNameInput = document.querySelector('.lastNameInput');

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

// function usernameValidation(value) {
//   return value.length >= 2 && value.length <= 26
//     ? {
//         text: 'user name is correct',
//         color: 'green',
//       }
//     : {
//         text: 'user name is invalid',
//         color: 'red',
//       };
// }

const toggleModalWindow = () => {
  modal.classList.toggle('modalHidden');
};
openModalBtn.addEventListener('click', toggleModalWindow);
modal.addEventListener('click', toggleModalWindow);
modalBody.addEventListener('click', (e) => e.stopPropagation());
// button
buttonExt.addEventListener('click', toggleModalWindow);
// esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    modal.classList.add('modalHidden');
  }
});

registrationForm.addEventListener('reset', toggleModalWindow);
