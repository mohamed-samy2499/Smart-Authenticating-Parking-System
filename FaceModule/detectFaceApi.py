from io import StringIO
import shutil
from flask import Flask, request,jsonify
import json
from FaceDetectFn import DetectFace
from train_main import trainModel
import cv2
import os
app = Flask(__name__)

@app.route('/face_saving', methods=['POST'])
def face_saving():
    if request.method == 'POST':
        # check if the post request has the file part
        print(request.files)
        if 'Id' in request.args:
            if ('file' in request.files): 
                file1 = request.files.get('file')
                # print(request.form)
                # stream = file1.stream.read()
                img_path = os.path.join(os.path.dirname(__file__),f'tmp/{file1.filename}.mp4')
                file1.save(img_path)
                Id = request.args.get('Id')   
                # # file2 = request.files.get('file2')                         
                ret = DetectFace(img_path,Id)
                ret2 = trainModel()
                      
                resp_data = {"preprocessing_response": str(ret),"model_response":str(ret2)} # convert numpy._bool to bool for json.dumps
                return jsonify(resp_data)
        return jsonify({'error':'invalid data'})  
    
# When debug = True, code is reloaded on the fly while saved
app.run(host='localhost', port='8001', debug=True)