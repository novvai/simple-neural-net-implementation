# Simple Neural-Net implementation
Made in JS/TS
Easy to use, for classification problems 
Default activation function is Sigmoid

```js
  const NeuralNet = new NeuralNetV2(2,2,100,0.1);
  NeuralNet.addHiddenLayer(64);
  NeuralNet.training(trSet, LblSet);
```

trSet, LblSet - arrays containing the information that we are going to train the Net on
class NeuralNet(number_of_inputs, number_of_outputs, epochs, learning_rate);
.addHiddenLayer(number_of_hidden_nodes);
.feedForward(inputs) - returns [result, inputs];
