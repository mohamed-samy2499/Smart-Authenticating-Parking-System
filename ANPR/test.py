from os import listdir
from os.path import isfile, join
import numpy as np
import cv2

img_path = "/home/abdullah/Desktop/GradProject/datasets/test"

img_list = [img_path + f for f in listdir(img_path) if isfile(join(img_path, f))]

print(img_list)

