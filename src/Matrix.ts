export class Matrix {
    /**
     * @var Number of rows and columns in our matrix
     */
    private rows: number;
    private cols: number;

    private entries: Array<Array<number>>;

    /**
     * @param rows {number}
     * @param columns {number}
     */
    constructor(rows: number, columns: number) {
        this.rows = rows;
        this.cols = columns;
        this.setup();
    }

    /**
     * @returns {number}
     */
    getRows(): number {
        return this.rows;
    }

    /**
     * @returns {number}
     */
    getCols(): number {
        return this.cols;
    }
    /**
     * Create matrix from array
     * 
     * @param inputMatrix 
     */
    public make(inputMatrix: Array<Array<number>>) {
        if (inputMatrix.length == this.rows && inputMatrix[0].length == this.cols) {
            this.entries = inputMatrix;
        }
    }
    /**
     * Fill Random RxC matrix
     */
    public randomize() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.entries[r][c] = this.rand();
            }
        }
    };

    /**
     * 
     */
    public toArray(): Array<Array<number>> {
        return this.entries;
    }

    /**
     * Adds two matricies together element wise
     * 
     * @param multiplier Matrix
     */
    add(multiplier: Matrix | number): Matrix {
        if (multiplier instanceof Matrix) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.entries[r][c] += multiplier.entries[r][c];
                }
            }
        } else {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.entries[r][c] += multiplier;
                }
            }
        }
        return this;
    }

    /**
     * Subtract element wise
     * 
     * @param multiplier Matrix
     */
    subtract(multiplier: Matrix): Matrix {
        if (multiplier instanceof Matrix) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.entries[r][c] -= multiplier.entries[r][c];
                }
            }
        } else {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.entries[r][c] -= multiplier;
                }
            }
        }
        return this;
    }

    /**
     * Subtract element wise
     * 
     * @param multiplier Matrix
     */
    static subtract(matrix: Matrix, matrixB: Matrix | number): Matrix {
        const newMatrix = new Matrix(matrix.getRows(), matrix.getCols())
        let copiedEntries = matrix.copy();
        if (matrixB instanceof Matrix) {
            for (let r = 0; r < matrixB.rows; r++) {
                for (let c = 0; c < matrixB.cols; c++) {
                    copiedEntries[r][c] -= matrixB.entries[r][c];
                }
            }
        } else {
            for (let r = 0; r < matrix.rows; r++) {
                for (let c = 0; c < matrix.cols; c++) {
                    copiedEntries[r][c] -= matrixB;
                }
            }
        }
        newMatrix.make(copiedEntries);

        return newMatrix;
    }

    /**
     * 
     * @param matrix
     */
    static transpose(matrix: Matrix): Matrix {
        let newMatrix = new Matrix(matrix.getCols(), matrix.getRows());

        for (let r = 0; r < newMatrix.getRows(); r++) {
            for (let c = 0; c < newMatrix.getCols(); c++) {
                newMatrix.entries[r][c] = matrix.entries[c][r];
            }
        }

        return newMatrix;
    }

    /**
     * Multiplication of Matrix by Scallar or by Matrix
     * 
     * @param matrix 
     * @param multiplier 
     * @return Matrix
     */
    static multy(matrix: Matrix, multiplier: Matrix | number): Matrix {
        let result;
        let matrixCopy = matrix.copy();
        if (typeof multiplier == "number") {
            result = new Matrix(matrix.rows, matrix.cols);
            for (let r = 0; r < matrix.rows; r++) {
                for (let c = 0; c < matrix.cols; c++) {
                    matrixCopy[r][c] = matrixCopy[r][c] * multiplier;
                }
            }
            result.make(matrixCopy);
        } else {
            result = new Matrix(matrix.rows, multiplier.cols);
            let newMatrix = []
            for (let r = 0; r < matrix.rows; r++) {
                let newRow = []
                for (let mC = 0; mC < multiplier.cols; mC++) {
                    let rowRes = 0
                    for (let c = 0; c < matrix.cols; c++) {
                        rowRes += matrix.entries[r][c] * multiplier.entries[c][mC]
                    }
                    newRow.push(rowRes);
                }
                newMatrix.push(newRow);
            }
            result.make(newMatrix);
        }
        return result;
    }
    /**
     * Multiplication of Matrix by Scallar or by Matrix
     * 
     * @param matrix 
     * @param multiplier 
     * @return Matrix
     */
    static multyElWise(matrix: Matrix, multiplier: Matrix | number): Matrix {
        let result;
        let matrixCopy = matrix.copy();
        if (typeof multiplier == "number") {
            result = new Matrix(matrix.rows, matrix.cols);
            for (let r = 0; r < matrix.rows; r++) {
                for (let c = 0; c < matrix.cols; c++) {
                    matrixCopy[r][c] = matrixCopy[r][c] * multiplier;
                }
            }
            result.make(matrixCopy);
        } else {
            result = new Matrix(matrix.rows, multiplier.cols);
            for (let r = 0; r < matrix.rows; r++) {
                for (let c = 0; c < matrix.cols; c++) {
                    result.entries[r][c] = matrix.entries[r][c] * multiplier.entries[r][c]
                }
            }
        }
        return result;
    }

    /**
     * Apply function to every element
     * 
     * @param matrix {Matrix}
     * @param fun {CallableFunction}
     * @returns Matrix
     */
    static map(matrix: Matrix, fun: CallableFunction): Matrix {
        const newMatrix = new Matrix(matrix.getRows(), matrix.getCols());
        let matrixCopy = matrix.copy();
        for (let r = 0; r < matrix.getRows(); r++) {
            for (let c = 0; c < matrix.getCols(); c++) {
                matrixCopy[r][c] = fun(matrixCopy[r][c]);
            }
        }

        newMatrix.make(matrixCopy);

        return newMatrix;
    }

    public copy() {
        return JSON.parse(JSON.stringify(this.entries));
    }

    /**
     * Initialise empty matrix with the given dimensions
     * 
     * @return void
     */
    private setup() {
        this.entries = [];
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.cols; c++) {
                row.push(0);
            }
            this.entries.push(row);
        }
    }

    /**
     * Random numbers between -1:1
     * 
     * @return {number}
     */
    private rand(): number {
        return Math.random() * 2 - 1;
    }

    public show() {
        console.table(this.entries);
    }
    public addRow(row: Array<number>) {
        this.rows += 1;
        this.entries.push(row);
    }
}