import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
    tf.config.experimental.set_memory_growth(physical_devices[0], True)
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession

import cv2
import numpy as np
import os
import core.utils as utils
from predict import predict_LP

from flags_sub import Flags

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import json
import base64

app = Flask(__name__)
CORS(app)
resources = {r"/api/*": {"origins": "*"}}
app.config["CORS_HEADERS"] = "Content-Type"
app.config['JSON_SORT_KEYS'] = False

FLAGS = Flags('tf', './checkpoints/tiny-custom-416', 416,
            True, 'yolov4', './data/LP7_trimmed.mp4',
            None, 'XVID', 0.45, 0.25, False)
# FLAGS = Flags('tf', './checkpoints/latest-416', 416,
#             False, 'yolov4', './data/LP.mp4',
#             None, 'XVID', 0.45, 0.25, False)
config = ConfigProto()
config.gpu_options.allow_growth = True
session = InteractiveSession(config=config)
STRIDES, ANCHORS, NUM_CLASS, XYSCALE = utils.load_config(FLAGS)
input_size = FLAGS.size
video_path = FLAGS.video

# saved_model_loaded = tf.saved_model.load(FLAGS.weights, tags=[tag_constants.SERVING])
# infer = saved_model_loaded.signatures['serving_default']
saved_model_loaded = tf.keras.models.load_model(FLAGS.weights, compile=False)

@tf.function
def make_pred(batch_data):
    return saved_model_loaded(batch_data, training= False)

@app.route('/camFeed', methods=['POST'])
def cam_feed():
    # print(request)
    global video_path
    video_path = request.form.get('address')
    return jsonify({"Message": video_path})

@app.route('/start', methods=['GET'])
def start():
    try:
        print(video_path)
        vid = cv2.VideoCapture(int(video_path))
    except:
        vid = cv2.VideoCapture(video_path)

    counter = 0
    while True:
        return_value, frame = vid.read()
        if return_value:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        else:
            print('Video has ended or failed, try a different video format!')
            break
        
        image_data = utils.crop_square(frame, input_size)
        frame = image_data
        image_data = cv2.resize(image_data, (input_size, input_size))
        image_data = image_data / 255.
        image_data = image_data[np.newaxis, ...].astype(np.float32)

        batch_data = tf.constant(image_data)
        # pred_bbox = infer(batch_data)
        pred_bbox = make_pred(batch_data)
        # for key, value in pred_bbox.items():
        #     boxes = value[:, :, 0:4]
        #     pred_conf = value[:, :, 4:]
        boxes = pred_bbox[:, :, 0:4]
        pred_conf = pred_bbox[:, :, 4:]


        boxes, scores, classes, valid_detections = tf.image.combined_non_max_suppression(
            boxes=tf.reshape(boxes, (tf.shape(boxes)[0], -1, 1, 4)),
            scores=tf.reshape(
                pred_conf, (tf.shape(pred_conf)[0], -1, tf.shape(pred_conf)[-1])),
            max_output_size_per_class=50,
            max_total_size=50,
            iou_threshold=FLAGS.iou,
            score_threshold=FLAGS.score
        )
        if scores.numpy()[0, 0] > 0.9 and scores.numpy()[0, 1] == 0:
            print("Start of session with counter : {}".format(counter))
            counter = counter + 1
            if counter == 2:
                # cv2.imshow('frame', frame)
                # cv2.waitKey(0)
                pred_bbox = [boxes.numpy(), scores.numpy(), classes.numpy(), valid_detections.numpy()]
                # frame = utils.draw_bbox(frame, pred_bbox)
                cropped_plate = utils.save_number_plate(frame, pred_bbox,os.getcwd(),"my_plate.jpeg")
                # cv2.imshow('cropped_plate', cropped_plate)
                # cv2.waitKey(0)
                LP_reading = predict_LP(cropped_plate)
                with open(os.path.join(os.getcwd(),"my_plate.jpeg"), mode='rb') as file:
                    img = base64.b64encode(file.read()).decode('utf-8')
                    response = app.response_class(
                        response=json.dumps({'Id': LP_reading , "plate" : img}),
                        status=200,
                        mimetype='application/json'
                    )
                return response
    vid.release()
    return "End of current session"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=7007)

