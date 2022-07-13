import cv2
from segmentation.driver_code import segment_fn 
from classifier.cnn_classifier import CNN_model, predict

def predict_LP(img):
    symbols = segment_fn(img, debug=1, show_characters=0, draw_fig=0, multi=0)
    model_path = './classifier/model_V7.hdf5'    
    cnn_model = CNN_model()
    cnn_model.load_weights(model_path)
    LP = ''
    for symbol in symbols:
        # cv2.imshow('symbol', symbol)
        # cv2.waitKey(0)
        LP += (predict(cnn_model, symbol))
        # print(LP)
    # cv2.destroyAllWindows()
    return LP
    