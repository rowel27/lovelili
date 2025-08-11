# your_app/webhook.py
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .models import Product
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY  # use from settings

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET  # define in settings.py

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        product_id = session['metadata'].get('product_id')
        print(f"Webhook received for product ID: {product_id}")

        try:
            product = Product.objects.get(id=product_id)
            if not product.is_sold:
                product.is_sold = True
                product.save()
                print(f"Product {product.name} marked as sold.")
        except Product.DoesNotExist:
            print(f"Product with ID {product_id} does not exist.")
            pass  # optional: log this

    return HttpResponse(status=200)
