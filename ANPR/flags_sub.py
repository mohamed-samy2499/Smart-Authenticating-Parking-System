class Flags():
    def __init__(self, framwork, weights, size, tiny, model,
                video, output, output_format, iou, score, dont_show):
        self.framework = framwork
        self.weights = weights
        self.size = size
        self.tiny = tiny
        self.model = model
        self.video = video
        self.output = output
        self.output_format = output_format
        self.iou = iou
        self.score = score
        self.dont_show = dont_show

# FLAGS = Flags('tf', './checkpoints/latest-416', 416,
#                 False, 'yolov4', './data/LP.mp4',
#                 None, 'XVID', 0.45, 0.25, False)

# print(FLAGS.iou)