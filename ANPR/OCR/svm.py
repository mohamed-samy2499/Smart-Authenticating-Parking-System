import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
import pickle
import random
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC


def predict(pickle_model, char_list):
    categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
                    'A', 'B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N',
                    'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
    pick_in = open(pickle_model, 'rb')
    model = pickle.load(pick_in)
    pick_in.close()
    # it should be able to predict a list
    # predictions = model.predict(char_list)
    predictions = []
    for char in char_list:
        predicted_char = model.predict(char)
        predictions.append(predicted_char)
    plate_symbols = []
    for char in predictions:
        plate_symbols.append(categories[char[0]])
    return plate_symbols

# def obtain_data(folder_name, pickle_data_name):
#     categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
#                     'A', 'B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N',
#                     'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
#     data = []
#     home_dir = os.path.join(os.getcwd(), folder_name)
#     dims = (50, 150)

#     for category in categories:
#         folder_path = os.path.join(home_dir, category)
#         label = categories.index(category)

#         for img in os.listdir(folder_path):
#             img_path = os.path.join(folder_path, img)
#             symbol_image = cv2.imread(img_path)
#             symbol_image = cv2.resize(symbol_image, dims, interpolation=cv2.INTER_CUBIC)
#             # print(symbol_image.shape) ##
#             # break ##
#             flattened_symbol_image = np.array(symbol_image).flatten()
#             data.append([flattened_symbol_image, label])
#         # break ##
#     pick_in = open(pickle_data_name, 'wb')
#     pickle.dump(data, pick_in)
#     pick_in.close()
#     return np.array(data)

# def train_model(pickle_data_name, model_name):
#     categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
#                 'A', 'B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N',
#                 'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
#     pick_in = open(pickle_data_name, 'rb')
#     data = pickle.load(pick_in)
#     pick_in.close()
#     # data = np.array(np.load(pickle_data, allow_pickle=True))
#     random.shuffle(data)
#     features = []
#     labels = []
#     for feature, label in data:
#         features.append(feature)
#         labels.append(label)

#     xtrain, xtest, ytrain, ytest = train_test_split(features, labels, test_size=0.1)
#     model = SVC(C=1, kernel='poly', gamma='auto')
#     model.fit(xtrain, ytrain)
#     accuracy = model.score(xtest, ytest)
#     print('Accuracy is: ', accuracy)
#     predictions = model.predict(xtest)
#     for index, img in enumerate(xtest):
#         print('prediction is: ', categories[predictions[index]])
#         img = img.reshape(150, 50, 3)
#         plt.imshow(img, cmap='gray')
#         plt.show()
#     pickle_model = open(model_name, 'wb')
#     pickle.dump(model, pickle_model)
#     pickle_model.close()

# def predict(pickle_data, pickle_model):
#     categories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 
#                     'A', 'B', 'D', 'F', 'G', 'H', 'K', 'L', 'M', 'N',
#                     'R', 'S', 'T', 'W', 'X', 'Y', 'Z']
#     pick_in = open(pickle_data, 'rb')
#     data = pickle.load(pick_in)
#     pick_in.close()
#     pick_in = open(pickle_model, 'rb')
#     model = pickle.load(pick_in)
#     pick_in.close()
#     random.shuffle(data)
#     features = []
#     labels = []
#     for feature, label in data:
#         features.append(feature)
#         labels.append(label)
    
#     xtrain, xtest, ytrain, ytest = train_test_split(features, labels, test_size=0.1)
#     predictions = model.predict(xtest)
#     accuracy = model.score(xtest, ytest)
#     # index = 0
#     print('Accuracy = ', accuracy)
#     for index, img in enumerate(xtest):
#         print('prediction is: ', categories[predictions[index]])
#         img = img.reshape(150, 50, 3)
#         plt.imshow(img, cmap='gray')
#         plt.show()



# def main():
#     # data = obtain_data('characters', 'data2.pickle')
#     # print(data[50])
#     train_model('data2.pickle', 'model2.sav')
#     # predict('data2.pickle', 'model2.sav')
#     return 0

# if __name__ == '__main__':
#     main()