import { Tetris } from './tetris.js';
import { convertpositionToIndex } from './utilities.js'

const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');


const moveDown = () => {
    tetris.moveTetrominoDown();
    draw();
}

const moveLeft = () => {
    tetris.moveTetrominoLeft();
    draw();
}

const moveRight = () => {
    tetris.moveTetrominoRight();
    draw();
}

const rotate = () => {
    tetris.rotateTetromino();
    draw();
}

const onKeyDown = (event) => {
    switch (event.key) {
        case 'ArrowUp':
            rotate()
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
}

const initKeyDown = () => {
    document.addEventListener('keydown', onKeyDown)
}

const drawTetromino = () => {
    const name = tetris.tetromino.name;
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetris.tetromino.matrix[row][column]) continue;
            if (tetris.tetromino.row + row < 0) continue;
            const cellIndex = convertpositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            cells[cellIndex].classList.add(name)
        }
    }
}

const draw = () => {
    cells.forEach(cell => {
        cell.removeAttribute('class')
    });
    drawTetromino();
}

initKeyDown();
draw();