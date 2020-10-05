const Player = (_name, _symbol) => {
    const getName = () => _name;

    const getSymbol = () => _symbol;

    return {
        getName, 
        getSymbol,
    }
};

const gameBoard = (() => {
    let _player1 = Player('xx', 'x');
    let _player2 = Player('oo', 'o');
    let _currentSymbol = 'o';
    let _squares = Array.from(document.querySelectorAll('.square'));

    _squares.forEach(square => square.addEventListener('click', () => {
        updateSquareText(square);
        updateCurrentSymbol();
    }));

    const updateCurrentSymbol = () => {
        if (_currentSymbol === 'x')
            _currentSymbol = 'o';
        else
            _currentSymbol = 'x';
    }

    const updateSquareText = (square) => {
        if (square.textContent.length === 0)
            square.textContent = _currentSymbol;
    }

    return {
    }
})();