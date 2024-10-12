"use strict";
const BOARD_ROWS = 16; // TODO: Add input to decide how many rows and cols the board has
const BOARD_COLS = BOARD_ROWS;
const stateColor = ["#202020", "#FF5050", "#50FF50", "#50FFFF"]; // 0: path, 1: wall, 2: start, 3: goal
function createBoard() {
    const board = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        board.push(new Array(BOARD_COLS).fill(0));
    }
    return board;
}
class Game {
    constructor() {
        this._board = [];
        this._start = [];
        this._goal = [];
        this._board = createBoard();
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
    render() {
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                const x = r * CELL_WIDTH;
                const y = c * CELL_HEIGHT;
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
                            if (this._start.length > 0) {
                                console.log("You clicked on anotha start");
                                this._ctx.fillStyle = stateColor[0];
                                this._ctx.fillRect(this._goal[0], this._goal[1], CELL_WIDTH, CELL_HEIGHT);
                            }
                            this._start = [r, c];
                            console.log(this._start);
                            this._ctx.fillStyle = stateColor[2];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            break;
                        case 3:
                            if (this._goal.length > 0) {
                                this._ctx.fillStyle = stateColor[0];
                                this._ctx.fillRect(this._goal[0], this._goal[1], CELL_WIDTH, CELL_HEIGHT);
                            }
                            this._ctx.fillStyle = stateColor[3];
                            this._ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
                            console.log(this._goal);
                            this._goal = [r, c];
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
