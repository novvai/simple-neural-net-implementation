import { Matrix } from "./Matrix";

export class NeuralNetV2 {
    input_nodes: number;
    out_nodes: number;

    private layers: Array<Matrix> = [];
    private learning_rate: number;
    private memory: Array<Matrix> = [];
    private activation_func: String = `relu`;
    private epocs: number;
    private batch_size: number = 1;
    private layer_gradiant: Array<Matrix> = [];

    constructor(input_nodes: number, out_nodes: number, epocs: number = 100, learning_rate: number = 0.1, activation_function: string = "relu") {
        this.input_nodes = input_nodes;
        this.out_nodes = out_nodes;
        this.epocs = epocs;
        this.learning_rate = learning_rate;
        this.activation_func = activation_function;
    }

    public setBatchSize(size: number = 1): void {
        this.batch_size = size;
    }

    public addHiddenLayer(nodes: number) {
        let layer: Matrix;
        const layers_count = this.layers.length;

        if (layers_count > 0) {
            layer = new Matrix(nodes, this.layers[layers_count - 1].getRows() + 1)
        } else {
            layer = new Matrix(nodes, this.input_nodes + 1)
        }

        this.layers.push(layer);
    }
    public create() {
        this.addHiddenLayer(this.out_nodes);
        this.bootstrap();
    }
    private bootstrap() {
        this.layers.forEach(layer => {
            this.layer_gradiant.push(new Matrix(layer.getRows(), layer.getCols()));
            layer.randomize();
        });
    }

    public feedForwad(input_arr: Array<Array<number>>, preprocess: boolean = true): Array<Matrix> {
        let result: Matrix;
        let input_matrix = new Matrix(input_arr.length + 1, input_arr[0].length);
        this.memory = [];
        if (preprocess) {
            input_arr.push([1])
        }

        input_matrix.make(input_arr);
        result = new Matrix(input_matrix.getRows(), input_matrix.getCols());
        result.make(input_matrix.copy());

        this.layers.forEach((layer, index: number) => {
            /** Compute every layer */

            result = Matrix.multy(layer, result);
            result = Matrix.map(result, this.sigmoid);
            /** Memorise current layer output */
            let memoryResult = new Matrix(result.getRows(), result.getCols());
            memoryResult.make(result.copy());
            this.memory.push(memoryResult);
            /** Add a single column for bias computation if its not the last layer */
            if (index != this.layers.length - 1) {
                result.addRow([1]);
            }
        });

        return [result, input_matrix];
    }

    public training(inputs_arr: Array<Array<number>>, answers: Array<Array<number>>) {
        for (let epoc = 0; epoc < this.epocs; epoc++) {
            console.log(`Epoc: ${epoc+1}`);
            inputs_arr.forEach((element, i) => {
                let processed_arr: Array<Array<number>> = [];
                let processed_answ: Array<Array<number>> = []
                const ans = new Matrix(answers[i].length, 1);
                element.map((x: number) => processed_arr.push([x]));
                answers[i].map((x: number) => processed_answ.push([x]));
                ans.make(processed_answ)

                let [res, input_matrix] = this.feedForwad(processed_arr);
                /*****************************************************/
                let error: Matrix = Matrix.subtract(res, ans);
                
                if ((i + 1) % this.batch_size != 0 && i + 1 != inputs_arr.length){
                    // error.show()
                    for (let l = this.layers.length - 1; 0 <= l; l--) {
                        if (l != this.layers.length - 1) {
                            let prev_l_t = Matrix.transpose(this.layers[l + 1]);
                            error = Matrix.multy(prev_l_t, error);
                        }

                        let gradient = Matrix.map(this.memory[l], (x: number) => { return x * (1 - x) });

                        gradient = Matrix.multyElWise(gradient, error);
                        gradient = Matrix.multy(gradient, this.learning_rate);

                        if (this.layers.length > 1 && l != 0) {
                            gradient = Matrix.multy(gradient, Matrix.transpose(this.memory[l - 1]));
                        } else {
                            gradient = Matrix.multy(gradient, Matrix.transpose(input_matrix));
                        }
                        this.layer_gradiant[l].show();
                        gradient.show(); 
                        this.layer_gradiant[l].add(gradient);
                    }
                }else {
                    for (let l = this.layers.length - 1; 0 <= l; l--) {
                        this.layers[l] = Matrix.subtract(this.layers[l], this.layer_gradiant[l]);
                        this.layer_gradiant[l] = new Matrix(this.layers[l].getRows(),this.layers[l].getCols())
                    }
                }
            });

        }
    }

    public tester(inputs_arr: Array<Array<number>>, answers: Array<Array<number>>) {
        let truesCount = inputs_arr.length, outputsCount = 0;

        inputs_arr.forEach((element, i) => {
            let processed_arr: Array<Array<number>> = [];
            let processed_answ: Array<Array<number>> = []
            const ans = new Matrix(answers[i].length, 1);
            element.map((x: number) => processed_arr.push([x]));
            answers[i].map((x: number) => processed_answ.push([x]));
            ans.make(processed_answ)

            let [res, input_matrix] = this.feedForwad(processed_arr);
            let a = (res.toArray()[0][0] > .50) ? 1 : 0;
            if (a == ans.toArray()[0][0]) {
                outputsCount++;
            }
            console.log(res.toArray()[0][0], '=-=', ans.toArray()[0][0], " : ", processed_arr)
        });

        return outputsCount / truesCount;
    }

    public save() {
        console.log(JSON.stringify(this.layers));
    }
    public load(neuralString: string) {
        let loadedLayers = JSON.parse(neuralString);
        loadedLayers.forEach((element: any) => {
            let layer: Matrix;
            // const layers_count = this.layers.length;
            layer = new Matrix(element.rows, element.cols)
            layer.make(element.entries);
            this.layers.push(layer);
        });
    };

    /**
     * Activation function
     * 
     * @param x {number}
     * @returns {number}
     */
    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }
    /**
     * Activation function
     * 
     * @param x {number}
     * @returns {number}
     */
    private relu(x: number): number {
        return Math.max(0, x);
    }

    public getActivationFunc() {
        switch (this.activation_func) {
            case 'relu':
                return this.relu;
            case 'sigmoid':
                return this.sigmoid;
            default:
                throw (`Error: ${this.activation_func} not found!`)
                break;
        }
    }
}