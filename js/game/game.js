export class Game {
    static points = {
        1: 100,
        2: 300,
        3: 500,
        4: 800
    };

    constructor() {
        this.reset()
    }
    
    get level() {
        return Math.min(Math.floor(this.lines / 2) + 1);
    }

    getState() {
        const playfield = this.createPlayfield();
        
        this.playfield.forEach((row, y) => {
            playfield[y] = [...row];
        });

        const { y: pieceY, x: pieceX, blocks } = this.activePiece;
        
        blocks.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block) {
                    playfield[pieceY + y][pieceX + x] = block;
                }
            });
        });

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        };
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createPlayfield() {
        const playfield = []

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const piece = {}

        switch (type) {
            case "I":
                piece.blocks = [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;
            case "J":
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,0]
                ];
                break;
            case "L":
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [3,0,0]
                ];
                break;
            case "O":
                piece.blocks = [
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ];
                break;
            case "S":
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ];
                break;
            case "T":
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ];
                break;
            case "Z":
                piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ];
                break;
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece
    }

    movePieceLeft() {
        this.activePiece.x -= 1;

        if (this.hasCollision()) {
            this.activePiece.x += 1
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.hasCollision()) {
            this.activePiece.x -= 1
        }
    }

    movePieceDown() {
        if (this.topOut) return

        this.activePiece.y += 1;

        if (this.hasCollision()) {
            const clearedlines = this.clearLines();

            this.activePiece.y -= 1
            this.lockPiece();
            this.updateScore(clearedlines);
            this.updatePieces();
        }

        if (this.hasCollision()) [
            this.topOut = true
        ]
    }

    rotatePiece() {
        this.rotateBlocks()
        if (this.hasCollision()) {
            this.rotateBlocks(false)
        }
    }

    rotateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp; 
                }
            }    
        }
    }

    hasCollision() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        return blocks.some((row, y) => 
            row.some((block, x) => {
                if (!block) return false;
                
                const fieldY = pieceY + y;
                const fieldX = pieceX + x;
                
                return fieldY < 0 || 
                       fieldY >= this.playfield.length || 
                       fieldX < 0 || 
                       fieldX >= this.playfield[0].length || 
                       this.playfield[fieldY][fieldX];
            })
        );
    }

    lockPiece() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        blocks.forEach((row, y) => {
            row.forEach((block, x) => {
                if (block) {
                    this.playfield[pieceY + y][pieceX + x] = block;
                }
            });
        });
    }

    clearLines() {
        const lines = [];
        const columns = this.playfield[0].length;

        this.playfield.forEach((row, y) => {
            if (row.every(cell => cell !== 0)) {
                lines.push(y);
            }
        });

        lines.reverse().forEach(lineIndex => {
            this.playfield.splice(lineIndex, 1);
            this.playfield.unshift(Array.from({ length: columns }, () => 0));
        });

        return lines.length;
    }

    updateScore(clearedLines) {
        console.log(this.level)
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
            console.log(this.score, this.lines, this.level)
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}
