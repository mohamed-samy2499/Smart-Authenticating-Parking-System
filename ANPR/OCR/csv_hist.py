from typing import ClassVar
import numpy as np
import cv2
import os

def write_csv_values(csvpath, fname, vlist):
    os.chdir(csvpath)
    with open(f"{fname[:len(fname)-4]}.csv", 'w') as txtfile:
        txtfile.write("value\n")
        for v in vlist:
            txtfile.write(str(v))
            txtfile.write('\n')

def csv_hist_fn(img):

    # perform gaussian blur to smoothen image
    blur = cv2.GaussianBlur(img, (5,5), 0)
    # cv2.imshow("Blur", blur)
    # cv2.waitKey(0)

    if np.mean(blur) > 197:
        its = 'bright'
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 201, 11)
    else:
        its = 'dark'
        thresh = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 87, 13)

    # create rectangular kernel for dilation
    rect_kern = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    # # apply dilation to make regions more clear
    # erosion = cv2.erode(thresh, rect_kern, iterations=1)
    # cv2.imshow("Erosion", erosion)
    dilation = cv2.dilate(thresh, rect_kern, iterations=1)

    binarizedImage = dilation

    binarizedImage[binarizedImage == 0] = 1
    binarizedImage[binarizedImage == 255] = 0

    vertical_projection = np.sum(binarizedImage, axis=0)

    height, width = binarizedImage.shape

    blankImage = np.zeros((height, width, 3), np.uint8)

    values = []

    for column in range(width):
        # print(column)
        # cv2.line(blankImage, (column, 0), (column, int(vertical_projection[column]*height/width)), (255,255,255), 1)
        values.append(int(vertical_projection[column]*height/width))

    hist = cv2.flip(blankImage, 0)
    # sum_columns = np.sum(hist, axis=0)
    return values
