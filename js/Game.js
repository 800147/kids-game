import { Dino } from './Dino.js';
import { Item } from './Item.js';
import { InputController } from './InputController.js';
import { __ } from './el.js';

const SIZES = { '3': 3, '5': 5, '7': 7, '9': 9 };
const size = new URLSearchParams(window.location.search).get('size');

const ROWS = SIZES[size] ?? 7;
const COLS = SIZES[size] ?? 7;
const MAX_WALLS = ROWS * COLS - 2;

export class Game {
    constructor() {
        this._calculatePaths = this._calculatePaths.bind(this);

        document.getElementById('game').style = `--cols: ${COLS};`;

        this.fieldElem = document.getElementById('field');
        for (let i = 0; i < ROWS * COLS; i++) {
            const cell = __('div', { class: `Field-Cell${i === 0 ? ' Field-Cell_base' : ''}`});
            this.fieldElem.appendChild(cell);

            if (i === 0) {
                this.firstCellElem = cell;
            }
        }

        this._clear();

        const dinoElem = __('div', { class: 'Dino Field-Item' });
        this.dino = new Dino(dinoElem, this, 'Dino');
        this.firstCellElem.appendChild(dinoElem);

        const appleElem = __('div', { class: 'Apple Field-Item' });
        this.apple = new Item(appleElem, this);
        this.firstCellElem.appendChild(appleElem);

        this.dino.y = Math.round((this.field.length - 1) / 2);
        this.dino.x = Math.round((this.field[this.dino.y].length - 1) / 2);

        this._setApple();

        window.addEventListener('gamepadconnected', (e) => {
            console.log(
                'Gamepad connected',
                e.gamepad,
            );
        });

        new InputController(this);
    }

    _clear() {
        this.wallsCount = 0;
        let children = this.firstCellElem.querySelectorAll('.Field-Cell_base > .Wall');

        for (const node of children) {
            this.firstCellElem.removeChild(node);
        }

        this.field = new Array(ROWS).fill('').map(() => new Array(COLS).fill(0));

        this.paths = [];
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i]?.[j]) {
                    continue;
                }

                this.paths.push({ y: i, x: j });
            }
        }

        this.paths = this.paths.map(this._calculatePaths);
   }

    move(dx, dy) {
        this.dino.move(dx, dy);

        if (this.dino.x === this.apple.x && this.dino.y === this.apple.y) {
            this.firstCellElem.appendChild(
                __('div', {
                    class: 'Apple Apple_collected Field-Item',
                    style: `transform: translate(${COLS * 100 + 25 + (COLS * 50 - 125) * Math.random()}%, ${(ROWS - 1) * 100 * Math.random()}%);`,
                    'data-x': this.apple.x,
                    'data-y': this.apple.y,
                }),
            );

            this.apple.element.classList.remove('Apple');
            void this.apple.element.offsetWidth;
            this.apple.element.classList.add('Apple');

            if (this.wallsCount >= MAX_WALLS) {
                this._clear();
                this._setApple();

                return;
            }

            this._setWall();
            this._setApple();
        }
    }

    _setApple() {
        const available = this.paths.filter(({ y, x }) => this.dino.y !== y || this.dino.x !== x);
        const { x, y } = available[Math.floor(Math.random() * available.length)];
        this.apple.setAll({ x, y });
    }

    _setWall() {
        const available = this.paths.filter(
            ({ y, x, path }) => (this.dino.y !== y || this.dino.x !== x) && path !== null,
        );
        const { x, y } = available[Math.floor(Math.random() * available.length)];
        const wallElem = __('div', { class: 'Wall Field-Item', 'data-x': x, 'data-y': y });
        this.firstCellElem.appendChild(wallElem);
        this.field[y][x] = 1;
        this.paths = this.paths.filter(({ y: _y, x: _x }) => _y !== y || _x !== x);
        this.paths = this.paths.map((path) => {
            if (
                (path.path === null && path.x === x && Math.abs(path.y - y) === 1) ||
                (path.y === y && Math.abs(path.x - x) === 1)
            ) {
                return this._calculatePaths(path);
            }

            if (path.path?.has(getKey(y, x))) {
                return this._calculatePaths(path);
            }

            return path;
        });
        this.wallsCount += 1;
    }

    _calculatePaths({ y, x }) {
        const points = [
            [y - 1, x],
            [y, x + 1],
            [y + 1, x],
            [y, x - 1],
        ].filter(([i, j]) => this.field[i]?.[j] === 0);

        if (points.length < 2) {
            return { y, x, path: new Set() };
        }

        const currentField = cloneField(this.field);
        currentField[y][x] = 1;

        const pathSet = new Set();
        for (let n = 1; n < points.length; n++) {
            const currentPath = findPath(currentField, points[0], points[n]);

            if (!currentPath) {
                return { y, x, path: null };
            }

            currentPath.forEach((point) => pathSet.add(point));
        }

        return { y, x, path: pathSet };
    }
}

const getKey = (y, x) => `${y}_${x}`;

const findPath = (f, [y1, x1], [y2, x2]) => {
    const field = f.map((row, i) => row.map((_, j) => ({ value: f[i]?.[j] ? undefined : Number.MAX_VALUE })));

    field[y1][x1].value = 0;

    let lastChanged = [[y1, x1]];

    let i = 0;
    while (field[y2][x2].value === Number.MAX_VALUE && lastChanged.length) {
        i++;
        const currentChanged = [];
        lastChanged.forEach(([x, y]) => {
            const plusOne = field[x][y].value + 1;

            [
                [x, y - 1],
                [x + 1, y],
                [x, y + 1],
                [x - 1, y],
            ].forEach(([_x, _y]) => {
                if (field[_x]?.[_y]?.value !== undefined && field[_x][_y].value > plusOne) {
                    field[_x][_y] = { value: plusOne, cell: [x, y] };
                    currentChanged.push([_x, _y]);
                }
            });
        });

        lastChanged = currentChanged;
    }

    if (field[y2][x2].value === Number.MAX_VALUE) {
        return null;
    }

    let currentCell = [y2, x2];

    const result = [getKey(...currentCell)];

    while (currentCell[0] !== y1 || currentCell[1] !== x1) {
        currentCell = field[currentCell[0]][currentCell[1]].cell;
        result.push(getKey(...currentCell));
    }

    return result;
};

const cloneField = (field) => field.map((row) => [...row]);
