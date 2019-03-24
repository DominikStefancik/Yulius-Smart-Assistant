import pyaudio
import wave
import librosa
from keras.models import model_from_json
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from keras import backend as K

tf.logging.set_verbosity(tf.logging.ERROR)

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

###############################################################################

CHUNK = 1024 
FORMAT = pyaudio.paInt16 #paInt8
CHANNELS = 2 
RATE = 44100 #sample rate
RECORD_SECONDS = 4
WAVE_OUTPUT_FILENAME = "recording.wav"

LABEL_ENCODER = { 0: 'female_angry',
                  1: 'female_calm',
                  2: 'female_fearful',
                  3: 'female_happy',
                  4: 'female_sad',
                  5: 'male_angry',
                  6: 'male_calm',
                  7: 'male_fearful',
                  8: 'male_happy',
                  9: 'male_sad'
                }

###############################################################################

def record_wave():
    p = pyaudio.PyAudio()

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK) #buffer

    print("* recording")

    frames = []

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data) # 2 bytes(16 bits) per channel

    print("* done recording")

    stream.stop_stream()
    stream.close()
    p.terminate()

    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

###############################################################################

def load_model():
    json_file = open('model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights("Emotion_Voice_Detection_Model.h5")

    return loaded_model

###############################################################################

def get_sentiment(filename):
    loaded_model = load_model()

    X, sample_rate = librosa.load(filename, res_type='kaiser_fast',duration=2.5,sr=22050*2,offset=0.5)
    sample_rate = np.array(sample_rate)
    mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=13),axis=0)
    featurelive = mfccs
    livedf2 = featurelive

    livedf2 = pd.DataFrame(data=livedf2)

    livedf2 = livedf2.stack().to_frame().T

    twodim = np.expand_dims(livedf2, axis=2)

    livepreds = loaded_model.predict(twodim, 
                         batch_size=32, 
                         verbose=1)

    livepreds1=livepreds.argmax(axis=1)
    liveabc = livepreds1.astype(int).flatten()

    livepredictions = [LABEL_ENCODER[k] for k in liveabc.tolist()]

    K.clear_session()

    return livepredictions[0]

###############################################################################

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        recording = request.form['recording']
        return jsonify(Sentiment=get_sentiment(WAVE_OUTPUT_FILENAME))
    elif request.method == 'GET':
        return jsonify(Sentiment=get_sentiment(WAVE_OUTPUT_FILENAME))

if __name__ == '__main__':
    app.run(debug=True)
