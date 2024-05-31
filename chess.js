
function isNumber(c) { return !isNaN(parseInt(c)); }

export function isPiece(c) { return c != ' '; }


export function fenToBoard(fen) {
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


export function boardToFen(board, turn) {
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


