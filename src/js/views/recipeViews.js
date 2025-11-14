function toFraction(value) {
  if (typeof value !== "number") return value;
  const map = {
    0.125: "1/8",
    0.1667: "1/6",
    0.2: "1/5",
    0.25: "1/4",
    0.3333: "1/3",
    0.375: "3/8",
    0.4: "2/5",
    0.5: "1/2",
    0.6: "3/5",
    0.625: "5/8",
    0.6667: "2/3",
    0.75: "3/4",
    0.8: "4/5",
    0.8333: "5/6",
    0.875: "7/8",
  };
  for (const dec in map) {
    if (Math.abs(value - Number(dec)) < 0.01) return map[dec];
  }
  return Number.isInteger(value) ? value : value;
}

import View from "./View.js";
import icons from "../../img/icons.svg";

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage = "Tarif yüklenemedi! Tekrar deneyin.";
  _message = "Bir tarif seçmek için arama yapın 😉";

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach(ev =>
      window.addEventListener(ev, handler)
    );
  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--tiny");
      if (!btn) return;
      const updateTo = btn.classList.contains("btn--decrease-servings")
        ? Number(document.querySelector('.recipe__info-data--people').textContent) - 1
        : Number(document.querySelector('.recipe__info-data--people').textContent) + 1;
      if (updateTo > 0) handler(updateTo);
    });
  }
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--bookmark");
      if (!btn) return;

      handler();
    })
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
        <h1 class="recipe__title"><span>${this._data.title}</span></h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon"><use href="${icons}#icon-clock"></use></svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
          <span class="recipe__info-text">dakika</span>
        </div>

        <div class="recipe__info">
          <svg class="recipe__info-icon"><use href="${icons}#icon-users"></use></svg>
          <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
          <span class="recipe__info-text">kişi</span>
          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings"><svg><use href="${icons}#icon-minus-circle"></use></svg></button>
            <button class="btn--tiny btn--increase-servings"><svg><use href="${icons}#icon-plus-circle"></use></svg></button>
          </div>
        </div>

          <div class="recipe__user-generated${this._data.key ? "" : " hidden"}  ">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>

        <button class="btn--round btn--bookmark">
          <svg><use href="${icons}#icon-bookmark${this._data.bookmarked ? "-fill" : ""}"></use></svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Tarif Malzemeleri</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join("")}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">Nasıl yapılır?</h2>
        <p class="recipe__directions-text">
          Bu tarif <span class="recipe__publisher">${this._data.publisher}</span> tarafından hazırlanmıştır.
          Detaylar için kaynak sayfayı ziyaret edin.
        </p>
        <a class="btn--small recipe__btn" href="${this._data.sourceUrl}" target="_blank">
          <span>Yapılış Adımları</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </a>
      </div>
    `;
  }

  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon"><use href="${icons}#icon-check"></use></svg>
        <div class="recipe__quantity">${ing.quantity ? toFraction(ing.quantity) : ""}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit || ""}</span> ${ing.description}
        </div>
      </li>
    `;
  }
}

export default new RecipeView();
