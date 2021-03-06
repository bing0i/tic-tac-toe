const Player = (_name, _symbol, _color) => {
    const getName = () => _name;

    const getSymbol = () => _symbol;

    const getSymbolColor = () => _color;

    return {
        getName, 
        getSymbol,
        getSymbolColor,
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
    let _player1 = Player('xx', 'x', '#55acee');
    let _player2 = Player('oo', 'o', '#fa743e');

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

    const getHumanSymbol = () => _HUMAN_SYMBOL;

    const getAISymbol = () => _AI_SYMBOL;

    const getPlayer1Symbol = () => _player1.getSymbol();

    const getPlayer2Symbol = () => _player2.getSymbol();

    const getPlayer1SymbolColor = () => _player1.getSymbolColor();

    const getPlayer2SymbolColor = () => _player2.getSymbolColor();

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
        getPlayer1SymbolColor,
        getPlayer2SymbolColor,
        clearBoard,
    }
})();

const displaySquaresText = (() => {
    const _AI_SYMBOL = gameBoard.getAISymbol();
    const _AI_SYMBOL_COLOR = '#55acee';
    const _HUMAN_SYMBOL = gameBoard.getHumanSymbol();
    const _HUMAN_SYMBOL_COLOR = '#fa743e';
    const _PLAYER1_SYMBOL = gameBoard.getPlayer1Symbol();
    const _PLAYER1_SYMBOL_COLOR = gameBoard.getPlayer1SymbolColor();
    const _PLAYER2_SYMBOL = gameBoard.getPlayer2Symbol();
    const _PLAYER2_SYMBOL_COLOR = gameBoard.getPlayer2SymbolColor();
    let player1Turn = true;

    let _squares = Array.from(document.querySelectorAll('.square'));
    let _winner = document.querySelector('#winner'); 
    let _turn = document.querySelector('#turn');
    let _thinkingIcon = document.querySelector('#thinkingIcon');

    const runAIMode = () => {
        _squares.forEach(square => square.addEventListener('click', updateBoardAIMode));
    }

    const removeAIMode = () => {
        _squares.forEach(square => square.removeEventListener('click', updateBoardAIMode));
    }

    const updateBoardAIMode = () => {
        let winner = gameBoard.checkWinner();
        if (winner !== null || event.target.textContent.length !== 0) {
            return;
        } else {
            event.target.textContent = _HUMAN_SYMBOL;
            event.target.style.color = _HUMAN_SYMBOL_COLOR;
            gameBoard.humanMove(event.target.getAttribute('id'), _HUMAN_SYMBOL);
            _turn.textContent = 'X\'s turn';
            _turn.style.backgroundColor = '#55acee';
        }

        winner = gameBoard.checkWinner();
        if (winner === 'o') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#fa743e';
            return;
        } else if (winner === 'x') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#55acee';
            return;
        } else if (winner === 'tie') {
            _winner.textContent = 'Tie!';
            _winner.style.color = 'black';
            return;
        } else { 
            let bestPosition = gameBoard.aiMove();
            if (bestPosition !== -1) {
                _squares[bestPosition].textContent = _AI_SYMBOL;
                _squares[bestPosition].style.color = _AI_SYMBOL_COLOR;
                _turn.textContent = 'O\'s turn';
                _turn.style.backgroundColor = '#fa743e';
            }
        }

        winner = gameBoard.checkWinner();
        if (winner === 'o') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#fa743e';
        } else if (winner === 'x') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#55acee';
        } else if (winner === 'tie') {
            _winner.textContent = 'Tie!';
            _winner.style.color = 'black';
        }
    }

    const runPlayerMode = () => {
        _squares.forEach(square => square.addEventListener('click', updateBoardPlayerMode));
    }

    const removePlayerMode = () => {
        _squares.forEach(square => square.removeEventListener('click', updateBoardPlayerMode));
    }

    const updateBoardPlayerMode = () => {
        let winner = gameBoard.checkWinner();
        if (winner !== null || event.target.textContent.length !== 0) {
            return;
        } else {
            let symbol = '';
            if (player1Turn) {
                symbol = _PLAYER1_SYMBOL;
                player1Turn = false;
                event.target.style.color = _PLAYER1_SYMBOL_COLOR;
                _turn.textContent = 'O\'s turn';
                _turn.style.backgroundColor = '#fa743e';
            } else {
                symbol = _PLAYER2_SYMBOL;
                player1Turn = true;
                event.target.style.color = _PLAYER2_SYMBOL_COLOR;
                _turn.textContent = 'X\'s turn';
                _turn.style.backgroundColor = '#55acee';
            }
            event.target.textContent = symbol;
            gameBoard.humanMove(event.target.getAttribute('id'), symbol);
        } 
        
        winner = gameBoard.checkWinner();
        if (winner === 'o') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#fa743e';
        } else if (winner === 'x') {
            _winner.textContent = 'Nice, ' + winner.toUpperCase() + '!';
            _winner.style.color = '#55acee';
        } else if (winner === 'tie') {
            _winner.textContent = 'Tie!';
            _winner.style.color = 'black';
        }
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

const setupGame = (() => {
    let _switchPlayMode = document.querySelector('#toggle');
    let _resetButton = document.querySelector('#resetBtn');
    let _modeText = document.querySelector('#modeText');
    let _winner = document.querySelector('#winner'); 
    let _turn = document.querySelector('#turn');

    const initSwitchPlayMode = () => {
        resetGame();
        _switchPlayMode.addEventListener('change', resetGame);
    }

    const resetGame = () => {
        gameBoard.clearBoard();
        displaySquaresText.clearSquares();
        _winner.textContent = '';
        if(_switchPlayMode.checked) {
            _modeText.textContent = 'Human vs. AI';
            displaySquaresText.removePlayerMode();
            displaySquaresText.runAIMode();
            _turn.textContent = 'O\'s turn';
            _turn.style.backgroundColor = '#fa743e';
        } else {
            _modeText.textContent = 'Human vs. Human';
            displaySquaresText.removeAIMode();
            displaySquaresText.runPlayerMode();
            _turn.textContent = 'X\'s turn';
            _turn.style.backgroundColor = '#55acee';
        }
    }

    const initResetButton = () => {
        _resetButton.addEventListener('click', resetGame);
    }

    return {
        initSwitchPlayMode,
        initResetButton,
    }
})();

setupGame.initSwitchPlayMode();
setupGame.initResetButton();