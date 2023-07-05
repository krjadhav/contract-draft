from pydantic import BaseModel


class ContractDetails(BaseModel):
    agreement_type: str
    governing_law: str
    party_a: str
    party_b: str
    effective_date: str
