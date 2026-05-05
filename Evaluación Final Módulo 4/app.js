class UserManager {
  constructor(url) {
    this.users = [];
    this.loaded = false;

    this.loader = document.getElementById("loader");
    this.output = document.getElementById("output");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        this.users = JSON.parse(xhr.responseText);
        this.loaded = true;

        this.loader.style.display = "none";
        this.output.style.display = "flex";

        this.printAlert("Datos cargados correctamente ✅", "success");
      }
    };

    xhr.send();
  }

  isReady() {
    if (!this.loaded) {
      this.printAlert("Esperando datos...", "warning");
      return false;
    }
    return true;
  }

  clear() {
    this.output.innerHTML = "";
  }

  printAlert(text, type) {
    this.output.innerHTML = `
      <div class="col-12">
        <div class="alert alert-${type}">
          ${text}
        </div>
      </div>
    `;
  }

  createCard(title, content) {
    const card = `
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${content}</p>
          </div>
        </div>
      </div>
    `;
    this.output.innerHTML += card;
  }

  getUserInput() {
    const input = prompt("Ingrese el nombre del usuario:");
    if (!input) return null;
    return input.toLowerCase().trim();
  }

  listNames() {
    if (!this.isReady()) return;
    this.clear();

    this.users.forEach(u => {
      this.createCard(u.name, "Usuario registrado");
    });
  }

  findUserByName() {
    if (!this.isReady()) return;
    this.clear();

    const name = this.getUserInput();
    if (!name) return;

    const user = this.users.find(u => u.name.toLowerCase() === name);

    if (user) {
      this.createCard(user.name, `
        Usuario: ${user.username}<br>
        Email: ${user.email}
      `);
    } else {
      this.printAlert("Usuario no encontrado", "danger");
    }
  }

  showAddress() {
    if (!this.isReady()) return;
    this.clear();

    const name = this.getUserInput();
    if (!name) return;

    const user = this.users.find(u => u.name.toLowerCase() === name);

    if (user) {
      const a = user.address;
      this.createCard(user.name, `
        ${a.street}, ${a.suite}<br>
        ${a.city}<br>
        Zip: ${a.zipcode}
      `);
    } else {
      this.printAlert("Usuario no encontrado", "danger");
    }
  }

  showAdvancedInfo() {
    if (!this.isReady()) return;
    this.clear();

    const name = this.getUserInput();
    if (!name) return;

    const user = this.users.find(u => u.name.toLowerCase() === name);

    if (user) {
      this.createCard(user.name, `
        Tel: ${user.phone}<br>
        Web: ${user.website}<br>
        Empresa: ${user.company.name}<br>
        "${user.company.catchPhrase}"
      `);
    } else {
      this.printAlert("Usuario no encontrado", "danger");
    }
  }

  listCompanies() {
    if (!this.isReady()) return;
    this.clear();

    this.users.forEach(u => {
      this.createCard(u.company.name, `"${u.company.catchPhrase}"`);
    });
  }

  listNamesSorted() {
    if (!this.isReady()) return;
    this.clear();

    const sorted = [...this.users].sort((a,b) =>
      a.name.localeCompare(b.name)
    );

    sorted.forEach(u => {
      this.createCard(u.name, "Ordenado alfabéticamente");
    });
  }
}

const manager = new UserManager("https://jsonplaceholder.typicode.com/users");