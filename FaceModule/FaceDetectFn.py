from preprocess import preprocesses
import cv2
import os


def DetectFace(frame,Id):
    label = Id
    MYDIR = (f'train_img/{label}')
    CHECK_FOLDER = os.path.isdir(MYDIR)

    # If folder doesn't exist, then create it.
    if not CHECK_FOLDER:
        os.makedirs(MYDIR)
    print("created folder : ", MYDIR)
    raw_img = frame
    img = cv2.resize(raw_img, (640, 480))
    cv2.imwrite(f'train_img/{label}/{label}_0.jpg', img)
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
