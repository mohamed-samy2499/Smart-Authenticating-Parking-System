import cv2
import time
import os
vid_capture = cv2.VideoCapture('rtsp://root:admin@10.0.10.41/axis-media/media.amp')
# vid_capture = cv2.VideoCapture(0)

vid_cod = cv2.VideoWriter_fourcc(*'XVID')
user_name = input("please enter your name: ")
os.makedirs("video\\train\\{}".format(user_name))
output = cv2.VideoWriter("video\\train\\{}\\{}.avi".format(user_name,user_name), vid_cod, 20.0, (640,480))
start_time = time.time()
while(True):
     # Capture each frame of webcam video
     ret,frame = vid_capture.read()
    
     cv2.imshow("My cam video", frame)
    #  output.write(frame)
     # Close and break the loop after pressing "x" key
     if cv2.waitKey(1) &0XFF == ord('q'):
         break
# close the already opened camera
vid_capture.release()
# close the already opened file
output.release()
# close the window and de-allocate any associated memory usage
cv2.destroyAllWindows()