"use strict";
const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;
// 0: path, 1: wall, 2: start, 3: goal, 4: route
const stateColor = ["#202020", "#555555", "#50FF50", "#50FFFF", "#FF5050"];
class Game {
    constructor() {
        this._board = [];
        this._start = [];
        this._goal = [];
        this._board = this.createBoard();
        this._canvas = document.getElementById("app");
        if (this._canvas === null) {
            throw new Error('Could not find canvas');
        }
        this._canvas.width = 400;
        this._canvas.height = 400;
        this._ctx = this._canvas.getContext("2d");
        if (this._ctx === null) {
            throw new Error('Could not initialize 2d context');
        }
    }
    get canvas() {
        return this._canvas;
    }
    get board() {
        return this._board;
    }
    get ctx() {
        if (this._ctx === null) {
            throw new Error('Could not initialize 2d context');
        }
        return this._ctx;
    }
    get start() {
        return this._start;
    }
    get goal() {
        return this._goal;
    }
    createBoard() {
        const board = [];
        for (let r = 0; r < BOARD_ROWS; r++) {
            board.push(new Array(BOARD_COLS).fill(0));
        }
        return board;
    }
    render() {
        for (let r = 0; r < BOARD_ROWS; ++r) {
            for (let c = 0; c < BOARD_COLS; ++c) {
                const x = r * CELL_HEIGHT;
                const y = c * CELL_WIDTH;
                if (this._ctx) {
                    switch (this._board[r][c]) {
                        case 0:
                            this._ctx.fillStyle = stateColor[0];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 1:
                            this._ctx.fillStyle = stateColor[1];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 2:
                            this._start = [r, c];
                            this._ctx.fillStyle = stateColor[2];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 3:
                            this._goal = [r, c];
                            this._ctx.fillStyle = stateColor[3];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}
const game = new Game();
// Creating the cells
const CELL_WIDTH = game.canvas.width / BOARD_COLS;
const CELL_HEIGHT = game.canvas.height / BOARD_ROWS;
game.canvas.addEventListener('click', (e) => {
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    const state = document.getElementsByName("state");
    for (let i = 0; i < state.length; i++) {
        if (state[i].checked) {
            if (i === 2 && game.start.length > 0) {
                game.board[game.start[0]][game.start[1]] = 0;
            }
            if (i === 3 && game.goal.length > 0) {
                game.board[game.goal[0]][game.goal[1]] = 0;
            }
            game.board[col][row] = i;
            game.render();
            return;
        }
    }
});
let isMouseDown = false;
game.canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
});
game.canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) {
        let col = Math.floor(e.offsetX / CELL_WIDTH);
        let row = Math.floor(e.offsetY / CELL_HEIGHT);
        const selectedState = document.querySelector('input[name="state"]:checked');
        if (selectedState && selectedState.value === "wall") {
            game.board[col][row] = 1;
        }
        else if (selectedState && selectedState.value === "path") {
            game.board[col][row] = 0;
        }
        game.render();
    }
});
game.canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});
game.render();
