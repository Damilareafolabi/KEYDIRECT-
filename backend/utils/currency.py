"""
Local Currency Conversion Engine for KeyDirect Real Estate.
Zero reliance on paid third-party currency APIs; pegged locally via database tables.
"""

from decimal import Decimal, ROUND_HALF_UP
import logging

logger = logging.getLogger(__name__)

# Fallback in-memory rate dictionary (pegged to 1 USD base)
STATIC_EXCHANGE_RATES = {
    "USD": Decimal("1.00"),
    "NGN": Decimal("1650.00"),
    "EUR": Decimal("0.92"),
    "GBP": Decimal("0.78"),
    "CAD": Decimal("1.38"),
    "AED": Decimal("3.67"),
}


def convert_currency(
    amount: Decimal,
    from_currency: str,
    to_currency: str,
    rate_table: dict = None,
) -> Decimal:
    """
    Converts monetary values safely with Decimal precision.

    Args:
        amount: Raw decimal value to convert.
        from_currency: Source ISO currency code (e.g., 'NGN').
        to_currency: Target ISO currency code (e.g., 'USD').
        rate_table: Optional dynamic dictionary mapping currency codes to USD rates.

    Returns:
        Converted amount in target currency rounded to 2 decimal places.
    """
    if not amount or amount <= Decimal("0"):
        return Decimal("0.00")

    from_code = from_currency.upper().strip()
    to_code = to_currency.upper().strip()

    if from_code == to_code:
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    rates = rate_table or STATIC_EXCHANGE_RATES

    from_rate = rates.get(from_code, STATIC_EXCHANGE_RATES.get(from_code, Decimal("1.00")))
    to_rate = rates.get(to_code, STATIC_EXCHANGE_RATES.get(to_code, Decimal("1.00")))

    # Convert to USD base first, then to target currency
    usd_amount = amount / from_rate
    target_amount = usd_amount * to_rate

    return target_amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_inspection_fee_savings(
    base_price: Decimal,
    property_category: str,
) -> Decimal:
    """
    Calculates estimated inspection and middleman fees saved by the tenant.
    Physical agent inspection fees in prime Nigerian metros average ₦10,000 - ₦25,000.
    """
    if property_category in ["Apartments", "Rental", "Self Contain"]:
        return Decimal("15000.00")
    elif property_category in ["Commercial", "Plots / Land", "Event Centers"]:
        return Decimal("30000.00")
    return Decimal("10000.00")
