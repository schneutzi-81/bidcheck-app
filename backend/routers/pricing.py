from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PricingRequest(BaseModel):
    license_cost: float
    service_day_rate: float
    effort_days_low: float
    effort_days_base: float
    effort_days_high: float
    risk_buffer_percent: float


class Scenario(BaseModel):
    service_cost: float
    total: float
    with_buffer: float


class PricingResponse(BaseModel):
    scenarios: dict[str, Scenario]
    margin_indicator: str
    assumptions: list[str]
    disclaimer: str


@router.post("/projects/{project_id}/pricing", response_model=PricingResponse)
def calculate_pricing(project_id: int, body: PricingRequest):
    buffer = body.risk_buffer_percent / 100

    def calc(effort_days: float) -> Scenario:
        service_cost = round(effort_days * body.service_day_rate, 2)
        total = round(service_cost + body.license_cost, 2)
        with_buffer = round(total * (1 + buffer), 2)
        return Scenario(service_cost=service_cost, total=total, with_buffer=with_buffer)

    return PricingResponse(
        scenarios={
            "low": calc(body.effort_days_low),
            "base": calc(body.effort_days_base),
            "high": calc(body.effort_days_high),
        },
        margin_indicator="Check margin against standard 25% target",
        assumptions=[
            f"License cost is fixed at {body.license_cost:,.0f}",
            f"Day rate applied uniformly across all effort scenarios at {body.service_day_rate:,.0f}/day",
            f"Risk buffer of {body.risk_buffer_percent:.0f}% applied to total cost",
            "Effort estimates are directional — not contractually binding",
        ],
        disclaimer="For internal review only. Not a formal quotation.",
    )
