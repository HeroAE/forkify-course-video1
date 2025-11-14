import View from "./View";
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const page = this._data.page;

    if (page === 1 && numPages > 1) {
      return `
        <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </button>
      `;
    }

    if (page === numPages && numPages > 1) {
      return `
        <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
          <span>Page ${page - 1}</span>
        </button>
      `;
    }

    if (page < numPages) {
      return `
        <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
          <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
          <span>Page ${page - 1}</span>
        </button>
        <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${page + 1}</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </button>
      `;
    }

    return '';
  }
}

export default new PaginationView();
