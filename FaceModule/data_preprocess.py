from preprocess import preprocesses
import os
import cv2

video = 'rtsp://root:admin@10.0.10.41/axis-media/media.amp'
cap = cv2.VideoCapture(0)
user_name = input("please enter your name: ")
label = user_name
frame_count = 0
MYDIR = (f'train_img/{label}')
CHECK_FOLDER = os.path.isdir(MYDIR)

# If folder doesn't exist, then create it.
if not CHECK_FOLDER:
    os.makedirs(MYDIR)
    print("created folder : ", MYDIR)
while True:
    # read video frame
    ret, raw_img = cap.read()
    cv2.imshow("My cam video",raw_img)
    # process every 5 frames
    if frame_count % 5 == 0 and raw_img is not None:
        img = cv2.resize(raw_img, (640, 480))
        cv2.imwrite(f'train_img/{label}/{label}_{frame_count}.jpg', img)
    frame_count = frame_count + 1
    if cv2.waitKey(1) &0XFF == ord('q'):
         break
cap.release()
cv2.destroyAllWindows()
input_datadir = './train_img'
output_datadir = './aligned_img'

obj=preprocesses(input_datadir,output_datadir)
nrof_images_total,nrof_successfully_aligned=obj.collect_data()

print('Total number of images: %d' % nrof_images_total)
print('Number of successfully aligned images: %d' % nrof_successfully_aligned)



