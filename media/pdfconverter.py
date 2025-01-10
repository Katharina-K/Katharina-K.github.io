
import os
import numpy as np
#from pdf2image import convert_from_path
from tensorflow.keras.preprocessing.image import load_img
#from tensorflow.keras.utils import save_img
from tensorflow.keras.preprocessing.image import save_img

#pdf to image converter
# folder="MakeBreakBilder"
# for index,filename in enumerate(os.listdir(folder)):
#     image = convert_from_path('MakeBreakBilder/'+filename)
#     image[0].save('MakeBreakpng/'+str(index)+'.jpg', 'JPEG')

#image resizer
folder="MakeBreakNew/"
size=(400,400)
images=list(np.ones(len(os.listdir(folder))))
for index,filename in enumerate(os.listdir(folder)):
    #images[index]=load_img(folder+str(filename)).resize(size)
    save_img('MakeBreakNew/'+filename, load_img(folder+str(filename)).resize(size))
