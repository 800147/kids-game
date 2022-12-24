import { Game } from './Game.js';
import { InputController } from './InputController.js';

const init = () => {
  const game = new Game();

  new InputController(game);

  // https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
  if (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  ) {
    document.getElementById('wrapper').classList.add('Wrapper_isTouchDevice');
  }

  window.addEventListener('gamepadconnected', (e) => {
    console.log(
        'Gamepad connected',
        e.gamepad,
    );
  });
};

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
else { init(); }
