import asyncio
import os

import websockets
import base64
import cv2
import numpy as np
import face_recognition
import tempfile

# Variables for detection and tracking
detect = False
active_websocket = None
reference_encoding = None
output_layers = None
net = None
classes = None
isImageSend = False


# Function to delete the temporary image file
def delete_temporary_image():
    if passport_image_filename:
        try:
            os.remove(passport_image_filename)
            print("Temporary image file deleted successfully.")
        except Exception as e:
            print("Error deleting temporary image file:", e)


# Function for decoding and saving the passport image
async def process_passport_image(passport_image_base64):
    global reference_encoding
    global passport_image_filename

    try:
        # Convert base64 image to OpenCV format
        image_bytes = base64.b64decode(passport_image_base64.split(',')[1])
        image_np = np.frombuffer(image_bytes, np.uint8)
        passport_image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        # Get the directory path of the current script
        script_directory = os.path.dirname(__file__)

        # Save the passport image as a temporary file in the same directory as the main script
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg', dir=script_directory) as temp_file:
            temp_file.write(image_bytes)
            passport_image_filename = temp_file.name  # Store the filename
            temp_file_path = temp_file.name

        # Encode the face in the passport image
        reference_encoding = face_recognition.face_encodings(passport_image)[0]
        await active_websocket.send("Passport image uploaded successfully")

        return temp_file_path
    except Exception as e:
        print("Error processing passport image:", e)
        return None


# Function for detecting cheating by matching the decoded image with the person in the camera feed
async def detect_cheating(camera_image_base64):
    global detect
    global active_websocket
    global reference_encoding
    global output_layers
    global net
    global classes
    global isImageSend

    try:
        if reference_encoding is None:
            print("Passport image not processed yet!")
            return

        # Convert base64 image to OpenCV format
        image_bytes = base64.b64decode(camera_image_base64.split(',')[1])
        image_np = np.frombuffer(image_bytes, np.uint8)
        camera_image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        # Convert the frame to RGB (face_recognition library uses RGB)
        rgb_frame = cv2.cvtColor(camera_image, cv2.COLOR_BGR2RGB)

        # Find all face locations and encodings in the current frame
        face_locations = face_recognition.face_locations(rgb_frame)

        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        # Compare each face encoding in the frame with the reference encoding
        for face_location, face_encoding in zip(face_locations, face_encodings):
            # Compare the current face encoding with the reference encoding
            match = face_recognition.compare_faces([reference_encoding], face_encoding)

            if match[0]:
                print("Match found!")
                if not isImageSend:
                    # Save the photo of the person
                    top, right, bottom, left = face_location
                    person_photo = camera_image[top:bottom, left:right]

                    # Convert the person's photo to base64
                    _, person_photo_base64 = cv2.imencode('.jpg', person_photo)
                    person_photo_base64_str = base64.b64encode(person_photo_base64).decode('utf-8')

                    # Send the photo to Angular
                    await active_websocket.send(f"Match found! Sending photo:{person_photo_base64_str}")
                    # await active_websocket.send(person_photo_base64_str)
                    isImageSend = True
                break
            else:
                await active_websocket.send("cheating: face not matching user profile!")
                break

        # Object detection using YOLO
        height, width, channels = camera_image.shape
        blob = cv2.dnn.blobFromImage(camera_image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.2:  # Adjust confidence threshold as needed
                    if class_id in [67, 63]:  # Class ID for cell phone and laptop in COCO dataset
                        detected_class = classes[class_id]
                        await active_websocket.send(f"Cheating: {detected_class.capitalize()} detected!")

        # Multiple person detection
        if len(face_locations) > 1:
            await active_websocket.send("Cheating: More than one face detected!")

    except Exception as e:
        print("Error processing image:", e)


# Function to start detection
async def start_detection(websocket, path):
    global detect
    global active_websocket
    active_websocket = websocket
    detect = True

    while detect:
        message = await websocket.recv()

        # Split the received message to separate the string "camera_feed" and the base64 data
        message_parts = message.split(",", 1)
        if message_parts[0] == "camera_feed":
            # Start cheating detection using camera feed
            await detect_cheating(message_parts[1])  # Pass the base64 data to the function
        else:
            # Process passport image
            await process_passport_image(message)


# Function to stop detection
def stop_detection():
    global detect
    detect = False


async def main():
    global output_layers
    global net
    global classes
    try:
        # Load YOLO
        net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
        classes = []
        with open("coco.names", "r") as f:
            classes = [line.strip() for line in f]

        # Get output layer names
        layer_names = net.getLayerNames()
        output_layers_indices = net.getUnconnectedOutLayers()

        # Convert output layer indices to list of integers
        output_layers = [layer_names[idx - 1] for idx in output_layers_indices]

        print("WebSocket server started")
        async with websockets.serve(start_detection, "localhost", 8765):
            await asyncio.Future()  # Run forever
    except KeyboardInterrupt:
        print("Server terminated by user")
    finally:
        stop_detection()
        delete_temporary_image()


print("Starting WebSocket server")
asyncio.run(main())
