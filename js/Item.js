export class Item {
  constructor(element, game) {
    this.element = element;
    this.game = game;
  }

  setAll({x, y}) {
    if (this.game.field[y]?.[x] !== 0) {
      return false;
    }

    this.element.dataset.x = x;
    this.element.dataset.y = y;

    return true;
  }

  setX(n) {
    if (this.game.field[this.y || 0]?.[n] !== 0) {
      return false;
    }

    this.element.dataset.x = n;

    return true;
  }

  setY(n) {
    if (this.game.field[n]?.[this.x || 0] !== 0) {
      return false;
    }

    this.element.dataset.y = n;

    return true;
  }

  get x() {
    return Number(this.element.dataset.x);
  }
  set x(n) {
    this.setX(n);
  }
  get y() {
    return Number(this.element.dataset.y);
  }
  set y(n) {
    this.setY(n);
  }
}
