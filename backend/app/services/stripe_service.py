import stripe
from stripe.error import StripeError

from app.core.config import settings
from app.schemas.checkout import CheckoutItem

stripe.api_key = settings.stripe_secret_key


class StripeCheckoutConfigurationError(Exception):
    pass


class StripeCheckoutRequestError(Exception):
    pass


def create_checkout_session(
    items: list[CheckoutItem],
    success_url: str,
    cancel_url: str,
    currency: str,
    customer_email: str | None = None,
) -> tuple[str, str]:
    if not settings.stripe_secret_key or settings.stripe_secret_key == "sk_test_your_key":
        raise StripeCheckoutConfigurationError("Stripe secret key is not configured")

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=customer_email,
            line_items=[
                {
                    "quantity": item.quantity,
                    "price_data": {
                        "currency": currency,
                        "unit_amount": item.unit_amount_cents,
                        "product_data": {
                            "name": item.name,
                            "images": [item.image_url],
                        },
                    },
                }
                for item in items
            ],
        )
    except StripeError as exc:
        message = getattr(exc, "user_message", None) or str(exc)
        raise StripeCheckoutRequestError(message) from exc

    return str(session.url), str(session.id)
