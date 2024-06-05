let currentPlayer = 'black';
let allPiecesPlaced = false;

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const piece = document.getElementById(id);
    const targetCell = event.target;

    if (targetCell.classList.contains('cell')) {
        if (!targetCell.querySelector('img')) {
            piece.parentNode.removeChild(piece);
            targetCell.appendChild(piece);
            piece.setAttribute('draggable', 'false');

            if (!allPiecesPlaced && document.querySelectorAll('.piece-container img').length === 0) {
                allPiecesPlaced = true;
                enableAllPiecesOnBoard();
            }

            if (checkForWin()) {
                showMessage(currentPlayer === 'black' ? "AS PRETAS GANHARAM!" : "AS BRANCAS GANHARAM!");
            } else {
                switchTurn();
            }
        }
    }
}

function enableAllPiecesOnBoard() {
    document.querySelectorAll('.cell img').forEach(piece => {
        piece.setAttribute('draggable', 'true');
        piece.addEventListener('dragstart', dragStart);
    });
}

// Atribui IDs únicos a cada peça e adiciona event listeners
document.querySelectorAll('.piece').forEach((piece, index) => {
    piece.id = 'piece-' + index;
    piece.addEventListener('dragstart', dragStart);
});

// Adiciona event listeners para dragover e drop em todas as células
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', drop);
});

function checkForWin() {
    const board = [];
    document.querySelectorAll('.cell').forEach(cell => {
        const img = cell.querySelector('img');
        board.push(img ? img.src : null);
    });

    const winningCombinations = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12]
    ];

    const whitePieces = ["queen_white.png", "rook_white.png", "bishop_white.png", "knight_white.png"];
    const blackPieces = ["queen_black.png", "rook_black.png", "bishop_black.png", "knight_black.png"];

    for (const combination of winningCombinations) {
        const line = combination.map(index => board[index]);
        if (line.every(cell => cell && whitePieces.some(piece => cell.includes(piece)))) {
            return true;
        } else if (line.every(cell => cell && blackPieces.some(piece => cell.includes(piece)))) {
            return true;
        }
    }
    return false;
}

function showMessage(message) {
    document.getElementById('message').innerText = message;
    document.getElementById('reset-button').classList.remove('hidden');
    document.querySelectorAll('.piece').forEach(piece => {
        piece.setAttribute('draggable', 'false');
    });
    document.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('dragover', dragOver);
        cell.removeEventListener('drop', drop);
    });
}

function switchTurn() {
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('message').innerText = currentPlayer === 'black' ? "É A VEZ DAS PRETAS" : "É A VEZ DAS BRANCAS";

    document.querySelectorAll('.piece').forEach(piece => {
        if ((currentPlayer === 'black' && piece.src.includes('black')) || 
            (currentPlayer === 'white' && piece.src.includes('white'))) {
            piece.setAttribute('draggable', 'true');
        } else {
            piece.setAttribute('draggable', 'false');
        }
    });
}

function resetGame() {
    location.reload();
}

// Inicializa o jogo
switchTurn();
