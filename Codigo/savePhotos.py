import sqlite3
#REMEMBER TO PIP INSTALL MATPLOTLIB
import matplotlib.pyplot as plt
import io

#DATABASE CONNECTION
conn = sqlite3.connect('dataBase.db')
cursor = conn.cursor()

#WHEN YOU HAVE TO SAVE THE PHOTO, THE NAME OF THE PHOTO IS LOADED IN X
#THE SYLLABLES RB INDICATES THAT THE FILE WILL BE OPENED IN READ-ONLY MODE AND THAT IT WILL BE OPENED IN BINARY MODE
with open('X', 'rb') as file:
    image_bytes=file.read()

#INSERT IMAGE INTO DATABASE
#IN THE PHOTO SECTION THE IMAGE WILL BE SAVED IN BINARY
cursor.execute("INSERT INTO persons_images (id, photo) VALUES (?, ?)", (1, image_bytes))
conn.commit()

#RECOVER IMAGE FROM DATABASE
cursor.execute("SELECT photo FROM persons_images WHERE id=?", (1,))
image_recovered= cursor.fetchone()[0]

#CONVERT THE IMAGE BYTES TO A BYTESIO OBJECT
image_bytes_io=io.BytesIO(image_recovered)

#DISPLAY IMAGE USING MATPLOTLIB
image = plt.imread(image_bytes_io)
plt.imshow(image)
plt.axis('off')
plt.show


#CLOSE CONNECTION
conn.close()