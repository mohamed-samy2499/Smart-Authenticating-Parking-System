from ast import And
import plotly.graph_objects as go
import numpy as np
import pandas as pd
from scipy.signal import find_peaks
import os
import cv2
import numpy as np

# function to segment the image
# takes 3 parameters: the image, list of start indecies, list of end indices
def segment(img, start, peak, end, segments):
    for v in range(len(start)):
        print(start[v], end[v])

# if the start index is less than 5, crop from the start index, otherwise move -5 pixels
# I had to do this because one image started from 3
        if start[v] < 7:
            s = 0
        else:
            s = 7

        initial_width = int(start[v]-s)
        final_width = int(end[v]+7)
        # print(initial_width, final_width)
        char = img[int(0):, initial_width:final_width]

        height, width = img.shape
        # print("WIDTH: ", width)
        # print(final_width-initial_width)
        # if (final_width-initial_width <= 32):
        #     print("less than")
        if (peak[v] <= width/1.9):
            # print("in center 1")
            if (peak[v] >= width/2.19):
                # print("line deleted!")
                continue
    

        # cv2.imshow("char", char)
        # cv2.waitKey(0)
        
        segments.append(char)
        # segments = np.append(segments, img[int(0):, int(start[v]-s):int(end[v]+7)], axis=0)


def find_peaks_fn(img, csv_values, segments):

    hist = csv_values

# smooth the data
    kernel_size = 5
    kernel = np.ones(kernel_size) / kernel_size
    hist = np.convolve(hist, kernel, mode='same')

    indices = find_peaks(hist, prominence=6)[0]
    # print(indices)

    # print(indices)
    small_peaks = np.where(indices < 5)
    indices = np.delete(indices, small_peaks)
    # print(indices)


# start and end lists to save the start and end indices
    startix = []
    endix = []

    # print(img.shape)
    height, width,= img.shape
    lowest_value = 2.5

    for index in indices:
# get the start index
        temp_index = index-2
        while(temp_index) > 0:
            if temp_index <= 2:
                startix.append(1)
                break

            elif hist[temp_index] < lowest_value:
                startix.append(temp_index)
                break
            else:
                temp_index = temp_index-2
#get the end index
        temp_index = index+2
        while(temp_index) < width:
            if temp_index >= width-2:
                endix.append(width-1)
                break

            elif hist[temp_index] < lowest_value:
                endix.append(temp_index)
                break
            else:
                temp_index = temp_index+2

    # print("Start indices: ", startix)
    # print("Peak indices: ", list(indices))
    # print("End indices: ", endix)

    # print("start, peak, end", len(startix), len(indices), len(endix))

    # check if start, peak and end indices have the same length
    if(len(startix) != len(indices) or len(indices) != len(endix) or len(startix) != len(endix)):
        print("not matching dim")
    else:
        # print('match!')        
# segment the image only if the indices match
        segment(img, startix, indices, endix, segments)

    # print("\n")