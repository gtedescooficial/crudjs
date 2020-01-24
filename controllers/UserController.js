class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableId = document.getElementById(tableId);
        this.onSubmit();

    }

    onSubmit() {


        this.formEl.addEventListener('submit', event => {
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector('[type=submit]');
            btnSubmit.disabled = true;

            let user = this.getValues();

            if (!user) return false;

            user.photo = "";

            this.getPhoto().then(
                (content) => {
                    user.photo = content;
                    this.addLine(user);
                    this.updateCount();

                    this.formEl.reset();

                    btnSubmit.disabled = false;
                },
                e => {
                    console.error(e);
                })


        })
    }



    getPhoto() {

        return new Promise((resolve, reject) => {


            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter(item => {

                if (item.name === 'photo') {
                    return item;
                }

            });

            let file = elements[0].files[0];

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/avatar.png');
            }

            fileReader.onload = () => {

                let result = fileReader.result;

                resolve(result);
            };

            fileReader.onerror = (e) => {

                reject(e);
            }



        })
    }

    getValues() {

        let isValid = true;
        let user = {}
        let fields = [...this.formEl.elements];


        fields.forEach(e => {

            if (['name', 'email', 'password'].indexOf(e.name) > -1 && !e.value) {

                e.parentElement.classList.add('has-error');

                isValid = false;

            }



            if (e.name === 'gender') {
                if (e.checked) {
                    user[e.name] = e.value;
                }
            } else if (e.name === 'admin') {
                user[e.name] = e.checked;

            } else {
                user[e.name] = e.value;
            }


        })

        let objUser = new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.foto,
            user.admin);

        if (!isValid) {

            return false;

        } else {
            return objUser;
        }

    }

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;

        const arrayLista = [...this.tableId.children];
        arrayLista.forEach(tr => {
            numberUsers++;
            let u = JSON.parse(tr.dataset.user);
            if (u._admin) numberAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;
    }


    addLine(dataUser) {
        // montar lnha na tabela

        let tr = document.createElement("tr")

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
        <tr>
        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
        <td>${dataUser.name}</td>
        <td>${dataUser.email}</td>
        <td>${(dataUser.admin) ? 'Sim': 'Não'}</td>
        <td>${Utils.formatData(dataUser.register)}</td>
        <td>${dataUser.birth}</td>
        <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
        </td>
    </tr>
        `
        this.tableId.appendChild(tr)
    }

}