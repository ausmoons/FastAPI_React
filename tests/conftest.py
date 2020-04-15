import pytest
from addressBook import main


@pytest.fixture
def app():
    app = main.create_app("test")
    yield app


@pytest.fixture
def client(app):
    return app.test_client()
