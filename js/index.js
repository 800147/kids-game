import { Game } from './Game.js';

const init = () => { new Game(); };

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
else { init(); }
