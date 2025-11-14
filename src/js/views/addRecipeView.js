import View from "./View";
import icons from '../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded :)';

    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');

        // Form açılırken içeriği temizle
        if (!this._window.classList.contains('hidden')) {
            this._clearForm();
        }
    }

    _clearForm() {
        // Form alanlarını temizle
        this._parentElement.innerHTML = this._generateMarkup();
    }
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }


    _generateMarkup() {
        return `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input required name="title" type="text" value="Pizza Margherita" />
          <label>URL</label>
          <input required name="sourceUrl" type="text" value="https://example.com/pizza-margherita" />
          <label>Image URL</label>
          <input required name="image" type="text" value="https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?q=80&w=1492&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <label>Publisher</label>
          <input required name="publisher" type="text" value="John Doe" />
          <label>Prep time</label>
          <input required name="cookingTime" type="number" value="30" />
          <label>Servings</label>
          <input required name="servings" type="number" value="4" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input type="text" required name="ingredient-1" placeholder="Format: 'Quantity,Unit,Description'" value="1,kg,Flour" />
          <label>Ingredient 2</label>
          <input type="text" name="ingredient-2" placeholder="Format: 'Quantity,Unit,Description'" value="0.5,l,Water" />
          <label>Ingredient 3</label>
          <input type="text" name="ingredient-3" placeholder="Format: 'Quantity,Unit,Description'" value="10,g,Yeast" />
          <label>Ingredient 4</label>
          <input type="text" name="ingredient-4" placeholder="Format: 'Quantity,Unit,Description'" value="1,tsp,Salt" />
          <label>Ingredient 5</label>
          <input type="text" name="ingredient-5" placeholder="Format: 'Quantity,Unit,Description'" value="200,g,Cheese" />
          <label>Ingredient 6</label>
          <input type="text" name="ingredient-6" placeholder="Format: 'Quantity,Unit,Description'" value="100,g,Tomato Sauce" />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
        `;
    }
}
export default new AddRecipeView();
