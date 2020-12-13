# P42 - Fruit and Vegetable classification and detection

## Group members: Karl Marten Mägi, Krister Looga, Raul-Erik Kattai, Oliver-Erik Suik.

The purpose of this project is to classify fruits and vegetables acquired for the "Fruits 360" dataset from: https://www.kaggle.com/moltean/fruits. 

Firstly we classified single pieces of fruit and then we tried detecting multiple fruit on random images.

All the models are in their separate notebooks with their outputs and there is also a summary notebook that puts all the workflow and the model descriptions together.

### Classification:

First fetch data by running ./fetch.sh

Then setup data by running ./merge.sh

There are three classifiers that we tested: EfficientNet, Sequential and Transfer learning with fine tuning. The first model gave the best accuracy with 95% correctly predicted.

### Object-detection:

We generated our data using a NodeJs script generate.js and uploaded it to roboflow where it can be easily
exported with desired formats. Used tutorial: https://blog.roboflow.com/how-to-create-a-synthetic-dataset-for-computer-vision/.

There are three models using this data: EfficientDet_v2, Yolo_v4 and Retinanet. The first model gave the best accuracy with 65% correctly predicted. In that notebook there are also some examples of how the model performed with the pictures we made.




