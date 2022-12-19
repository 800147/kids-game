export class InputController {
  constructor(game) {
    this.game = game;
    this.gameLoop = this.gameLoop.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.lastAxe6 = 0;
    this.lastAxe7 = 0;
    setInterval(this.gameLoop, 16);
    document.addEventListener("keydown", this.onKeyDown);
  }

  onKeyDown({ key }) {
    switch (key) {
      case "ArrowUp":
        this.game.move(0, -1);
        break;
      case "ArrowRight":
        this.game.move(1, 0);
        break;
      case "ArrowDown":
        this.game.move(0, 1);
        break;
      case "ArrowLeft":
        this.game.move(-1, 0);
        break;
    }
  }

  gameLoop() {
    const myGamepad = navigator.getGamepads()[0]; // use the first gamepad
    const axe6 = myGamepad?.axes[6] ?? 0;
    const axe7 = myGamepad?.axes[7] ?? 0;
    const dx = axe6 !== this.lastAxe6 ? axe6 : 0;
    const dy = axe7 !== this.lastAxe7 ? axe7 : 0;
    this.lastAxe6 = axe6;
    this.lastAxe7 = axe7;

    if (dx) {
      this.game.move(dx, 0);
      return;
    }

    if (dy) {
      this.game.move(0, dy);
    }
  }
}
