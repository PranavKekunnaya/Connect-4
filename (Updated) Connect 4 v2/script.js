document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const restartBtn = document.querySelector('.restart-btn');
    const rulesModal = document.getElementById('rulesModal');
    const rulesBtn = document.querySelector('.rules-btn');
    const closeModal = document.getElementById('closeModal');
    const columns = Array.from({ length: 7 }, () => []);
    let currentPlayer = 'player1';
    let gameWon = false;

    function createCell(row, col) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.column = col;
        cell.dataset.row = row;
        cell.dataset.player = '';
        return cell;
    }

    function showWinMessage(winningPlayer) {
        const winMessage = document.createElement('div');
        winMessage.className = 'win-message';
        winMessage.textContent =`${winningPlayer} wins! Click restart to continue`;
        document.body.appendChild(winMessage);
        winMessage.addEventListener('click', () => {
            winMessage.remove();
            // Implement further actions here, if needed
        });

        // Flashing effect
        let isVisible = true;
        const flashInterval = setInterval(() => {
            isVisible = !isVisible;
            if (isVisible) {
                winMessage.style.display = 'block';
            } else {
                winMessage.style.display = 'none';
            }
        }, 500);

        // Stop flashing after 5 seconds
        setTimeout(() => {
            clearInterval(flashInterval);
            winMessage.style.display = 'block'; // Ensure the message is visible when flashing stops
        }, 5000);
    }

    function checkForWin(cell) {
        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.column);
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (const direction of directions) {
            const [dx, dy] = direction;
            let count = 1;

            for (let i = 1; i < 4; i++) {
                const newRow = row + i * dy;
                const newCol = col + i * dx;

                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7) {
                    const neighbor = grid.querySelector(`[data-row="${newRow}"][data-column="${newCol}"]`);
                    if (neighbor.dataset.player === cell.dataset.player) {
                        count++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            for (let i = -1; i > -4; i--) {
                const newRow = row + i * dy;
                const newCol = col + i * dx;

                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7) {
                    const neighbor = grid.querySelector(`[data-row="${newRow}"][data-column="${newCol}"]`);
                    if (neighbor.dataset.player === cell.dataset.player) {
                        count++;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }

            if (count >= 4) {
                gameWon = true;
                showWinMessage(cell.dataset.player);
                return;
            }
        }
    }

    function dropCoin(column) {
        if (!gameWon) {
            const cellsInColumn = columns[column];
            for (let i = cellsInColumn.length - 1; i >= 0; i--) {
                const cell = cellsInColumn[i];
                if (!cell.dataset.player) {
                    cell.dataset.player = currentPlayer;
                    cell.classList.add(currentPlayer);
                    checkForWin(cell);
                    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
                    break;
                }
            }
        }
    }

    function createGrid() {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = createCell(row, col);
                columns[col].push(cell);
                grid.appendChild(cell);
            }
        }
    }

    let gameState = [];

    function handleMove(player, column) {
        if (!gameWon) {
            const cellsInColumn = columns[column];
            for (let i = cellsInColumn.length - 1; i >= 0; i--) {
                const cell = cellsInColumn[i];
                if (!cell.dataset.player) {
                    cell.dataset.player = player;
                    cell.classList.add(player);
                    checkForWin(cell); // Check if this move resulted in a win
                    gameState.push({ player, column }); // Update the game state
                    currentPlayer = player === 'player1' ? 'player2' : 'player1'; // Switch to the other player
                    break;
                }
            }
        }
    }
    function resetBoard() {
        const winMessage = document.querySelector('.win-message');
        if (winMessage) {
            winMessage.remove();
        }
        columns.forEach((col) => {
            col.forEach((cell) => {
                cell.dataset.player = '';
                cell.classList.remove('player1', 'player2');
            });
        });
        currentPlayer = 'player1';
        gameWon = false;
    }
  
    createGrid();

    grid.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            const column = e.target.dataset.column;
            dropCoin(column);
        }
    });

    restartBtn.addEventListener('click', () => {
        columns.forEach((col) => {
            col.forEach((cell) => {
                cell.dataset.player = '';
                cell.classList.remove('player1', 'player2');
            });
        });
        currentPlayer = 'player1';
        gameWon = false;
        const winMessage = document.querySelector('.win-message');
        if (winMessage) {
            winMessage.remove();
        }
    });

    rulesBtn.addEventListener('click', () => {
        rulesModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        rulesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });

});
