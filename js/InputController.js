export class InputController {
  constructor(game) {
    this.game = game;

    this.gameLoop = this.gameLoop.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.lastAxe6 = 0;
    this.lastAxe7 = 0;
    this.lastButton12 = false;
    this.lastButton13 = false;
    this.lastButton14 = false;
    this.lastButton15 = false;

    setInterval(this.gameLoop, 16);

    document.addEventListener('keydown', this.onKeyDown);

    document.getElementById('upButton').addEventListener('pointerdown', () => this.game.move(0, -1));
    document.getElementById('rightButton').addEventListener('pointerdown', () => this.game.move(1, 0));
    document.getElementById('downButton').addEventListener('pointerdown', () => this.game.move(0, 1));
    document.getElementById('leftButton').addEventListener('pointerdown', () => this.game.move(-1, 0));
  }

  onKeyDown({ key }) {
    switch (key) {
      case 'ArrowUp':
        this.game.move(0, -1);
        break;
      case 'ArrowRight':
        this.game.move(1, 0);
        break;
      case 'ArrowDown':
        this.game.move(0, 1);
        break;
      case 'ArrowLeft':
        this.game.move(-1, 0);
        break;
    }
  }

  gameLoop() {
    const myGamepad = navigator.getGamepads()[0]; // use the first gamepad

    const axe6 = myGamepad?.axes[6] ?? 0;
    const axe7 = myGamepad?.axes[7] ?? 0;
    const button12 = myGamepad?.buttons[12]?.pressed ?? false;
    const button13 = myGamepad?.buttons[13]?.pressed ?? false;
    const button14 = myGamepad?.buttons[14]?.pressed ?? false;
    const button15 = myGamepad?.buttons[15]?.pressed ?? false;

    let dx = 0;
    let dy = 0;

    if(axe6 !== this.lastAxe6) { dx = axe6; }
    if(axe7 !== this.lastAxe7) { dy = axe7; }
    if(button12 && !this.lastButton12) { dy = -1; }
    if(button13 && !this.lastButton13) { dy = 1; }
    if(button14 && !this.lastButton14) { dx = -1; }
    if(button15 && !this.lastButton15) { dx = 1; }

    this.lastAxe6 = axe6;
    this.lastAxe7 = axe7;
    this.lastButton12 = button12;
    this.lastButton13 = button13;
    this.lastButton14 = button14;
    this.lastButton15 = button15;

    if (dx) {
      this.game.move(dx, 0);
      return;
    }

    if (dy) {
      this.game.move(0, dy);
    }
  }
}
