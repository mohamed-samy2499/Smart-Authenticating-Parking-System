import numpy as np
import os
import cv2

from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout, BatchNormalization
from keras.regularizers import l1_l2

from numpy import array
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
          'A', 'B', 'D', 'F', 'G', 'H', 'K', 'L', 'M',
          'N', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
# Define image dimensions
IMG_ROWS = 75
IMG_COLS = 25
# 3 stands for RGB images, 1 if greyscaled images
INPUT_SHAPE = (IMG_ROWS, IMG_COLS, 3)

# Number of classes to consider
NUM_CLASSES = len(LABELS)

def CNN_model(activation = 'softmax', 
              loss = 'categorical_crossentropy', 
              optimizer = 'adam', 
              # metrics = ['accuracy', top_3_categorical_accuracy]):
              metrics = ['accuracy']):
    
    model = Sequential()

    model.add(Conv2D(32, kernel_size = (3, 3), activation = 'tanh', input_shape = INPUT_SHAPE))
    model.add(BatchNormalization())
    model.add(Dropout(0.25))
    # model.add(MaxPooling2D(pool_size = (2, 2)))

    model.add(Conv2D(64, (3, 3), activation = 'tanh'))
    model.add(BatchNormalization())
    model.add(Dropout(0.25))
    model.add(MaxPooling2D(pool_size = (2, 2)))
    
    model.add(Conv2D(128, (4, 4), activation = 'tanh', activity_regularizer=l1_l2(l1=0.01, l2=0.01)))
    model.add(BatchNormalization())
    model.add(Dropout(0.25))
    model.add(MaxPooling2D(pool_size = (2, 2)))
    
    model.add(Flatten())
    model.add(Dense(128, activation = 'tanh', activity_regularizer=l1_l2(l1=0.01, l2=0.01)))
    model.add(Dropout(0.30))
    model.add(Dense(NUM_CLASSES, activation = activation))
    
    # Compile the model
    model.compile(loss = loss,
                  optimizer = optimizer, 
                  metrics = metrics)
    
    return model

def prepare_image(img):
    img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    img = cv2.resize(img, (IMG_COLS, IMG_ROWS))
    img = img_to_array(img)
    img = img/255
    img = img.reshape(1, IMG_ROWS, IMG_COLS, 3)
    img = img.astype('float32')
    return img

def predict(model, img):
    img = prepare_image(img)
    predictions = model.predict(img)
    return LABELS[np.argmax(predictions[0])]    
    