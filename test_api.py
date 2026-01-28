import requests
import json

BASE_URL = "http://localhost:5000"


def test_info():
    print("Testing /api/info endpoint...")
    response = requests.get(f"{BASE_URL}/api/info")
    print(json.dumps(response.json(), indent=2))
    print()


def test_single_prediction():
    print("Testing /api/predict endpoint...")

    data = {
        "features": [5.1, 3.5, 1.4, 0.2]
    }

    response = requests.post(
        f"{BASE_URL}/api/predict",
        json=data,
        headers={"Content-Type": "application/json"}
    )

    print(json.dumps(response.json(), indent=2))
    print()


if __name__ == "__main__":
    print("=" * 60)
    print("ML API Testing Script")
    print("=" * 60)

    test_info()
    test_single_prediction()