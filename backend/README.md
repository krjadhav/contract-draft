# Contract Drafter API

Contract Drafter API is a FastAPI application that generates contract templates using OpenAI. It allows you to specify details about a contract and returns a draft of the contract filled with those details. The application also utilizes Redis for caching previously generated templates to improve performance and uses SlowAPI for rate limiting.

## Prerequisites

- Python 3.7+
- Redis
- MongoDB
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

### POST `/api/contracts/draft`

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

### POST `/api/auth`

Authenticates a user and returns an access token.

#### Request Body

```json
{
    "username": "<username>",
    "password": "<password>"
}
```

#### Response

```json
{
    "access_token": "<access token>",
    "token_type": "bearer"
}
```
### GET `/api/contracts`

Retrieves all contracts associated with the authenticated user.

#### Response

```json
[
    {
        "id": "64a7c25545f8b43f449f4481",
        "created_at": "July 7th, 7:44 am"
    },
    ...
]
```
### POST `/api/contracts/save`

Saves a draft of a contract. 

#### Request Body

```json
{
    "text": "<contract text>"
}
```

#### Response

```json
{
    "detail": "Contract saved"
}
```

### POST `/api/contracts/clauses`

Generates a specific legal clause based on the provided text. This endpoint is rate limited to 10 requests per minute.

#### Request Body

```json
{
    "text": "<user prompt>"
}
```

#### Response

```json
{
    "message": "<clause text>"
}
```

### GET `/api/contract/{contract_id}`

Retrieves a specific contract associated with the authenticated user.

#### Path Parameters

- `contract_id`: The ID of the contract to retrieve.

#### Response

```json
{
    "id": "<contract id>",
    "text": "<contract text>"
}
```