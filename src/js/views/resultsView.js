import View from "./View";
import icons from "../../img/icons.svg";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "No recipes found! Try another search 😉";
  _message = "";

  _generateMarkup() {
    return this._data.map(result => previewView._generateMarkup.call({ _data: result })).join('');
  }
}

export default new ResultsView();
