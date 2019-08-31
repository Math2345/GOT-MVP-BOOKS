class TableView {
    constructor() {
        this._container = document.getElementsByClassName('container')[0];
    }

    createTBody(objectArray, fields, callback) {
        const tbody = document.createElement('tbody');

        objectArray.forEach((object) => {
            const tr = document.createElement('tr');

            fields.forEach((field) => {
                const td = document.createElement('td');

                if (callback) {
                    callback(td, field, object);
                } else {
                    td.appendChild(document.createTextNode(object[field]));
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        return tbody
    }

    searchElem(name) {
        return document.getElementsByTagName(name);
    }

    deleteTBody() {
        const table = this.searchElem('table');
        const tbody = this.searchElem('tbody');

        table[0].removeChild(tbody[0]);
    }

    createTable(objectArray, fields, fieldTitles, callback) {

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const thr = document.createElement('tr');

        fieldTitles.forEach((fieldTitle, index) => {
            const th = document.createElement('th');
            th.setAttribute('data-name', fields[index]);

            th.appendChild(document.createTextNode(fieldTitle));
            thr.appendChild(th);
        });

        thead.appendChild(thr);
        table.appendChild(thead);

        const tbody = this.createTBody(objectArray, fields, callback);

        table.appendChild(tbody);

        this._container.appendChild(table);

        return table;
    }

    bindToggleButtonSorting(callback) {
        const tr = document.getElementsByTagName('tr')[0];
        tr.addEventListener("click", callback);
    }

    bindToggleCharacters(callback) {
        const tr = Array.from(document.getElementsByTagName('tr')).slice(1);

        for (let i = 0; i < tr.length; i++) {
            const cell = tr[i].cells;
            cell[cell.length - 1].children[0].addEventListener('click', callback);
        }
    }
}

class ModalView {
    constructor() {
       this._modal = document.getElementsByClassName('modal')[0];
       this._closeModal = document.getElementsByClassName('modal__close')[0];
       this._select = document.getElementsByClassName('modal__select')[0];
    }


    addModal() {
        this._modal.style.display = 'inline-block';
    }

    hideModal() {
        this._modal.style.display = 'none';
    }

    deleteTBody() {
        const table = document.querySelector(".table-modal");
        const tbody = document.querySelector(".tbody-modal");

        table.removeChild(tbody);
    }

    createTBody(objectArray, fields, callback) {
        const tbody = document.createElement('tbody');

        tbody.setAttribute("class", "tbody-modal");

        objectArray.forEach((object) => {
            const tr = document.createElement('tr');

            fields.forEach((field) => {
                const td = document.createElement('td');

                if (callback) {
                    callback(td, field, object);
                } else {
                    td.appendChild(document.createTextNode(object[field]));
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        return tbody
    }


    createModal(objectArray, fields, fieldTitles, callback) {

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const thr = document.createElement('tr');

        table.setAttribute("class", "table-modal")

        fieldTitles.forEach((fieldTitle, index) => {
            const th = document.createElement('th');
            th.setAttribute('data-name', fields[index]);

            th.appendChild(document.createTextNode(fieldTitle));
            thr.appendChild(th);
        });

        thead.appendChild(thr);
        table.appendChild(thead);

        const tbody = this.createTBody(objectArray, fields, callback);

        table.appendChild(tbody);
        this._modal.appendChild(table);

        return table;
    }

    createOption(value) {
        const option = document.createElement('option');
        option.value = value;
        option.innerHTML = value;

        return option;
    }

    deleteOptions() {
        const options = this._select.children;
        let j = 14;

        for (let i = 0; i < 15; i++) {
            this._select.removeChild(options[j]);
            j--;
        }
    }

    setAttrSelected(elem) {
        elem.setAttribute("selected", true);
    }

    appendSelect(options) {
      this._select.appendChild(options);
    }

    deleteModal() {
        const table = document.getElementsByClassName("table-modal")[0];

        this._modal.removeChild(table);
    }

    bindToggleDeleteModalWindow(callback) {
        this._closeModal.addEventListener("click", callback);
    }

    bindToggleSelectCharacters(callback) {
        this._select.addEventListener("click", callback);
    }
}

const PaginationView = (function () {
    let paginationLayout = '';

    return class {
        constructor() {
            this._modal = document.getElementsByClassName("modal")[0];
            Object.freeze(this);
        }

        paginationTemplate() {
                const wrapper = document.createElement('div');
                wrapper.className = "modal__pagination";
                wrapper.id = "pagination";

                const linkLeft = document.createElement('a');
                linkLeft.innerHTML = "&#9668";

                const linkRight = document.createElement('a');
                linkRight.innerHTML = "&#9658";

                const span = document.createElement('span');

                this._modal.appendChild(wrapper);
                wrapper.appendChild(linkLeft);
                wrapper.appendChild(span);
                wrapper.appendChild(linkRight);
        }

        deletePagination() {
            const pagination = document.querySelector(".modal__pagination");

            this._modal.removeChild(pagination);
        }

        getPaginationSpan() {
            return this._modal.querySelector("#pagination > span")
        }

        getPaginationArrows() {
            return this._modal.querySelectorAll('#pagination > a');
        }

        addPagesNumber(from, to) {
            for (let i = from; i < to; i++) {
                paginationLayout += '<a>' + i + '</a>';
            }
        }

        addFirstPage() {
            paginationLayout += '<a>1</a><i>...</i>';
        }

        addLastPage(size) {
            paginationLayout += '<i>...</i><a>' + size + '</a>';
        }

        writePagination(settings, callback) {
            const innerWrapButtons  = this.getPaginationSpan();

            innerWrapButtons.innerHTML = paginationLayout;
            paginationLayout = '';

            this._writeButtonsNumber(innerWrapButtons, settings, callback);
        }

        _writeButtonsNumber(innerWrapButtons, settings, callback) {
            const tagLinc = innerWrapButtons.getElementsByTagName('a');

            for (let i = 0, len = tagLinc.length; i < len; i++) {
                if (+tagLinc[ i ].innerHTML === settings.page) {
                    tagLinc[ i ].className = 'current';
                }

                tagLinc[ i ].addEventListener('click', callback);
            }
        }

        getWrapElemPagination() {
            return this.pagination;
        }

        getHtmlWrapButtons() {
            return this.htmlWrapButtons;
        }

        bindToggleNavButtonBack(callback) {
            const navButton = this.getPaginationArrows();
            navButton[0].addEventListener("click", callback);
        }

        bindToggleNavButtonForward(callback) {
            const navButton = this.getPaginationArrows();
            navButton[navButton.length - 1].addEventListener("click", callback);
        }
    }
})();