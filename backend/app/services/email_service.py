import logging
import smtplib
from email.message import EmailMessage
from html import escape

from app.core.config import settings
from app.models.product import Product

logger = logging.getLogger(__name__)


def _smtp_configured() -> bool:
    return bool(settings.smtp_host and settings.smtp_from_email)


def _send_email(*, to_email: str, subject: str, text_body: str, html_body: str) -> bool:
    if not _smtp_configured():
        logger.warning("stock notification email skipped: SMTP is not configured")
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = to_email
    message.set_content(text_body)
    message.add_alternative(html_body, subtype="html")

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=12) as smtp:
            if settings.smtp_use_tls:
                smtp.starttls()
            if settings.smtp_username and settings.smtp_password:
                smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)
    except Exception:
        logger.exception("stock notification email failed: to=%s", to_email)
        return False

    return True


def send_stock_notification_confirmation(*, to_email: str, product: Product, locale: str = "it") -> bool:
    product_path = f"/en/products/{product.slug}" if locale == "en" else f"/products/{product.slug}"
    product_url = f"{settings.frontend_url.rstrip('/')}{product_path}"
    product_name = escape(product.name)
    safe_product_url = escape(product_url, quote=True)

    if locale == "en":
        subject = f"We will notify you when {product.name} is back"
        text_body = (
            "Thank you for your request.\n\n"
            f"We saved your email for {product.name}. "
            "As soon as it is available again, you will receive an email from Accordi Jewelry.\n\n"
            f"Product: {product_url}\n\n"
            "Accordi Jewelry"
        )
        html_body = f"""
        <p>Thank you for your request.</p>
        <p>
          We saved your email for <strong>{product_name}</strong>.
          As soon as it is available again, you will receive an email from Accordi Jewelry.
        </p>
        <p><a href="{safe_product_url}">View product</a></p>
        <p>Accordi Jewelry</p>
        """
    else:
        subject = f"Ti avviseremo quando {product.name} sara disponibile"
        text_body = (
            "Grazie per la tua richiesta.\n\n"
            f"Abbiamo salvato la tua email per {product.name}. "
            "Appena sara di nuovo disponibile, riceverai una mail da Accordi Jewelry.\n\n"
            f"Prodotto: {product_url}\n\n"
            "Accordi Jewelry"
        )
        html_body = f"""
        <p>Grazie per la tua richiesta.</p>
        <p>
          Abbiamo salvato la tua email per <strong>{product_name}</strong>.
          Appena sara di nuovo disponibile, riceverai una mail da Accordi Jewelry.
        </p>
        <p><a href="{safe_product_url}">Vedi prodotto</a></p>
        <p>Accordi Jewelry</p>
        """

    return _send_email(to_email=to_email, subject=subject, text_body=text_body, html_body=html_body)
