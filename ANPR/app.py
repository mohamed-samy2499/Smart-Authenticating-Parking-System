import time
import os
import tensorflow as tf
physical_devices = tf.config.experimental.list_physical_devices('GPU')
if len(physical_devices) > 0:
    tf.config.experimental.set_memory_growth(physical_devices[0], True)
import core.utils as utils
from core.yolov4 import filter_boxes
from tensorflow.python.saved_model import tag_constants
from PIL import Image
import cv2
import matplotlib.pyplot as plt
import numpy as np
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
from flags_sub import Flags
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import json

from OCR.OCR import OCR

app = Flask(__name__)
CORS(app)
resources = {r"/api/*": {"origins": "*"}}
app.config["CORS_HEADERS"] = "Content-Type"
app.config['JSON_SORT_KEYS'] = False

FLAGS = Flags('tf', './checkpoints/tiny-custom-416', 416,
            True, 'yolov4', './data/LP1.mkv',
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

if FLAGS.framework == 'tflite':
    interpreter = tf.lite.Interpreter(model_path=FLAGS.weights)
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    print(input_details)
    print(output_details)
else:
    # with tf.device('/cpu:0'):
    # saved_model_loaded = tf.saved_model.load(FLAGS.weights, tags=[tag_constants.SERVING])
    # infer = saved_model_loaded.signatures['serving_default']
    saved_model_loaded = tf.keras.models.load_model(FLAGS.weights, compile=False)
    # print('#################')
    # print('loaded')
    # print('#################')

@tf.function
def make_pred(batch_data):
    return saved_model_loaded(batch_data, training= False)

@app.route('/camFeed', methods=['POST'])
def cam_feed():
    video_path = request.form.get('address')
    return jsonify({"Message": video_path})

@app.route('/start', methods=['GET'])
def start():
    # print("Start of session")
    try:
        vid = cv2.VideoCapture(int(video_path))
    except:
        vid = cv2.VideoCapture(video_path)

    out = None

    if FLAGS.output:
        # by default VideoCapture returns float instead of int
        width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(vid.get(cv2.CAP_PROP_FPS))
        codec = cv2.VideoWriter_fourcc(*FLAGS.output_format)
        out = cv2.VideoWriter(FLAGS.output, codec, fps, (width, height))
    prev_num_plate = ""
    current_num_plate = ""
    count = 0
    while True:
        return_value, frame = vid.read()
        if return_value:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            # image = Image.fromarray(frame)
        else:
            print('Video has ended or failed, try a different video format!')
            break

        # frame = cv2.flip(frame, -1)
        frame_size = frame.shape[:2]
        image_data = cv2.resize(frame, (input_size, input_size))
        image_data = image_data / 255.
        image_data = image_data[np.newaxis, ...].astype(np.float32)
        start_time = time.time()

        if FLAGS.framework == 'tflite':
            interpreter.set_tensor(input_details[0]['index'], image_data)
            interpreter.invoke()
            pred = [interpreter.get_tensor(output_details[i]['index']) for i in range(len(output_details))]
            if FLAGS.model == 'yolov3' and FLAGS.tiny == True:
                boxes, pred_conf = filter_boxes(pred[1], pred[0], score_threshold=0.25,
                                                input_shape=tf.constant([input_size, input_size]))
            else:
                boxes, pred_conf = filter_boxes(pred[0], pred[1], score_threshold=0.25,
                                                input_shape=tf.constant([input_size, input_size]))
        else:
            batch_data = tf.constant(image_data)
            # print('#################')
            # print('start of suspected area')
            # print('#################')
            # with tf.device('/gpu:0'):
            # pred_bbox = infer(batch_data)
            pred_bbox = make_pred(batch_data)
            # print('#################')
            # print('end of suspected area')
            # print('#################')
            # print(pred_bbox.shape)
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
        # print(scores.numpy())
        if scores.numpy()[0, 0] > 0.9 and scores.numpy()[0, 1] == 0:
            pred_bbox = [boxes.numpy(), scores.numpy(), classes.numpy(), valid_detections.numpy()]
            # frame = utils.draw_bbox(frame, pred_bbox)
            cropped_plate = utils.save_number_plate(frame, pred_bbox, './data/cropped_plate_6.png')
            predictions = OCR(cropped_plate)
            response = app.response_class(
                response=json.dumps({'Id': '3928SA'}),
                status=200,
                mimetype='application/json'
            )
            return response
            # prompt for a number of times till getting face detected
            # print(pred_bbox.shape)
            # current_num_plate = "123 ABC"
            # count += 1
            # if count == 5 and current_num_plate != prev_num_plate:
            #     print(predictions)
            #     prev_num_plate = current_num_plate
            #     count = 0
        # fps = 1.0 / (time.time() - start_time)
        # print("FPS: %.2f" % fps)
        # result = np.asarray(frame)
        # cv2.namedWindow("result", cv2.WINDOW_AUTOSIZE)
        # result = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
        
        # if not FLAGS.dont_show:
        #     cv2.imshow("result", result)
        #     print("showing window")
        
    #     if FLAGS.output:
    #         out.write(result)
    #     if cv2.waitKey(1) & 0xFF == ord('q'): break
    # cv2.destroyAllWindows()
    vid.release()
    return "End of current session"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=7007)

