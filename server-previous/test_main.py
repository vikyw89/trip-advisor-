from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_read_main():
    response = client.get("/users/random-id/messages/subscribe")
    assert response.status_code == 200
    for message in response.iter_lines():
        print(message + "\n")
        assert "id" in message
        assert "text" in message
        assert "is_user" in message