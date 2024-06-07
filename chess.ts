
const WHITE = 1 
const BLACK = -1


function isNumber(c: string) { return !isNaN(parseInt(c)); }

class Piece {
        _type : string
        _has_moved: boolean
        constructor(type: string, has_moved = false){
                this._type = type
                this._has_moved = has_moved
        }
        get type() {
                return this._type
        }
        get hasMoved() {
                return this._has_moved
        }
        move() {
                this._has_moved = true
        }
}


class Board {
        _board : Piece[]
        _turn: number
        constructor(fen: string){
                this._board = []
                let index = 63
                let c = fen.charAt(0)
                let i = 0
                while (c != ' ') {
                        if (isNumber(c)) {
                                for (let i = 0; i < parseInt(c); i++) {
                                        this._board[63 - index] = new Piece(' ')
                                        index--
                                }
                        } else if (c === '/') {
                                this._board[63 - index] = new Piece(' ')
                        } else {
                                this._board[63 - index] = new Piece(c)
                                index--
                        }
                        i++
                        c = fen.charAt(i)
                }

                i++
                c = fen.charAt(i)
                if (c === "w"){
                        this._turn = WHITE
                } else {
                        this._turn = BLACK
                }

        }

}
