const Player = (_name, _symbol) => {
    const getName = () => _name;

    const getSymbol = () => _symbol;

    return {
        getName, 
        getSymbol,
    }
};

const gameBoard = (() => {
    const _AI_SYMBOL = 'x';
    const _HUMAN_SYMBOL = 'o';
    const _SCORES = {
        x: 100,
        o: -100,
        tie: 0
    }
    let _board = new Array(9).fill('');
    let _player1 = Player('xx', 'x');
    let _player2 = Player('oo', 'o');

    const equal3 = (a, b, c) => {
        return (a === b && a === c) && a !== '';
    }

    const checkWinner = () => {
        let winner = null;

        //Check horizontally
        for (let i = 0; i < _board.length; i += 3) {
            if (equal3(_board[i], _board[i + 1], _board[i + 2]))
                winner = _board[i];
        }

        //Check vertically
        for (let i = 0; i < Math.sqrt(_board.length); ++i) {
            if (equal3(_board[i], _board[i + 3], _board[i + 6]))
                winner = _board[i];
        }

        //Check diagonally
        if (equal3(_board[0], _board[4], _board[8]))
            winner = _board[0];
        if (equal3(_board[2], _board[4], _board[6]))
            winner = _board[2];

        //Check tie
        if (checkEmptySpots() === 0 && winner === null) {
            winner = 'tie';
        }

        if (winner !== null)   
            document.querySelector('#winner').textContent = winner + ' is winner';
        return winner;
    }

    const checkEmptySpots = () => {
        let emptySpots = 0;

        for (let i = 0; i < _board.length; ++i)
            if (_board[i] === '')
                ++emptySpots;
        
        return emptySpots;
    }

    const minimax = (board, depth, alpha, beta, isMaximizing) => {
        let winner = checkWinner();
        if (winner !== null)
            return _SCORES[winner];

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (let i = 0; i < board.length; ++i) {
                if (board[i] === '') {
                    board[i] = _AI_SYMBOL;
                    let score = minimax(board, depth, alpha, beta + 1, false);
                    board[i] = '';
                    maxScore = Math.max(maxScore, score);
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha)
                        break;
                }
            }
            return maxScore;
        } else {
            let minScore = +Infinity;
            for (let i = 0; i < board.length; ++i) {
                if (board[i] === '') {
                    board[i] = _HUMAN_SYMBOL;
                    let score = minimax(board, depth, alpha, beta + 1, true);
                    board[i] = '';
                    minScore = Math.min(minScore, score);
                    beta = Math.min(beta, score);
                    if (beta <= alpha)
                        break;
                }
            }
            return minScore;
        }
    }

    const aiMove = () => {
        let bestScore = -Infinity;
        let bestPosition = -1;
        for (let i = 0; i < _board.length; ++i) {
            if (_board[i] === '') {
                _board[i] = _AI_SYMBOL;
                let score = minimax(_board, 0, -Infinity, +Infinity, false);
                _board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestPosition = i;
                }
            }
        }
        if (bestPosition !== -1) {
            _board[bestPosition] = _AI_SYMBOL;
            return bestPosition;
        }
        return -1;
    }

    const humanMove = (position, symbol) => {
        _board[position] = symbol;
    }

    const getHumanSymbol = () => {
        return _HUMAN_SYMBOL;
    }

    const getAISymbol = () => {
        return _AI_SYMBOL;
    }

    const getPlayer1Symbol = () => {
        return _player1.getSymbol();
    }

    const getPlayer2Symbol = () => {
        return _player2.getSymbol();
    }

    const clearBoard = () => {
        _board = new Array(9).fill('');
    }

    return {
        aiMove,
        humanMove,
        checkWinner,
        getHumanSymbol,
        getAISymbol,
        getPlayer1Symbol,
        getPlayer2Symbol,
        clearBoard,
    }
})();

const displayController = (() => {
    const _AI_SYMBOL = gameBoard.getAISymbol();
    const _HUMAN_SYMBOL = gameBoard.getHumanSymbol();
    const _PLAYER1_SYMBOL = gameBoard.getPlayer1Symbol();
    const _PLAYER2_SYMBOL = gameBoard.getPlayer2Symbol();
    let _squares = Array.from(document.querySelectorAll('.square'));
    let player1Turn = true;

    const runAIMode = () => {
        _squares.forEach(square => square.addEventListener('click', updateBoardAIMode));
    }

    const removeAIMode = () => {
        _squares.forEach(square => square.removeEventListener('click', updateBoardAIMode));
    }

    const updateBoardAIMode = () => {
        if (event.target.textContent.length === 0 && gameBoard.checkWinner() === null) {
            event.target.textContent = _HUMAN_SYMBOL;
            gameBoard.humanMove(event.target.getAttribute('id'), _HUMAN_SYMBOL);
        } else 
            return;

        if (gameBoard.checkWinner() === null) {
            let bestPosition = gameBoard.aiMove();
            if (bestPosition !== -1)
                _squares[bestPosition].textContent = _AI_SYMBOL;
        }
    }


    const runPlayerMode = () => {
        _squares.forEach(square => square.addEventListener('click', updateBoardPlayerMode));
    }

    const removePlayerMode = () => {
        _squares.forEach(square => square.removeEventListener('click', updateBoardPlayerMode));
    }

    const updateBoardPlayerMode = () => {
        if (event.target.textContent.length === 0 && gameBoard.checkWinner() === null) {
            let symbol = '';
            if (player1Turn) {
                symbol = _PLAYER1_SYMBOL;
                player1Turn = false;
            } else {
                symbol = _PLAYER2_SYMBOL;
                player1Turn = true;
            }
            event.target.textContent = symbol;
            gameBoard.humanMove(event.target.getAttribute('id'), symbol);
        } else 
            return;
    }

    const clearSquares = () => {
        _squares.forEach(square => square.textContent = '');
    }

    return {
        runAIMode,
        removeAIMode,
        runPlayerMode,
        removePlayerMode,
        clearSquares,
    }
})();

const chooseMode = (() => {
    let _switchPlayMode = document.querySelector('#toggle');
    if(_switchPlayMode.checked) {
        displayController.runAIMode();
    } else {
        displayController.runPlayerMode();
    }
    _switchPlayMode.addEventListener('change', () => {
        gameBoard.clearBoard();
        displayController.clearSquares();
        if(_switchPlayMode.checked) {
            displayController.removePlayerMode();
            displayController.runAIMode();
        } else {
            displayController.removeAIMode();
            displayController.runPlayerMode();
        }
    });
})();