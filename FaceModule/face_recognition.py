from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from asyncio.windows_events import NULL
import cv2
import numpy as np
import facenet
import detect_face
import os
import time
import pickle
import pathlib
from PIL import Image
import tensorflow.compat.v1 as tf

model_flag = 1
CameraUser = ""
CameraPass = ""
CameraIP = ""
CameraType = ""
# video= 'rtsp://root:admin@10.0.10.41/axis-media/media.amp'
video= 0

modeldir = './model/20180402-114759.pb'
classifier_filename = './class/classifier.pkl'
npy='./npy'
train_img="./train_img"
with tf.Graph().as_default():
    gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.6)
    sess = tf.Session(config=tf.ConfigProto(gpu_options=gpu_options, log_device_placement=False))
    with sess.as_default():
        pnet, rnet, onet = detect_face.create_mtcnn(sess, npy)
        minsize = 30  # minimum size of face
        threshold = [0.7,0.8,0.8]  # three steps's threshold
        factor = 0.709  # scale factor
        margin = 44
        batch_size =100 #1000
        image_size = 182
        input_image_size = 160
        HumanNames = os.listdir(train_img)
        HumanNames.sort()
        print('Loading Model')
        facenet.load_model(modeldir)
        images_placeholder = tf.get_default_graph().get_tensor_by_name("input:0")
        # print(type(images_placeholder))
        embeddings = tf.get_default_graph().get_tensor_by_name("embeddings:0")
        # print(type(embeddings))
        phase_train_placeholder = tf.get_default_graph().get_tensor_by_name("phase_train:0")
        # print(type(phase_train_placeholder))
        embedding_size = embeddings.get_shape()[1]

        classifier_filename_exp = os.path.expanduser(classifier_filename)
        with open(classifier_filename_exp, 'rb') as infile:
            (model, class_names) = pickle.load(infile,encoding='latin1')
            # print(type(model))
        # f = open("Model_classifier.txt","w")
        # f.write("{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}&^{}".format(str(pnet),str(rnet),str(onet),str(minsize),str(threshold),str(factor),str(image_size),str(input_image_size),str(HumanNames),str(images_placeholder),str(embeddings),str(phase_train_placeholder),str(embedding_size),str(classifier_filename_exp),str(model),str(class_names)))
        # f.close()
        # with open("Model_classifier.txt") as f:
        #     list_param = f.readline().split('&^')
        #     pnet = list_param[0]
        #     rnet = list_param[1]
        #     onet = list_param[2]
        #     minsize = int(list_param[3])
        #     threshold1 = list_param[4][1:-1].split(',')
        #     threshold = [float(iii) for iii in threshold1]
        #     factor = float(list_param[5])
        #     image_size = int(list_param[6])
        #     input_image_size = int(list_param[7])
        #     HumanNames = [jj for jj in list_param[8] ]
        #     images_placeholder = list_param[9]
        #     embeddings = list_param[10]
        #     phase_train_placeholder = list_param[11]
        #     embedding_size = int(list_param[12])
        #     classifier_filename_exp = list_param[13]
        #     model = list_param[14]
        #     class_names = [kk for kk in list_param[15]]
        video_capture = cv2.VideoCapture(video)
        print('Start Recognition')
        frame_count=0
        break_flag = 0
        plate_txt_path = "D:\\g\\Smart-Authenticating-Parking-System\\plateDetected.txt"
        person_txt_path =  "D:\\g\\Smart-Authenticating-Parking-System\\person_detected.txt"
        with open(plate_txt_path,"r") as b:
            print(b.read())
        person_name = ""
        conuter =0
        tmp = "-100"
        while True:
            # fooo = open("break.txt")
            # flag_str = fooo.readline()
            # if flag_str != NULL:
            #     break_flag = int(flag_str)
            # if break_flag == 1:
            #     break
            ret, frame = video_capture.read()
            # frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5)    #resize frame (optional)
            # cv2.imshow('Face Recognition', frame)
            # frame  = cv2.imread("side1.jpg")
            timer =time.time()
            if frame_count % 5 == 0 and frame is not None:
                if frame.ndim == 2:
                    frame = facenet.to_rgb(frame)
                bounding_boxes, _ = detect_face.detect_face(frame, minsize, pnet, rnet, onet, threshold, factor)
                faceNum = bounding_boxes.shape[0]
                # while model_flag:
                #     foo =  open("invoke.txt")
                #     model_flag_str = foo.readline()
                #     if model_flag_str != NULL:
                #         model_flag = int(model_flag_str)
                #     print(model_flag_str)
                #     foo.close()
                if faceNum > 0:
                    det = bounding_boxes[:, 0:4]
                    img_size = np.asarray(frame.shape)[0:2]
                    cropped = []
                    scaled = []
                    scaled_reshape = []
                    for i in range(faceNum):
                        emb_array = np.zeros((1, embedding_size))
                        xmin = int(det[i][0])
                        ymin = int(det[i][1])
                        xmax = int(det[i][2])
                        ymax = int(det[i][3])
                        try:
                            # inner exception
                            # if xmin <= 0 or ymin <= 0 or xmax >= len(frame[0]) or ymax >= len(frame):
                            #     print('Face is very close!')
                            #     continue
                            cropped.append(frame[ymin:ymax, xmin:xmax,:])
                            cropped[i] = facenet.flip(cropped[i], False)
                            scaled.append(np.array(Image.fromarray(cropped[i]).resize((image_size, image_size))))
                            scaled[i] = cv2.resize(scaled[i], (input_image_size,input_image_size),
                                                    interpolation=cv2.INTER_CUBIC)
                            scaled[i] = facenet.prewhiten(scaled[i])
                            scaled_reshape.append(scaled[i].reshape(-1,input_image_size,input_image_size,3))
                            feed_dict = {images_placeholder: scaled_reshape[i], phase_train_placeholder: False}
                            emb_array[0, :] = sess.run(embeddings, feed_dict=feed_dict)
                            predictions = model.predict_proba(emb_array)
                            best_class_indices = np.argmax(predictions, axis=1)
                            best_class_probabilities = predictions[np.arange(len(best_class_indices)), best_class_indices]
                            if best_class_probabilities>0.92:
                                cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)    #boxing face
                                for H_i in HumanNames:
                                    if HumanNames[best_class_indices[0]] == H_i:
                                        result_names = HumanNames[best_class_indices[0]]
                                        # only send if got request
                                        
                                        with open(plate_txt_path , "r") as f:
                                            content = f.read()

                                            if content == "-1":
                                                print(-1)
                                            elif content != "-1" and content != tmp:
                                                tmp = content
                                                conuter += 1
                                                person_name = HumanNames[best_class_indices[0]]
                                                with open(person_txt_path, "w") as k:
                                                    k.write(person_name)
                                        print("Predictions : [ name: {} , accuracy: {:.3f} ]".format(HumanNames[best_class_indices[0]],best_class_probabilities[0]))
                                        cv2.rectangle(frame, (xmin, ymin-20), (xmax, ymin-2), (0, 255,255), -1)
                                        cv2.putText(frame, '{}'.format(result_names), (xmin,ymin-5), cv2.FONT_HERSHEY_COMPLEX_SMALL,
                                                    1, (0, 0, 0), thickness=1, lineType=1)
                                        cv2.rectangle(frame, (xmin, ymax+20), (xmax, ymax+2), (0, 255,255), -1)
                                        cv2.putText(frame, '{:.3f}%'.format(best_class_probabilities[0]*100), (xmin,ymax+15), cv2.FONT_HERSHEY_COMPLEX_SMALL,
                                                    1, (0, 0, 0), thickness=1, lineType=1)
                                        
                            else :
                                with open(plate_txt_path , "r") as f:
                                            content = f.read()
                                            
                                            if content == "-1":
                                                print(content)
                                            elif content != "-1" and tmp != content:
                                                conuter += 1
                                                person_name = "unknown"
                                                tmp = content
                                                with open(person_txt_path, "w") as k:
                                                    k.write(person_name)
                                cv2.rectangle(frame, (xmin, ymin), (xmax, ymax), (0, 255, 0), 2)
                                cv2.rectangle(frame, (xmin, ymin-20), (xmax, ymin-2), (0, 255,255), -1)
                                cv2.putText(frame, "?", (xmin,ymin-5), cv2.FONT_HERSHEY_COMPLEX_SMALL,
                                                    1, (0, 0, 0), thickness=1, lineType=1)
                        except:   
                            
                            print("error")
                        
                endtimer = time.time()
                fps = 1/(endtimer-timer)
                cv2.rectangle(frame,(15,30),(135,60),(0,255,255),-1)
                cv2.putText(frame, "fps: {:.2f}".format(fps), (20, 50),cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                cv2.imshow('Face Recognition', frame)
            frame_count = frame_count + 1
            key= cv2.waitKey(1)
            if key== 113: # "q"
                break
        video_capture.release()
        cv2.destroyAllWindows()
