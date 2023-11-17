import cv2
import numpy as np
import asyncio
import websockets

# Variable to control detection
detect = False

# Function for simulating person and phone detection
async def simulate_detection(websocket):
    global detect
    cap = cv2.VideoCapture(0)  # Use '0' for the primary camera

    # Load pre-trained YOLO weights and configurations
    net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
    classes = []
    with open("coco.names", "r") as f:
        classes = [line.strip() for line in f]

    # Get output layer names
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    print("Simulation started")

    consecutive_persons_detected = 0  # Counter for consecutive frames with multiple persons detected

    while detect:
        ret, frame = cap.read()
        if not ret:
            break

        # Object detection using YOLO
        height, width, channels = frame.shape
        blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
        net.setInput(blob)
        outs = net.forward(output_layers)

        persons_detected = 0  # Counter for persons detected in the current frame

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:  # Threshold
                    if class_id == 0:  # Class ID for person in COCO dataset
                        persons_detected += 1  # Increment counter for each person detected

                    elif class_id == 67:  # Class ID for cell phone in COCO dataset
                        await websocket.send(f"Phone detected: {classes[class_id]}")
                        print("Phone detected")

        # Check if more than one person is detected in the current frame
        if persons_detected > 1:
            consecutive_persons_detected += 1
        else:
            consecutive_persons_detected = 0

        # Send "Person detected" message only if multiple persons are consistently detected across frames
        if consecutive_persons_detected >= 1:  # Sending only when 5 consecutive frames have >1 person
            await websocket.send(f"{persons_detected} Persons detected")
            print(f"{persons_detected} Persons detected")

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
