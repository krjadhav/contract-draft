# Contract Drafter API

Contract Drafter API is a FastAPI application that generates contract templates using OpenAI. It allows you to specify details about a contract and returns a draft of the contract filled with those details. The application also utilizes Redis for caching previously generated templates to improve performance and uses SlowAPI for rate limiting.

## Prerequisites

- Python 3.7+
- Redis
- An OpenAI account with a valid API key

## Installation

1. Navigate to the cloned project:

```
cd contract-drafter
```

2. Install the dependencies:

```
pip install -r requirements.txt
```

3. Create a `.env` file in the project root and add your OpenAI API key and Redis URL:

```
OPENAI_API_KEY=<your_openai_key>
REDIS_URI=<your_redis_url>
```

## Running the Application

Start the application with:

```
uvicorn main:app --reload
```

The application will be accessible at `http://localhost:8000`.

## API Endpoints

### POST `/api/draft`

Generates a contract based on the provided details. This endpoint is rate limited to 2 requests per minute.

#### Request Body

```json
{
    "agreement_type": "Non-disclosure Agreement",
    "governing_law": "California",
    "party_a": "Company A",
    "party_b": "Company B",
    "effective_date": "2023-07-05"
}
```

#### Response

```json
{
    "message": "<contract text>"
}
```
