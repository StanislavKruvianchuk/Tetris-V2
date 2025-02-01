import { Tetris } from './tetris.js';
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from './utilities.js'

let requestId;
let timeoutId;

const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');



const startLoop = () => {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700)
}

const stopLoop = () => {
    cancelAnimationFrame(requestId)
    clearTimeout(timeoutId);
}

const gameOver = () => {
    stopLoop();
    document.removeEventListener('keydown', onKeyDown);
}

const moveDown = () => {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
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

const dropDown = () => {
    tetris.dropTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if(tetris.isGameOver) {
        gameOver();
    }
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
        case ' ':
            dropDown();
            break;
        default: 
            break    
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
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            cells[cellIndex].classList.add(name)
        }
    }
}

const drawGhostTetromino = () => {
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    for (let row = 0; row < tetrominoMatrixSize; row++) {
      for (let column = 0; column < tetrominoMatrixSize; column++) {
        if (!tetris.tetromino.matrix[row][column]) continue;
        if (tetris.tetromino.ghostRow + row < 0) continue;
        const cellIndex = convertPositionToIndex(tetris.tetromino.ghostRow + row, tetris.tetromino.ghostColumn + column);
        cells[cellIndex].classList.add('ghost');
      }
    }
  }

const drowPlayfield = () => {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(!tetris.playfield[row][column]) continue; 
            const name =  tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

const draw = () => {
    cells.forEach(cell => {
        cell.removeAttribute('class')
    });
    drowPlayfield();
    drawTetromino();
    drawGhostTetromino();
}

initKeyDown();

moveDown();