import cv2
import numpy as np
import asyncio
import websockets

# Variables for detection and tracking
detect = False

# Function for simulating person and object detection (phones, tablets, laptops)
async def simulate_detection(websocket):
    global detect
    cap = cv2.VideoCapture(0)  # Use '0' for the primary camera

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
    classes = []
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f]

    # Get output layer names
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    print("Simulation started")

    while detect:
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5)

        # Reset person count for each frame
        person_count = 0

        # Haar Cascade person detection
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            cv2.putText(frame, "Face", (x, y - 5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            person_count += 1  # Increment person count for each detection

        # Print message based on the number of face detections
        if person_count > 1:
            print("Cheating: Person detected")
            await websocket.send(f"Cheating: Person detected")

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
                    if class_id in [67, 63]:  # Class ID for cell phone in COCO dataset
                        detected_class = classes[class_id]
                        print("Cheating: Phone detected")
                        await websocket.send(f"Cheating: {detected_class.capitalize()} detected")

        # cv2.imshow('Camera View', frame) # for camera view
        # cv2.waitKey(1)
        await asyncio.sleep(1)  # Control the rate of detection

    cap.release()
    cv2.destroyAllWindows()
    print("Simulation stopped")

# Function to start simulation
async def start_simulation(websocket, path):
    global detect
    detect = True
    await simulate_detection(websocket)

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

# Add an infinite loop to prevent the script from terminating immediately
while True:
    pass
