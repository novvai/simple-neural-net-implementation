# Simple Neural Net Implementation

A minimal, easy-to-use neural network implementation for classification problems, written in JavaScript/TypeScript. This repository provides a straightforward API for constructing, training, and using feedforward neural networks. The default activation function is Sigmoid, making it ideal for basic machine learning tasks or educational purposes.

## Features

- Lightweight neural network for classification
- Built with JavaScript/TypeScript for easy integration
- Customizable network architecture (inputs, outputs, hidden layers)
- Simple API for training and prediction
- Sigmoid activation by default
- Suitable for experimentation and learning

## Installation

Clone the repository:

```bash
git clone https://github.com/novvai/simple-neural-net-implementation.git
cd simple-neural-net-implementation
```

Install dependencies (if required):

```bash
npm install
```

## Usage

Example of creating and training a neural network:

```js
const NeuralNet = new NeuralNetV2(2, 2, 100, 0.1);
NeuralNet.addHiddenLayer(64);
NeuralNet.training(trSet, LblSet);
```

- `trSet`, `LblSet`: Arrays containing the training data and corresponding labels.
- `NeuralNetV2(inputs, outputs, epochs, learning_rate)`: Initialize the neural network.
- `.addHiddenLayer(nodes)`: Add a hidden layer with the specified number of nodes.
- `.training(trainingSet, labelSet)`: Train the network.
- `.feedForward(inputs)`: Get the network's prediction for the given inputs.

## API Reference

### NeuralNetV2 Class

- **Constructor:**  
  `NeuralNetV2(number_of_inputs, number_of_outputs, epochs, learning_rate)`
- **addHiddenLayer(number_of_hidden_nodes)**  
  Adds a hidden layer to the network.
- **training(trainingSet, labelSet)**  
  Trains the neural network on the provided data.
- **feedForward(inputs)**  
  Returns `[result, inputs]` for the given input array.

## Example Data Format

Training and label sets are arrays of values representing your input features and expected output labels:

```js
const trSet = [
  [180, 84, 203],
  [197, 249, 204],
  // ...
];

const LblSet = [
  [1],
  [1],
  // ...
];
```

## Build

To build the project using webpack:

```bash
npm run build
```

Webpack is configured to bundle the project from `src/main.ts` to `public/dist/app.js`.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## Contact

For questions or feedback, please create an issue on GitHub.
