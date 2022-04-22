const animalForm = document.getElementById('animal-form');
const fields = document.querySelectorAll('#animal-form .form-field');
const animalTbody = document.getElementById('animal-table');
const contentButtons = document.getElementById('content-buttons');
const addButton = document.getElementById('add-animal');
addButton.addEventListener('click', animalFormAction);

let animalFormMode = 'create';
let animalIndex = undefined;

let currentAnimal = {
  name: '',
  age: '',
  animal: '',
  species: '',
  birthDate: '',
};

function validate(event) {
  const { name, value } = event.target;
  currentAnimal[name] = value;
}

fields.forEach((field) => {
  field.addEventListener('input', validate);
});

function animalFormAction() {
  switch (animalFormMode) {
    case 'create':
      createAnimal();
      break;
    case 'update':
      updateAnimal();
      break;
    default:
      break;
  }
}

function changeActionAnimalButton() {
  switch (animalFormMode) {
    case 'create':
      addButton.innerText = 'Agregar';
      addButton.className = 'btn btn-primary';
      break;
    case 'update':
      addButton.innerText = 'Actualizar';
      addButton.className = 'btn btn-info text-white';
      break;
    default:
      break;
  }
}

function cancelAnimalActionButton() {
  switch (animalFormMode) {
    case 'create':
      document.getElementById('cancel-button').remove();
      break;
    case 'update':
      if (document.getElementById('cancel-button') !== null) {
        return;
      }
      const cancelButton = document.createElement('button');
      cancelButton.id = 'cancel-button';
      cancelButton.className = 'btn btn-secondary';
      cancelButton.innerText = 'Cancelar';
      cancelButton.addEventListener('click', () => {
        cancelButton.remove();
        animalForMode = 'create';
        animalForm.reset();
        changeActionAnimalButton();
      });
      contentButtons.appendChild(cancelButton);
      break;
    default:
      break;
  }
}

function createAnimal() {
  animals.push(Object.assign({}, currentAnimal));
  listAnimals();
  animalForm.reset();
}

function updateAnimal() {
  animals[animalIndex] = Object.assign({}, currentAnimal);
  listAnimals();
  animalForm.reset();
  animalFormMode = 'create';
  changeActionAnimalButton();
  cancelAnimalActionButton();
}

function deleteAnimal(index) {
  animals = animals.filter((_, i) => {
    return i !== index;
  });
  listAnimals();
}

function loadAnimalInForm(index) {
  animalFormMode = 'update';
  animalIndex = index;
  currentAnimal = Object.assign({}, animals[index]);

  fields.forEach((field) => {
    field.value = currentAnimal[field.name];
  });
  changeActionAnimalButton();
  cancelAnimalActionButton();
}

const modalHtmlElement = document.getElementById('view-animal');
const boostrapModal = new bootstrap.Modal(modalHtmlElement);

function showAnimal(index) {
  const modalTitle = document.querySelector('#view-animal .modal-title');
  const modalBody = document.querySelector('#view-animal .modal-body');
  boostrapModal.show();
  modalBody.innerHTML = `
      <ul>
        <li><b>Nombre:</b> ${animals[index].name}</li>
        <li><b>Edad:</b> ${animals[index].age}</li>
        <li><b>Animal:</b> ${animals[index].animal}</li>
        <li><b>Especie:</b> ${animals[index].species}</li>
        <li><b>Fecha de nacimiento:</b> ${animals[index].birthDate}</li>
    </ul>
      `;
  modalTitle.innerText = animals[index].name;
}

function listAnimals() {
  animalTbody.innerHTML = '';

  animals.forEach((animal, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${index + 1}</th>
            <td>${animal.name}</td>
            <td>${animal.age}</td>
            <td>${animal.animal}</td>
            <td>${animal.species}</td>
            <td>${animal.birthDate}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="loadAnimalInForm(${index})">
                    Editar
                    </button>
                <button
                    type="button"
                    class="btn btn-info text-white"
                    onclick="showAnimal(${index})">
                    Ver registro
                    </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteAnimal(${index})">
                    Eliminar
                    </button>
            </td>
        `;
    animalTbody.appendChild(row);
  });
}
listAnimals();
