# Notes about this project:

## The actual 400 error format is different from what the API docs showed:

  API docs said:
  {
    "error": "Invalid message format",
    "details": [...]
  }

  Actual API returns:
  {
    "error": {
      "message": [
        {"field": "author", "message": "..."}
      ],
      "timestamp": "..."
    }
  }

## The API brings the messages ordered from the oldest to the newest, by default

