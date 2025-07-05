import requests

data = {
    "licensePlate": "KA01AB1234",
    "violationType": "Overspeeding",
    "time": "2024-05-01 14:30",
    "place": "MG Road, Bangalore",
    "imagePath": "X:\\VS Code\\traffic\\Smart-Traffic-Management\\server\\vehicle_data_with_helmet\\all_vehicle_detected_img\\car_2.jpg"
    
}

response = requests.post("http://localhost:8000/api/challan", json=data)
print("Status code:", response.status_code)
print("Raw response:", response.text)
