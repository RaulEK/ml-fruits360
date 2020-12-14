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

### Used sources:
https://towardsdatascience.com/state-of-the-art-image-classification-algorithm-fixefficientnet-l2-98b93deeb04c  
https://keras.io/examples/vision/image_classification_efficientnet_fine_tuning/  
https://keras.io/api/applications/efficientnet/#efficientnetb7-function  
https://keras.io/api/preprocessing/image/  
https://github.com/facebookresearch/FixRes  
https://towardsdatascience.com/decoding-state-of-the-art-object-detection-99f79d97b75d   
https://github.com/signatrix/efficientdet   
https://github.com/Tessellate-Imaging/Monk_Object_Detection/tree/master/4_efficientdet   
https://github.com/xuannianz/EfficientDet/blob/master/README_quad.md   
https://github.com/ravi02512/efficientdet-keras   
https://neurohive.io/en/news/yolo-v4-is-the-new-state-of-the-art-object-detector/   
https://pypi.org/project/yolov4/   
https://github.com/taipingeric/yolo-v4-tf.keras  
https://github.com/Ma-Dan/keras-yolo4   
https://keras.io/examples/vision/retinanet/  
https://blog.roboflow.com/training-efficientdet-object-detection-model-with-a-custom-dataset/  


