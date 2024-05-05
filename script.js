function isNumber(c) { return !isNaN(parseInt(c)); }


function isPiece(c) { return c != ' '; }


function getPieceImgURL(piece) {
        const pieceMap = new Map();
        pieceMap.set('K', 'kw');
        pieceMap.set('Q', 'qw');
        pieceMap.set('R', 'rw');
        pieceMap.set('B', 'bw');
        pieceMap.set('N', 'nw');
        pieceMap.set('P', 'pw');
        pieceMap.set('k', 'kb');
        pieceMap.set('q', 'qb');
        pieceMap.set('r', 'rb');
        pieceMap.set('b', 'bb');
        pieceMap.set('n', 'nb');
        pieceMap.set('p', 'pb');
        var url = 'res/' + pieceMap.get(piece) + '.png';
        return url;

}


function fenToBoard(fen) {
        let index = 63;
        let board = [];
        let c = fen.charAt(0);
        let i = 0;
        while (c != ' ') {
                if (isNumber(c)) {
                        for (let i = 0; i < parseInt(c); i++) {
                                board[63 - index] = ' ';
                                index--;
                        }
                } else if (c === '/') {
                        board[63 - index] = ' ';
                } else {
                        board[63 - index] = c;
                        index--;
                }
                i++;
                c = fen.charAt(i);
        }

        i++;
        c = fen.charAt(i);
        let turn = c;

        return [board, turn];

}


function boardToFen(board, turn) {
        var fen = "";
        let empty = 0;
        for (let i = 0; i < 64; i++) {
                if (board[i] == ' ') {
                        empty++;
                } else {
                        if (empty) {
                                fen += empty;
                        }
                        fen += board[i];
                        empty = 0;
                }

                if ((i + 1) % 8 == 0 && i != 63) {
                        if (empty) {
                                fen += empty;
                        }
                        fen += "/";
                        empty = 0;

                }
        }

        fen += " ";
        if (turn == 0) {
                fen += "w";
        } else {
                fen += "b";
        }

        return fen;
}


function makePiece(piece, index, board) {
        let img = document.createElement('img');
        img.setAttribute('selected', 'false');
        img.setAttribute('type', piece);
        img.setAttribute('index', index);
        img.setAttribute('moved', 'false');
        img.addEventListener('click', (e) => { onClick(img, e, board) });
        img.src = getPieceImgURL(piece);
        return img;
}


function drawBoard(board, turn) {
        const board_div = document.getElementById('board');

        board_div.setAttribute('turn', turn);


        for (let i = 0; i < 64; i++) {

                // stupid ass modulus logic for board
                // modulus by 2 doesn't stay consistent because of alternating pattern
                let lightSquare = false;

                if (Math.floor(i / 8) % 2 === 0 && (i % 2) === 0) {
                        lightSquare = true;
                } else if (Math.floor(i / 8) % 2 === 1 && (i % 2) === 1) {
                        lightSquare = true;
                }

                const square = document.createElement('div');
                square.id = 'square';
                square.setAttribute('index', i);

                if (lightSquare) {
                        square.classList.add('light-square');
                }
                else {
                        square.classList.add('dark-square');
                }
                try {
                        if (isPiece(board[i])) {
                                let img = makePiece(board[i], i, board);
                                img.draggable = false;
                                square.appendChild(img);
                        }
                } catch (error) {
                        console.log('everything broke!!!!!! (making a square in board creation)');
                }
                if (i === 0) {
                        square.style.borderRadius = "10px 0px 0px 0px";
                } else if (i == 7) {
                        square.style.borderRadius = "0px 10px 0px 0px";
                } else if (i == 56) {
                        square.style.borderRadius = "0px 0px 0px 10px";
                } else if (i == 63) {
                        square.style.borderRadius = "0px 0px 10px 0px";
                }


                board_div.appendChild(square);

                // empty div acts as newline
                if ((i + 1) % 8 === 0) {
                        const empty = document.createElement('div');
                        board_div.appendChild(empty);
                }
        }
}

function isWhite(piece) {
        if (piece.toUpperCase() == piece) {
                return true;
        }
        return false;
}


function take(index, img) {
        console.assert(validate());
        const square = document.querySelector('[index="' + index + '"]');
        console.assert(validate());
        //const selected_img = document.querySelector('[selected=true]');
        const old_img = square.querySelector('[selected=false]');
        console.assert(validate());
        square.removeChild(old_img);
        img.setAttribute('selected', 'false');
        console.assert(validate());
}

function castle(king_index, board) {
        let rook_index;
        if (king_index == 63 || king_index == 62) {
                rook_index = 63;
        } else if (king_index == 56 || king_index == 58) {
                rook_index = 56;
        } else if (king_index == 7 || king_index == 6) {
                rook_index = 7;
        } else if (king_index == 0 || king_index == 2) {
                rook_index = 0;
        }
        const rook_square = document.querySelector('[index="' + rook_index + '"]');
        const rook = rook_square.firstChild;
        console.assert(rook != null);
        let new_rook_square;
        if (rook_index == 63) {
                new_rook_square = document.querySelector('[index="' + 61 + '"]');
                board[61] = 'R';
                rook.setAttribute('index', 61);
        } else if (rook_index == 56) {
                new_rook_square = document.querySelector('[index="' + 59 + '"]');
                board[59] = 'R';
                rook.setAttribute('index', 59);
        } else if (rook_index == 7) {
                new_rook_square = document.querySelector('[index="' + 5 + '"]');
                board[5] = 'r';
                rook.setAttribute('index', 5);
        } else if (rook_index == 0) {
                new_rook_square = document.querySelector('[index="' + 3 + '"]');
                board[3] = 'r';
                rook.setAttribute('index', 3);
        }

        rook.setAttribute('moved', 'true');
        rook_square.removeChild(rook);
        new_rook_square.appendChild(rook);
        board[rook_index] = ' ';


}

// TODO: add horsie check
// TODO: add king check
// TODO: debug down left diagonal (king bottom left of queen)
function inCheck(img, game, from, to) {

        var newGame = game.slice();
        const piece = img.getAttribute('type');
        newGame[from] = ' ';
        newGame[to] = piece;
        const white = isWhite(newGame[to]);
        var king_position;
        for (let i = 0; i < 64; i++) {
                if (newGame[i] == 'k' && !white) {
                        king_position = i;
                } else if (newGame[i] == 'K' && white) {
                        king_position = i;
                }
        }
        console.assert(king_position != null);
        const king_x = king_position % 8;
        const king_y = Math.floor(king_position / 8);
        //console.log('inside inCheck');

        var index = (x, y) => { return parseInt(y * 8 + x); };
        var diagonalCheck = () => {
                var isDiagonal = (piece) => { return (piece.toLowerCase() == 'b' || piece.toLowerCase() == 'q'); }
                let x = king_x - 1;
                let y = king_y - 1;
                var piece_at_index;
                while (x >= 0 && y >= 0) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isDiagonal(piece_at_index)) {
                                        return true;
                                } else {
                                        break;
                                }
                        }

                        x--;
                        y--;
                }

                x = king_x + 1;
                y = king_x - 1;
                while (x <= 7 && y >= 0) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isDiagonal(piece_at_index)) {
                                        return true;
                                } else {
                                        break;
                                }
                        }

                        x++;
                        y--;
                }

                x = king_x - 1;
                y = king_y + 1;
                while (x >= 0 && y <= 7) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isDiagonal(piece_at_index)) {

                                        return true;
                                } else if (piece_at_index != ' ') {

                                        break;
                                }
                        }

                        x--;
                        y++;
                }


                x = king_x + 1;
                y = king_y + 1;
                while (x <= 7 && y <= 7) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isDiagonal(piece_at_index)) {
                                        return true;
                                } else {
                                        break;
                                }
                        }

                        x++;
                        y++;
                }

                return false;

        }

        var horizontalCheck = () => {

                var isHorizontal = (piece) => { return (piece.toLowerCase() == 'r' || piece.toLowerCase() == 'q'); }

                var x;
                var y;

                x = king_x - 1;
                y = king_y;
                while (x >= 0) {
                        var piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isHorizontal(piece_at_index)) {

                                        return true;
                                } else {
                                        break;
                                }
                        }

                        x--;
                }


                x = king_x + 1;
                y = king_y;
                while (x <= 7) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isHorizontal(piece_at_index)) {

                                        return true;
                                } else {
                                        break;
                                }
                        }
                        x++;
                }

                x = king_x;
                y = king_y - 1;
                while (y >= 0) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isHorizontal(piece_at_index)) {

                                        return true;
                                } else {
                                        break;
                                }
                        }
                        y--;
                }
                x = king_x;
                y = king_y + 1;
                while (y <= 7) {
                        piece_at_index = newGame[index(x, y)];
                        if (piece_at_index != ' ') {
                                if (isWhite(piece_at_index) != white && isHorizontal(piece_at_index)) {

                                        return true;
                                } else {
                                        break;
                                }
                        }
                        y++;
                }
                return false;
        }

        return diagonalCheck() || horizontalCheck();
}


function isLegalMove(img, game, from, to) {
        const xf = from % 8;
        const yf = Math.floor(from / 8);
        const xt = to % 8;
        const yt = Math.floor(to / 8);
        const dx = xt - xf;
        const dy = yt - yf;
        const piece = img.getAttribute('type');

        function hasPiece(square) {
                const divs_at_index = document.querySelector('[index="' + square + '"]');
                const img_at_index = divs_at_index.firstChild;
                const second_img_at_index = divs_at_index.secondChild;
                if (img_at_index == null) {
                        return false;
                } else if (second_img_at_index != null) {
                        return false;
                } else if (img_at_index.getAttribute('selected') == 'true') {
                        return true;
                }
                return true;

        }
        function hasMoved(square) {
                const divs_at_index = document.querySelector('[index="' + square + '"]');
                const img_at_index = divs_at_index.firstChild;
                if (img_at_index == null) {
                        return true;
                }

                if (img_at_index.getAttribute('moved') == 'false') {
                        return false;
                }

                return true;
        }
        function validDiagonalMove() {
                if (game[to] != ' ' && isWhite(game[to]) == isWhite(piece)) {
                        return false;
                }
                if (Math.abs(dx) == Math.abs(dy) && dx != 0) {
                        const xIterator = dx / Math.abs(dx);
                        const yIterator = dy / Math.abs(dy);
                        let x = xf + xIterator;
                        let y = yf + yIterator;
                        while (x != xt && y != yt) {
                                if (game[y * 8 + x] != ' ') {
                                        return false;
                                }
                                x += xIterator;
                                y += yIterator;
                        }

                        if (game[to] != ' ') {
                                take(to, img);
                                game[to] = ' ';
                                return true;
                        }

                        return true;

                }
                return false;
        }

        function validHorizontalMove() {
                if (game[to] != ' ' && isWhite(game[to]) == isWhite(piece)) {
                        return false;
                }
                if (dy == 0 && dx != 0) {
                        const xIterator = dx / Math.abs(dx);
                        let x = xf + xIterator;
                        while (x != xt) {
                                if (game[yf * 8 + x] != ' ') {
                                        return false;
                                }
                                x += xIterator;
                        }
                        return true;
                } else if (dx == 0 && dy != 0) {
                        const yIterator = dy / Math.abs(dy);
                        let y = yf + yIterator;
                        while (y != yt) {
                                if (game[y * 8 + xf] != ' ') {
                                        return false;
                                }
                                y += yIterator;
                        }
                        return true;
                }
                return false;
        }

        function validCastle() {
                if (from != 60 && from != 4) {
                        return false;
                }

                //if (to != 63 && to != 62 && to != 56 && to != 58 && to != 7 && to != 6 && to != 2 && to != 0){
                if (to != 62 && to != 58 && to != 6 && to != 2) {
                        return false;
                }
                if (isWhite(piece) && hasMoved(60)) {
                        return false;
                }
                if (to == 63 || to == 62) {
                        if (hasMoved(63)) {
                                return false;
                        }

                        if (!hasPiece(62) && !hasPiece(61)) {
                                return true;
                        }
                } else if (to == 56 || to == 58) {

                        if (hasMoved(56)) {
                                return false;
                        }

                        if (!hasPiece(57) && !hasPiece(58) && !hasPiece(59)) {
                                return true;
                        }


                }

                if (hasMoved(4)) {
                        return false;
                }

                if (to == 7 || to == 6) {
                        if (hasMoved(7)) {
                                return false;
                        } if (!hasPiece(5) && !hasPiece(6)) {
                                return true;
                        }
                }

                if (to == 0 || to == 2) {
                        if (hasMoved(0)) {
                                return false;
                        }

                        if (!hasPiece(1) && !hasPiece(2) && !hasPiece(3)) {
                                return true;
                        }
                }

                return false;

        }
        if (piece == 'p') {

                if (dy == 1 && dx == 0 && game[to] == ' ') {
                        return true;
                }
                if (dy == 1 && Math.abs(dx) == 1 && game[to] != ' ' && isWhite(game[to])) {
                        take(to, img);
                        game[to] = ' ';
                        return true;
                }
                if (dy == 2 && dx == 0 && yf == 1 && game[to] == ' ' && game[parseInt(to) - 8] == ' ') {
                        return true;
                }
        } else if (piece == 'P') {
                if (dy == -1 && dx == 0 && game[to] == ' ') {
                        return true;
                } else if (dy == -1 && Math.abs(dx) == 1 && game[to] != ' ' && !isWhite(game[to])) {
                        take(to, img);
                        game[to] = ' ';
                        return true;
                } else if (dy == -2 && dx == 0 && yf == 6 && game[to] == ' ' && game[parseInt(to) + 8] == ' ') {
                        return true;
                }
        } else if (piece == 'n' || piece == 'N') {
                if ((Math.abs(dx) == 2 && Math.abs(dy) == 1) || (Math.abs(dx) == 1 && Math.abs(dy) == 2)) {
                        if (game[to] == ' ') {
                                return true;
                        } else if (isWhite(game[to]) != isWhite(piece)) {
                                take(to, img);
                                game[to] = ' ';
                                return true;
                        }
                }
        } else if (piece == 'b' || piece == 'B') {
                return validDiagonalMove();
        } else if (piece == 'r' || piece == 'R') {
                return validHorizontalMove();
        } else if (piece == 'q' || piece == 'Q') {
                if (validDiagonalMove() || validHorizontalMove()) {
                        return true;
                }
        } else if (piece == 'k' || piece == 'K') {
                if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                        if (game[to] == ' ') {
                                return true;
                        } else if (isWhite(game[to]) != isWhite(piece)) {
                                take(to, img);
                                game[to] = ' ';
                                return true;
                        }
                }

                if (validCastle()) {
                        castle(to, game);
                        return true;
                }
        }


        return false;
}
function validate() {

        var valid = true;
        for (let i = 0; i < 64; i++) {
                const index_divs = document.querySelectorAll('[index="' + i + '"]');
                if (index_divs.length != 2 && index_divs.length != 1) {
                        valid = false;
                }
        }
        return valid;
}
function validateBoard(board) {
        var valid = true;
        for (let i = 0; i < 64; i++) {
                const index_divs = document.querySelectorAll('[index="' + i + '"]');
                if (board[i] != ' ') {
                        if (index_divs.length != 2) {
                                console.log('failure index: ', i);
                                valid = false;
                        }
                } else {
                        if (index_divs.length != 1) {
                                console.log('failure index: ', i);
                                valid = false;
                        }

                }
        }

        return valid;


}

function encodeFen(fen) {
        const map = new Map();
        let encoded_fen = "";
        map.set("/", "_");
        map.set(" ", "+");
        for (const c of fen) {
                if (map.has(c)) {
                        encoded_fen += map.get(c);
                } else {
                        encoded_fen += c;
                }
        }
        return encoded_fen;

}

function fetchMove(board, turn) {
        let fen = boardToFen(board, turn);
        let encoded_fen = encodeFen(fen);
        let url = 'http://127.0.0.1:5000/' + encoded_fen;
        console.log('sending request: ', url)
        return new Promise((resolve, reject) => {

                fetch(url)
                        .then(response => {
                                if (!response.ok) {
                                        throw new Error("Error: fetch failed");
                                }
                                return response.text();
                        })
                        .then(data => {
                                console.log('recieved: ', data)
                                resolve(data);
                        })
                        .then(error => {
                                if (error) {
                                        console.log('Error: fetch returned error')
                                        reject(error);
                                }
                        })
        })
}


function replaceBoard(fen) {
        const board_div = document.getElementById('board');
        while (board_div.firstChild) {
                board_div.removeChild(board_div.firstChild);
        }
        [board, turn] = fenToBoard(fen);
        drawBoard(board, turn);
}


function makeEngineMove(board, turn) {
        fetchMove(board, turn)
                .then(output_fen => {
                        try {
                                replaceBoard(output_fen);
                        } catch (error) {
                                console.log('could not make board with fen:', output_fen)
                                drawBoard(board, turn)
                        }
                        waiting_for_engine = false;
                })
}


function onPickup(img, event) {
        img.setAttribute('selected', 'true');

        let squareRect = document.getElementsByClassName('light-square')[0]
                .getBoundingClientRect();
        let squareSize = squareRect.width;
        img.style.position = 'absolute';
        img.style.left = event.pageX - squareSize / 1.75 + 'px';
        img.style.top = event.pageY - squareSize + 'px';
        img.style.width = squareSize + 'px';
        img.style.height = squareSize + 'px';
        img.style.zIndex = 999;
        img.removeEventListener('click', (e) => { onClick(img, e) });
}


// TODO: check for win
// TODO: end screen
//
var waiting_for_engine = false;
function onDrop(img, event, board) {
        console.assert(validateBoard(board));
        console.assert(img.getAttribute('selected') == 'true');
        const origin_square = document.querySelector('[index="' + img.getAttribute('index') + '"]');
        const elements_at_coordinates = document.elementsFromPoint(event.clientX, event.clientY);
        var square_at_coordinates = null;
        for (let i = 0; i < elements_at_coordinates.length; i++) {
                if (elements_at_coordinates[i].id == 'square') {
                        square_at_coordinates = elements_at_coordinates[i];
                }
        }

        console.assert(square_at_coordinates != null);
        const to = square_at_coordinates.getAttribute('index');
        const from = img.getAttribute('index');
        var checkBool = inCheck(img, board, from, to);
        if (to != null && !checkBool && isLegalMove(img, board, from, to)) {
                // console.log("check boolean: ", checkBool);
                img.style.zIndex = 1;
                board[from] = ' ';
                board[to] = img.getAttribute('type');
                img.setAttribute('moved', 'true');
                square_at_coordinates.appendChild(img);
                var img_at_square = square_at_coordinates.querySelector('[index="' + to + '"]');
                if (img_at_square != null) {
                        square_at_coordinates.removeChild(img_at_square);
                }
                img.setAttribute('selected', 'false');
                img.setAttribute('index', square_at_coordinates.getAttribute('index'));
                console.assert(validateBoard(board));
                img.style.position = 'relative';
                img.style.left = 0;
                img.style.top = 0;
                var board_div = document.getElementById('board');
                if (board_div.getAttribute('turn') == 'w') {
                        board_div.setAttribute('turn', 'b');
                } else {
                        board_div.setAttribute('turn', 'w');
                }
                waiting_for_engine = true;
                makeEngineMove(board, board_div.getAttribute('turn'))

        } else {
                //console.log("check boolean: ", checkBool);
                img.style.zIndex = 1;
                origin_square.appendChild(img);
                img.setAttribute('selected', 'false');
                img.style.position = 'relative';
                img.style.left = 0;
                img.style.top = 0;
        }
}


function onClick(img, event, board) {
        if (img.getAttribute('selected') == 'true') {
                onDrop(img, event, board);
        } else if (!waiting_for_engine) {
                var board_div = document.getElementById('board');
                if (isWhite(img.getAttribute('type')) && board_div.getAttribute('turn') == 'b') {
                        return;
                } else if (!isWhite(img.getAttribute('type')) && board_div.getAttribute('turn') == 'w') {
                        return;
                }
                if (document.querySelector('[selected=true]') != null) {
                        return;
                }

                onPickup(img, event, board);
        }
}


function onMouseMove(e) {
        try {
                let moved_piece = document.querySelector('[selected=true]');

                if (moved_piece == null) {
                        return;
                }

                moved_piece.style.left = e.pageX - moved_piece.width / 1.75 + 'px';
                moved_piece.style.top = e.pageY - moved_piece.width + 'px';
        } catch (error) {
                return;
        }

}




var fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'


let [board, turn] = fenToBoard(fen);
drawBoard(board, turn);
document.addEventListener('mousemove', (e) => { onMouseMove(e); });
