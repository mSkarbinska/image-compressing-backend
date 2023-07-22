import pytest
from helpers import is_valid_url, is_valid_mongo_id
from exceptions import InvalidUrlError, InvalidMongoObjectIdError, InvalidTypeError


@pytest.mark.parametrize(
    "url, expected_exception",
    [
        ("http://www.example.com", None),
        ("https://www.example.com/path", None),
        ("ftp://ftp.example.com", None),
        ("aaa.example.com", InvalidUrlError),
        ("http://", InvalidUrlError),
    ],
)
def test_is_valid_url(url, expected_exception):
    if expected_exception is None:
        assert is_valid_url(url)
    else:
        with pytest.raises(expected_exception):
            is_valid_url(url)


@pytest.mark.parametrize(
    "mongo_id, expected_exception",
    [
        ("5f8827d5e663c2f5e48aa232", None),
        ("507f1f77bcf86cd799439011", None),
        ("invalid_id", InvalidMongoObjectIdError),
        (12345, InvalidTypeError),
    ],
)
def test_is_valid_mongo_id(mongo_id, expected_exception):
    if expected_exception is None:
        assert is_valid_mongo_id(mongo_id)
    else:
        with pytest.raises(expected_exception):
            is_valid_mongo_id(mongo_id)
