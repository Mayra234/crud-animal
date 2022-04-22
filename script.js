let animals = [];
const animalApi = useAnimalApi();
const animalForm = document.getElementById('animal-form');
const fields = document.querySelectorAll('#animal-form .form-field');
const animalTbody = document.getElementById('animal-table');
const contentButtons = document.getElementById('content-buttons');
const addButton = document.getElementById('add-animal');
addButton.addEventListener('click', animalFormAction);

const loader = document.getElementById('loader');

const handleLoader = (status) => {
  switch (status) {
    case 'show':
      loader.style.display = 'flex';
      break;
    case 'hide':
      loader.style.display = 'none';
      break;
    default:
      break;
  }
};

let animalFormMode = 'create';
let animalId = undefined;

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
      } else {
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-button';
        cancelButton.className = 'btn btn-secondary';
        cancelButton.innerText = 'Cancelar';
        cancelButton.type = 'button';
        cancelButton.addEventListener('click', () => {
          cancelButton.remove();
          animalFormMode = 'create';
          animalForm.reset();
          changeActionAnimalButton();
        });
        contentButtons.appendChild(cancelButton);
      }

      break;
    default:
      break;
  }
}

async function createAnimal() {
  handleLoader('show');
  const animal = await animalApi.create(currentAnimal);
  animals.push({ ...animal });
  listAnimals();
  animalForm.reset();
  handleLoader('hide');
}

async function updateAnimal() {
  handleLoader('show');
  const animal = await animalApi.update(animalId, currentAnimal);
  animals = animals.map((item) => {
    if (item.id === animalId) {
      return { ...animal };
    }

    return item;
  });
  listAnimals();
  animalForm.reset();
  animalFormMode = 'create';
  changeActionAnimalButton();
  cancelAnimalActionButton();
  handleLoader('hide');
}

async function deleteAnimal(id) {
  handleLoader('show');
  await animalApi.remove(id);
  animals = animals.filter((animal) => {
    return animal.id !== id;
  });
  listAnimals();
  handleLoader('hide');
}

function loadAnimalInForm(id) {
  animalFormMode = 'update';
  animalId = id;
  currentAnimal = animals.find((animal) => animal.id === id);

  fields.forEach((field) => {
    field.value = currentAnimal[field.name];
  });
  changeActionAnimalButton();
  cancelAnimalActionButton();
}

const modalHtmlElement = document.getElementById('view-animal');
const boostrapModal = new bootstrap.Modal(modalHtmlElement);

async function showAnimal(id) {
  handleLoader('show');
  const animal = await animalApi.read(id);
  //Llamar el api para mostrar el animal
  const modalTitle = document.querySelector('#view-animal .modal-title');
  const modalBody = document.querySelector('#view-animal .modal-body');
  boostrapModal.show();
  modalBody.innerHTML = `
      <ul>
        <li><b>Nombre:</b> ${animal.name}</li>
        <li><b>Edad:</b> ${animal.age}</li>
        <li><b>Animal:</b> ${animal.animal}</li>
        <li><b>Especie:</b> ${animal.species}</li>
        <li><b>Fecha de nacimiento:</b> ${animal.birthDate}</li>
        <li><b>Descripción:</b><p>${animal.description}</p></li>
    </ul>
      `;
  modalTitle.innerText = animal.name;
  handleLoader('hide');
}

async function listAnimals(firstLoad) {
  handleLoader('show');
  animalTbody.innerHTML = '';
  if (firstLoad) animals = await animalApi.list();
  animals.forEach((animal) => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <th scope="row">${animal.id}</th>
            <td>${animal.name}</td>
            <td>${animal.age}</td>
            <td>${animal.animal}</td>
            <td>${animal.species}</td>
            <td>${animal.birthDate}</td>
            <td>
                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="loadAnimalInForm(${animal.id})">
                    Editar
                    </button>
                <button
                    type="button"
                    class="btn btn-info text-white"
                    onclick="showAnimal(${animal.id})">
                    Ver registro
                    </button>
                <button
                    type="button"
                    class="btn btn-danger"
                    onclick="deleteAnimal(${animal.id})">
                    Eliminar
                    </button>
            </td>
        `;
    animalTbody.appendChild(row);
  });
  handleLoader('hide');
}
listAnimals(true);
