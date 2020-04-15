def test_hello(client):
    response = client.get("api/")
    assert response.data == "Hello"
