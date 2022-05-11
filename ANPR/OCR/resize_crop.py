# code to resize and cut the charaters region only
import cv2
import numpy as np
import os


def image_resize(image, width = None, height = None, inter = cv2.INTER_AREA):
        # initialize the dimensions of the image to be resized and
        # grab the image size
        dim = None
        (h, w) = image.shape[:2]

        # if both the width and height are None, then return the
        # original image
        if width is None and height is None:
            return image

        # check to see if the width is None
        if width is None:
            # calculate the ratio of the height and construct the
            # dimensions
            r = height / float(h)
            dim = (int(w * r), height)

        # otherwise, the height is None
        else:
            # calculate the ratio of the width and construct the
            # dimensions
            r = width / float(w)
            dim = (width, int(h * r))

        # resize the image
        resized = cv2.resize(image, dim, interpolation = inter)

        # return the resized image
        return resized

def resize_crop_fn(img):

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # bigger = cv2.resize(gray, None, fx = 3, fy = 3, interpolation = cv2.INTER_CUBIC)
    
    img = image_resize(gray, width = 480)
    # cv2.imshow('resized', img)
    # cv2.waitKey(0)

    h, w = img.shape
    # print(img.shape)
    # crop image initail height:final height, initail width:final width
    cropped = img[int(h/2.5):int(h/1.12), int(5):int(w-10)]

    return cropped