import validators
from exceptions import InvalidUrlError, InvalidMongoObjectIdError, InvalidTypeError
from bson import ObjectId


def is_valid_url(url):
    if validators.url(url):
        return True
    else:
        raise InvalidUrlError(url)


def is_valid_mongo_id(value):
    if not isinstance(value, str):
        raise InvalidTypeError(value, 'str')

    try:
        ObjectId(value)
        return True
    except Exception:
        raise InvalidMongoObjectIdError(value)