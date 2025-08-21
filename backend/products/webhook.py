# your_app/webhook.py
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Product
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

stripe.api_key = settings.STRIPE_SECRET_KEY  # use from settings

@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    # payment successful
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")
        for pid in product_ids:
            product = Product.objects.get(id=pid)
            product.is_reserved = False
            product.is_sold = True
            product.save()

    # payment abandoned or expired
    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")
        for pid in product_ids:
            product = Product.objects.get(id=pid)
            product.is_reserved = False
            product.save()

    return JsonResponse({"status": "success"})
