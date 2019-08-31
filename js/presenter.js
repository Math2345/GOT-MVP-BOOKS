class PresenterTable {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }

    async initialize() {
        await this._model.readData();

        this.buildDataBooks();
        this.buildSortingBooks();
        this.buildModalCharacters();
    }

    _createListBooks() {
        const books = this._model.bookData;

        this.createTableTemplate(books);
    }

    _addSpecialTextTable(td, field, object) {

        if (field === "released") {
            const newFormatDate = this._model.dateFormat(object[field]);
            td.appendChild(document.createTextNode(newFormatDate));

        } else if (field === "characters") {
            let appendData = null;

            const link = document.createElement("a");
            link.innerHTML = "More Info...";
            link.href = this._model.linkCharacter(object[field]);

            appendData = link;

            td.appendChild(appendData);
        } else {
            td.appendChild(document.createTextNode(object[ field ]));
        }
    }

    _toggleButtonsSorting(event) {
        const books = this._model.bookData;
        const th = event.target;
        const dataName = th.getAttribute('data-name');
        const orderSort = this._model.orderSorting;

        th.setAttribute('data-order', orderSort);

        if (orderSort === 'asc') {
            books.sort(sortingUp(dataName));
            this._model.orderSorting = 'desc';
            th.setAttribute('data-order', this._model.orderSorting);

        } else if (orderSort === 'desc') {
            books.sort(sortingDown(dataName));
            this._model.orderSorting = 'asc';
            th.setAttribute('data-order', this._model.orderSorting);
        }

        this._view.deleteTBody();

        const tbody = this._view.createTBody(
            books,
            this._model.keyMainTable,
            this._addSpecialTextTable.bind(this)
        );

        const table = this._view.searchElem('table')[0];
        table.appendChild(tbody);
    }

    _toggleModalCharacters(event) {
        event.preventDefault();
        const href = event.target.getAttribute('href');

        const table = document.querySelector(".container > table");
        table.style.display = "none";

        this._model.setCharactersCollection(href);
    }

    createTableTemplate(collection) {
        this._view.createTable(
            collection,
            this._model.keyMainTable,
            this._model.keyUpperCase(this._model.keyMainTable),
            this._addSpecialTextTable.bind(this)
        );
    }

    buildDataBooks() {
        this._createListBooks();
    }

    buildSortingBooks() {
        this._view.bindToggleButtonSorting(this._toggleButtonsSorting.bind(this));
    }

    buildModalCharacters() {
        this._view.bindToggleCharacters(this._toggleModalCharacters.bind(this));
    }
}

class PresenterModal {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }

    async initialize(tablePresenter, paginationPresenter) {
        await tablePresenter.initialize();
        this._initListeners();

        this.buildModalWindow();
        this._buildDeleteModalWindow();
        paginationPresenter.initialize();
    }

    _initListeners() {
        customEvents.registerListener(EVENT.REQUEST_CHARACTERS);
        customEvents.registerListener(EVENT.SHOW_TBODYMODAL);
    }

    buildModalWindow() {
        customEvents.addListener(EVENT.REQUEST_CHARACTERS, () => this.showModalCharacters());
    }

    _addSpecialTextModal(td, field, object) {

        if ((object[field] === "") || ((typeof object[field] === 'object') && (object[field]).includes(""))) {
            td.appendChild(document.createTextNode("-"));
        } else {
            td.appendChild(document.createTextNode(object[field]));
        }
    }

    showSelect(defaultNotes) {
        for (let i = 1; i < 16; i++) {
            const options = this._view.createOption(i);

            if (defaultNotes === i) this._view.setAttrSelected(options);

            this._view.appendSelect(options);
        }
    }

    showModalCharacters() {
        const charactersBook = this._model.getPartIdCharacters();
        const defaultNotes = this._model.paginationSettings.notes;

        this._view.createModal(
            charactersBook,
            this._model.keyModal,
            this._model.keyUpperCase(this._model.keyModal),
            this._addSpecialTextModal.bind(this)
        );

        this.showSelect(defaultNotes);
        this._view.addModal();

        this._buildSelectCharacters();

        customEvents.runListener(EVENT.SHOW_PAGINATION);
    }

    _toggleDeleteModalWindow() {
        customEvents.runListener(EVENT.CLEAR_PAGINATION);
        this._model.clearIdCharacters();
        this._model.clearPartIdCharacters();

        this._view.deleteModal();
        this._view.deleteOptions();
        this._view.hideModal();
        this._showFirstPage();
        this._showTable();
    }

    _showFirstPage() {
        this._model.setPaginationSettings({
            page: 1
        })
    }

    _showTable() {
        const table = document.querySelector(".container > table");

        table.style.display = "table";
    }

    _toggleSelectCharacters(event) {
        const target = event.target;
        const idCharactersLength = this._model.idCharacters.length;
        const currentCountRecords = this._model.paginationSettings.notes;

        const countButtons = Math.ceil(idCharactersLength / currentCountRecords);

        this._model.setPaginationSettings({
            size: countButtons
        });

        const valueOption = parseInt(target.options[target.selectedIndex].value);

        if (valueOption !== currentCountRecords) {
            this._model.setPaginationSettings({
                notes: valueOption
            });
            this._view.setAttrSelected(target.options[target.selectedIndex]);

            this._model.clearPartIdCharacters();

            this._view.deleteTBody();

            const tbody = this._view.createTBody(
                this._model.getPartIdCharacters(),
                this._model.keyModal,
                this._addSpecialTextModal.bind(this)
            );

            const table = document.querySelector(".table-modal");
            table.appendChild(tbody);

            customEvents.runListener(EVENT.CLEAR_PAGINATION);
            customEvents.runListener(EVENT.SHOW_PAGINATION);
        }
    }

    _buildDeleteModalWindow() {
        this._view.bindToggleDeleteModalWindow(this._toggleDeleteModalWindow.bind(this));
    }

    _buildSelectCharacters() {
        this._view.bindToggleSelectCharacters(this._toggleSelectCharacters.bind(this));
    }
}

class PresenterPagination {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    }

    initialize() {
        this._initListeners();
        this._showPagination();
        this._clearPagination();
    }

    _initListeners() {
        customEvents.registerListener(EVENT.SHOW_PAGINATION);
        customEvents.registerListener(EVENT.CLEAR_PAGINATION);
    }

    _showPagination() {
        customEvents.addListener(EVENT.SHOW_PAGINATION, () => this._buildPagination());
    }

    _clearPagination() {
        customEvents.addListener(EVENT.CLEAR_PAGINATION, () => this._deletePagination());
    }

    _deletePagination() {
        this._view.deletePagination();
    }

    _buildPaginationBtn() {
        const idCharactersLength = this._model.idCharacters.length;
        const {notes} = this._model._settingsPagination;
        const countButtons = Math.ceil(idCharactersLength / notes);

        this._model.setPaginationSettings({
            size: countButtons
        });

        const {size, page, step} = this._model._settingsPagination;

        const stepBothSide = step * 2;

        if (size < stepBothSide + 6) {
            this._view.addPagesNumber(1, size + 1);
        } else if (page < stepBothSide + 1) {
            this._view.addPagesNumber(1, stepBothSide + 4);
            this._view.addLastPage(size);
        } else if (page > size - stepBothSide) {
            this._view.addFirstPage();
            this._view.addPagesNumber((size - stepBothSide) - 2, size + 1);
        } else {
            this._view.addFirstPage();
            this._view.addPagesNumber(page - step, (page + step) + 1);
            this._view.addLastPage(size);
        }

        this._view.writePagination(this._model._settingsPagination, this._btnClick.bind(this));
    }

    _buildPagination() {
        this._view.paginationTemplate();

        this._buildPaginationBtn();

        this._buildNavButtonBack();
        this._buildNavButtonForward();
    }

    _toggleNavButtonBack(event) {
        let {page, notes} = this._model._settingsPagination;
        const keyModal = this._model.keyModal;

        page--;

        this._model.setPaginationSettings({
            page: page
        });

        if (page < 1) {
            this._model.setPaginationSettings({
                page: 1
            });
        }

        this._buildPaginationBtn();

        const modalPagination = event.target.closest(".modal__pagination");
        const number = +modalPagination.querySelector(".current").innerHTML;

        const start = (number - 1) * notes;
        const end = start + notes;

        const characters = this._model.getSliceIdCharacters(start, end);
        const tbody = document.querySelector(".tbody-modal");

        tbody.innerHTML = "";

        for (let character of characters) {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);


            for (let i = 0; i < keyModal.length; i++) {
                const key = keyModal[i];

                PresenterPagination.createCell(character[key], tr)
            }
        }
    }

    _toggleNavButtonForward(event) {
        let {size, page, notes} = this._model._settingsPagination;
        const keyModal = this._model.keyModal;

        page++;

        this._model.setPaginationSettings({
            page: page
        });

        if (page > size) {
            this._model.setPaginationSettings({
                page: size
            });
        }

        this._buildPaginationBtn();

        const modalPagination = event.target.closest(".modal__pagination");
        const number = +modalPagination.querySelector(".current").innerHTML;

        const start = (number - 1) * notes;
        const end = start + notes;

        const characters = this._model.getSliceIdCharacters(start, end);
        const tbody = document.querySelector(".tbody-modal");

        tbody.innerHTML = "";

        for (let character of characters) {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);


            for (let i = 0; i < keyModal.length; i++) {
                const key = keyModal[i];

                PresenterPagination.createCell(character[key], tr)
            }
        }
    }

    _buildNavButtonBack() {
        this._view.bindToggleNavButtonBack(this._toggleNavButtonBack.bind(this));
    }

    _buildNavButtonForward() {
        this._view.bindToggleNavButtonForward(this._toggleNavButtonForward.bind(this));
    }

    static createCell(text, tr) {
        const td = document.createElement("td");

        if ((text === "") || ((typeof text === 'object') && (text).includes(""))) {
           td.innerHTML = "-";
        } else {
           td.innerHTML = text;
        }

        tr.appendChild(td)
    }

    _btnClick(event) {
        const number = +event.target.innerHTML;
        const notesOnPage = this._model._settingsPagination.notes;
        const keyModal = this._model.keyModal;

        const start = (number - 1) * notesOnPage;
        const end = start + notesOnPage;

        this._model.setPaginationSettings({
            page: +number
        });

        const characters = this._model.getSliceIdCharacters(start, end);
        const tbody = document.querySelector(".tbody-modal");

        tbody.innerHTML = "";

        for (let character of characters) {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);


            for (let i = 0; i < keyModal.length; i++) {
                const key = keyModal[i];

                PresenterPagination.createCell(character[key], tr)
            }

        }
        this._buildPaginationBtn();
    }
}