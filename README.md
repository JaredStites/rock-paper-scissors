# rock-paper-scissors
Rock, paper, scissors that uses machine learning to identify player IRL gestures to play

This was my first personal project using machine learning with TensorFlow. This went through several iterations as the first models were really, really bad. In this version I utilized more image augmentations using Albumentations as well as two different rock, paper, scissors datasets from Kaggle. Although much better than previous versions it still struggles correctly identifying the player move with certain backgrounds in the image.

I converted the original Keras model into TensorflowJS so that it could be deployed on a static website (no server side processing required), in the form of a rock, paper, scissors game. The game can be [demoed here.](https://rock-paper-scissors-a8151.web.app)

