import requests
import json

def test_summarize_endpoint():
    """
    Tests the /summarize endpoint of the Flask API.
    """
    url = "http://127.0.0.1:5000/summarize"
    headers = {"Content-Type": "application/json"}
    data = {
        "text": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds."
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))

        # Check if the request was successful
        if response.status_code == 200:
            print("Successfully received response from server.")
            print("Summary:", response.json().get("summary"))
        else:
            print(f"Error: Server returned status code {response.status_code}")
            try:
                print("Error details:", response.json())
            except json.JSONDecodeError:
                print("Could not decode JSON from response:")
                print(response.text)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the request: {e}")

if __name__ == "__main__":
    test_summarize_endpoint() 