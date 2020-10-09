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
    const _SIZE = 9;
    let _board = new Array(_SIZE).fill('');
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

    const humanMove = (position) => {
        _board[position] = _HUMAN_SYMBOL;
    }

    const getHumanSymbol = () => {
        return _HUMAN_SYMBOL;
    }

    const getAISymbol = () => {
        return _AI_SYMBOL;
    }

    return {
        aiMove,
        humanMove,
        checkWinner,
        getHumanSymbol,
        getAISymbol,
    }
})();

const displayController = (() => {
    const _AI_SYMBOL = gameBoard.getAISymbol();
    const _HUMAN_SYMBOL = gameBoard.getHumanSymbol();
    let _squares = Array.from(document.querySelectorAll('.square'));
    
    _squares.forEach(square => square.addEventListener('click', () => {
        updateSquareText(square);
    }));

    const updateSquareText = (square) => {
        if (square.textContent.length === 0 && gameBoard.checkWinner() === null) {
            square.textContent = _HUMAN_SYMBOL;
            gameBoard.humanMove(square.getAttribute('id'));
        } else 
            return;

        if (gameBoard.checkWinner() === null) {
            let bestPosition = gameBoard.aiMove();
            if (bestPosition !== -1)
                _squares[bestPosition].textContent = _AI_SYMBOL;
        }
    }

    return {

    }
})();