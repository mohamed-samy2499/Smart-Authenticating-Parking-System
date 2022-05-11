from .resize_crop import resize_crop_fn
from .csv_hist import csv_hist_fn
from .segment import segment, find_peaks_fn
from .svm import predict
import os
import cv2
import csv
import array
import numpy as np

def segmentation_fn(img):
    img_cropped = resize_crop_fn(img)
    csv_values = csv_hist_fn(img_cropped)
    segments = []
    find_peaks_fn(img_cropped, csv_values, segments)

    return segments

def OCR(img):
    # img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # cv2.imshow('image', img)
    # cv2.waitKey(0)
    char_list = segmentation_fn(img)
    # print(char_list[0].shape)
    # for index, char in enumerate(char_list):
    #     print(char.shape)
    #     cv2.imshow('char{}'.format(index), char)
    #     cv2.waitKey(0)
    char_list_flattened = []
    for index, char in enumerate(char_list):
        # print(char.shape)
        char = cv2.resize(char, (50, 150), interpolation=cv2.INTER_CUBIC)
        # cv2.imshow('char{}'.format(index), char)
        # cv2.waitKey(0)
        char = np.array(char).flatten()
        char = char.reshape(1, -1)
        # print(char.shape)
        # print(char)
        char_list_flattened.append(char)
        # char_list_flattened.append(char.tolist())

    # print(np.array(char_list_flattened).shape)
    model_dir = os.path.join(os.getcwd(), 'OCR/model/model4_gray.sav')
    predictions = predict(model_dir, char_list_flattened)
    return predictions 
    # for index, char in enumerate(char_list_flattened):
    #     print('prediction is: ', predictions[index])
    #     cv2.imshow('char{}'.format(index), char.reshape(150, 50))
    #     cv2.waitKey(0)