import { Tetris, score } from './tetris.js';
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from './utilities.js'

export const $score = document.getElementById("score");

let requestId;
let timeoutId;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');
const audio = document.getElementById("myAudio");
const restartButton = document.getElementById('restart-button');
const popup = document.getElementById('popup');

let fallTime = 700

const startLoop = () => {
    if (score >= 500) {
        fallTime = 400;
    } else if (score >= 400) {
        fallTime = 450;
    } else if (score >= 300) {
        fallTime = 460;
    } else if (score >= 200) {
        fallTime = 470;
    } else if (score >= 100) {
        fallTime = 500;
    } else if (score === 0) {
        fallTime = 700;
    }
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), fallTime)
}

const restartGame = () => {
    stopLoop();
    tetris.resetGame();
    // $score.innerText = "0";
    cells.forEach(cell => cell.removeAttribute('class'));
    initKeyDown();
    startLoop();
}

restartButton.addEventListener('click', () => {
    popup.classList.add('dn');
    restartGame();
})

const stopLoop = () => {
    cancelAnimationFrame(requestId)
    clearTimeout(timeoutId);
}

const gameOver = () => {
    stopLoop();
    audio.pause();
    popup.classList.remove('dn');
    document.removeEventListener('keydown', onKeyDown);

    if (localStorage.getItem('Record') > score) {
        localStorage.setItem('Record', score)
    }
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

    if (tetris.isGameOver) {
        gameOver();
    }
}

const onKeyDown = (event) => {
    switch (event.key) {
        case 'w':
            rotate()
        case 's':
            moveDown();
            break;
        case 'a':
            moveLeft();
            break;
        case 'd':
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
            if (!tetris.playfield[row][column]) continue;
            const name = tetris.playfield[row][column];
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

const startGame = () => {
    const button = document.getElementById('button');
    let gameState = false;

    button.addEventListener('click', () => {
        if (gameState === false) {
            moveDown();
            button.innerText = 'Stop';
            audio.play();
            gameState = true;
        } else {
            stopLoop();
            button.innerText = 'Continue';
            audio.pause();
            gameState = false;
        }
    })
}

const musicMute = () => {
    const switcher = document.getElementById('music-switcher')
    switcher.addEventListener('click', () => {
        audio.paused ? audio.play() : audio.pause();
    })
}

initKeyDown();
startGame();
musicMute();


