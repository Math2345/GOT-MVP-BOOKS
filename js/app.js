const model = new ModelBook();
const tablePresenter = new PresenterTable(model, new TableView());
const modalPresenter = new PresenterModal(model, new ModalView());
const paginationPresenter = new PresenterPagination(model, new PaginationView());

const setView = () => modalPresenter.initialize(tablePresenter, paginationPresenter);

window.onload = setView;

