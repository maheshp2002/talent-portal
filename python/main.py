import cv2
import asyncio
import websockets
import base64
import face_recognition
import numpy as np

# Variables for detection and tracking
detect = False
active_websocket = None

# Function for simulating person and object detection (phones, tablets, laptops)
async def simulate_detection(passport_image_base64):
    global detect
    global active_websocket
    cap = cv2.VideoCapture(0)  # Use '0' for the primary camera

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

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

    print("Simulation started")

    try:
        # Convert base64 image to OpenCV format
        image_bytes = base64.b64decode(passport_image_base64.split(',')[1])
        image_np = np.frombuffer(image_bytes, np.uint8)
        decoded_image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

        # Check if the image was properly decoded
        if decoded_image is None:
            raise ValueError("Failed to decode image")

        # Save the decoded photo
        cv2.imwrite("decoded_photo.jpg", decoded_image)

        # Load the reference image for face comparison
        reference_image = decoded_image
        reference_encoding = face_recognition.face_encodings(reference_image)[0]

        while detect:
            ret, frame = cap.read()
            if not ret:
                print("Error: Camera capture failed")
                break

            try:
                # Face comparison with the reference image
                compare_result = compare_faces(frame, reference_encoding)
                if not compare_result:
                    print("Cheating: Face not matching user profile!")
                    await active_websocket.send(f"Cheating: Face not matching user profile!")

                # Haar Cascade person detection
                gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5)

                # Check for multiple faces in the camera feed
                if len(faces) > 1:
                    print("Error: More than one face detected")
                    await active_websocket.send(f"Cheating: More than one face detected!")
                    continue

                # Object detection using YOLO for phone, tablet, and laptop
                height, width, channels = frame.shape
                blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
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
                                print(f"Cheating: {detected_class.capitalize()} detected")
                                await active_websocket.send(f"Cheating: {detected_class.capitalize()} detected!")

                # Display the frame with face rectangles
                for (x, y, w, h) in faces:
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

                # Display the resulting frame
                cv2.imshow('Face Recognition', frame)

                # Break the loop if 'q' is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

                await asyncio.sleep(1)  # Control the rate of detection
                if active_websocket and active_websocket.closed:
                    detect = False

            except Exception as e:
                print("Error in simulation loop:", e)

    except Exception as e:
        print("Error processing image:", e)
        # Send an error message to the client or handle the error as needed

    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("Simulation stopped")

# Function to compare faces using face recognition
def compare_faces(face_image, reference_encoding):
    # Convert the frame to RGB (face_recognition library uses RGB)
    rgb_frame = cv2.cvtColor(face_image, cv2.COLOR_BGR2RGB)

    # Find all face locations and encodings in the current frame
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

    # Compare each face encoding in the frame with the reference encoding
    for face_encoding in face_encodings:
        # Compare the current face encoding with the reference encoding
        match = face_recognition.compare_faces([reference_encoding], face_encoding)

        if match[0]:
            print("Match found!")
            return True
        else:
            return False

# Function to start simulation
async def start_simulation(websocket, path):
    global detect
    global active_websocket
    active_websocket = websocket
    detect = True
    await simulate_detection(await websocket.recv())

# Function to stop simulation
def stop_simulation():
    global detect
    detect = False

# Start WebSocket server
start_server = websockets.serve(start_simulation, "localhost", 8765)

try:
    print("WebSocket server started")
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
except KeyboardInterrupt:
    print("Server terminated by the user.")
finally:
    loop = asyncio.get_event_loop()
    tasks = asyncio.all_tasks(loop=loop)

    for task in tasks:
        task.cancel()

    loop.run_until_complete(asyncio.gather(*tasks, return_exceptions=True))
    loop.close()
    print("WebSocket server stopped")
