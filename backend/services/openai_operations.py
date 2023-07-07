import os
import re

import openai
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()  # load environment variables from .env file
openai.api_key = os.getenv("OPENAI_API_KEY")


def generate_draft_prompt(details):
    """
    This function generates the prompt for the OpenAI API call.
    """
    prompt = f"""
    Generate a template for {details.agreement_type}
    contract under {details.governing_law} law for
    [PARTY A] and [PARTY B] on [EFFECTIVE DATE].
    Keep it under 1000 words"
    """
    return prompt


def generate_clause_prompt(user_prompt):
    """
    This function generates the clause for the OpenAI API call
    """
    prompt = f"""
    Generate a legal clause to {user_prompt}.
    Provide a well-drafted clause that is clear, concise, and legally sound.
    Keep it under 200 words.
    """
    return prompt


def execute_prompt(prompt):
    """
    This function calls the OpenAI API to generate a
    contract with the provided details.
    """
    try:
        openai_response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1000,
        )
        return openai_response.choices[0].text.strip()

    except openai.error.Timeout as e:
        # Handle timeout error, e.g. retry or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request timed out: {e}"
        )
    except openai.error.APIError as e:
        # Handle API error, e.g. retry or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API returned an API Error: {e}"
        )
    except openai.error.APIConnectionError as e:
        # Handle connection error, e.g. check network or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request failed to connect: {e}"
        )
    except openai.error.InvalidRequestError as e:
        # Handle invalid request error, e.g. validate parameters or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request was invalid: {e}"
        )
    except openai.error.AuthenticationError as e:
        # Handle authentication error, e.g. check credentials or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request was not authorized: {e}"
        )
    except openai.error.PermissionError as e:
        # Handle permission error, e.g. check scope or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request was not permitted: {e}"
        )
    except openai.error.RateLimitError as e:
        # Handle rate limit error, e.g. wait or log
        raise HTTPException(
            status_code=500, detail=f"OpenAI API request exceeded rate limit: {e}"
        )


def generate_contract(details):
    prompt = generate_draft_prompt(details)
    return execute_prompt(prompt)


def generate_clause(user_prompt):
    prompt = generate_clause_prompt(user_prompt)
    return execute_prompt(prompt)


def fill_in_template(template, details):
    """
    This function fills in the placeholders in
    the template with the provided details.
    """
    print("ENTERS FILL IN TEMPLATE!")
    print(f"template = {type(template)}, {template}")
    template = re.sub(r"\[PARTY A\]", details.party_a, template, flags=re.IGNORECASE)
    template = re.sub(r"\[PARTY B\]", details.party_b, template, flags=re.IGNORECASE)
    template = re.sub(
        r"\[EFFECTIVE DATE\]", details.effective_date, template, flags=re.IGNORECASE
    )
    return template
