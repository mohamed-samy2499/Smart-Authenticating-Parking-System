from preprocess import preprocesses
import cv2
import os


def DetectFace(video_path,Id):
    label = Id
    MYDIR = (f'train_img/{label}')
    CHECK_FOLDER = os.path.isdir(MYDIR)

    # If folder doesn't exist, then create it.
    if not CHECK_FOLDER:
        os.makedirs(MYDIR)
        print("created folder : ", MYDIR)
    #read video
    Video = cv2.VideoCapture(video_path)
    success,image = Video. read()
    list = os.listdir(MYDIR)
    number_files = len(list)
    count = (number_files * 5) + 5.
    #true to end of frame and make aligned imagez
    while success:

        img = cv2.resize(image, (640, 480))
        cv2.imwrite(f'train_img/{label}/{label}_{count}.jpg', img)
        count += 1
        success,image = Video.read()
    Video.release() 
    cv2.destroyAllWindows()
    input_datadir = './train_img'
    output_datadir = './aligned_img'

    obj=preprocesses(input_datadir,output_datadir)
    nrof_images_total,nrof_successfully_aligned=obj.collect_data()

    print('Total number of images: %d' % nrof_images_total)
    print('Number of successfully aligned images: %d' % nrof_successfully_aligned)
    if nrof_successfully_aligned >0:
        return 1
    else:
        return 0
