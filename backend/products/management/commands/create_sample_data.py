from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from products.models import Category, Drop, Product
from decimal import Decimal


class Command(BaseCommand):
    help = 'Create sample jewelry and accessory data for LoveLili'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample jewelry and accessory data...')

        # Create Categories
        categories = [
            {'name': 'Necklaces'},
            {'name': 'Earrings'},
            {'name': 'Bracelets'},
            {'name': 'Rings'},
            {'name': 'Anklets'},
            {'name': 'Hair Accessories'},
            {'name': 'Bags & Purses'},
            {'name': 'Scarves & Wraps'},
        ]

        created_categories = {}
        for cat_data in categories:
            category, created = Category.objects.get_or_create(
                name=cat_data['name']
            )
            created_categories[cat_data['name']] = category
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create Drops
        drops = [
            {
                'name': 'Summer Elegance Collection',
                'description': 'Light, airy pieces perfect for warm summer days. Features delicate chains, pastel stones, and beach-inspired designs.',
                'drop_date': timezone.now() + timedelta(days=7),
                'is_live': True
            },
            {
                'name': 'Golden Hour Essentials',
                'description': 'Timeless pieces that catch the light beautifully. Gold-plated jewelry with crystal accents for everyday elegance.',
                'drop_date': timezone.now() + timedelta(days=14),
                'is_live': False
            },
            {
                'name': 'Bohemian Dreams',
                'description': 'Artistic, handcrafted pieces with natural stones and organic shapes. Perfect for the free-spirited fashionista.',
                'drop_date': timezone.now() + timedelta(days=21),
                'is_live': False
            }
        ]

        created_drops = {}
        for drop_data in drops:
            drop, created = Drop.objects.get_or_create(
                name=drop_data['name'],
                defaults=drop_data
            )
            created_drops[drop_data['name']] = drop
            if created:
                self.stdout.write(f'Created drop: {drop.name}')

        # Create Products
        products = [
            # Necklaces
            {
                'name': 'Luna Moonstone Pendant',
                'description': 'A stunning moonstone pendant on a delicate silver chain. The stone catches light beautifully and changes color with movement.',
                'price': Decimal('89.99'),
                'category': created_categories['Necklaces'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Golden Chain Statement Necklace',
                'description': 'A bold, layered gold-plated chain necklace perfect for making a statement. Versatile enough for both casual and formal occasions.',
                'price': Decimal('129.99'),
                'category': created_categories['Necklaces'],
                'drop': created_drops['Golden Hour Essentials']
            },
            {
                'name': 'Bohemian Crystal Choker',
                'description': 'Handcrafted choker featuring natural crystals and leather cord. Each piece is unique with its own crystal formation.',
                'price': Decimal('74.99'),
                'category': created_categories['Necklaces'],
                'drop': created_drops['Bohemian Dreams']
            },

            # Earrings
            {
                'name': 'Pearl Drop Earrings',
                'description': 'Elegant freshwater pearl drops on sterling silver posts. Classic design that never goes out of style.',
                'price': Decimal('64.99'),
                'category': created_categories['Earrings'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Geometric Gold Hoops',
                'description': 'Modern geometric gold-plated hoops with a contemporary twist. Perfect for adding edge to any outfit.',
                'price': Decimal('89.99'),
                'category': created_categories['Earrings'],
                'drop': created_drops['Golden Hour Essentials']
            },
            {
                'name': 'Handmade Clay Earrings',
                'description': 'Unique handcrafted clay earrings in earthy tones. Each pair is one-of-a-kind with organic shapes and textures.',
                'price': Decimal('49.99'),
                'category': created_categories['Earrings'],
                'drop': created_drops['Bohemian Dreams']
            },

            # Bracelets
            {
                'name': 'Charm Bracelet Collection',
                'description': 'Sterling silver charm bracelet with meaningful symbols. Includes love, friendship, and adventure charms.',
                'price': Decimal('94.99'),
                'category': created_categories['Bracelets'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Gold Bangle Set',
                'description': 'Set of three gold-plated bangles that can be worn together or separately. Stackable design for endless combinations.',
                'price': Decimal('119.99'),
                'category': created_categories['Bracelets'],
                'drop': created_drops['Golden Hour Essentials']
            },
            {
                'name': 'Leather Wrap Bracelet',
                'description': 'Hand-braided leather bracelet with silver accents. Adjustable fit and bohemian styling.',
                'price': Decimal('39.99'),
                'category': created_categories['Bracelets'],
                'drop': created_drops['Bohemian Dreams']
            },

            # Rings
            {
                'name': 'Rose Gold Stacking Rings',
                'description': 'Set of five rose gold-plated stacking rings with different textures and finishes. Mix and match for your perfect combination.',
                'price': Decimal('79.99'),
                'category': created_categories['Rings'],
                'drop': created_drops['Golden Hour Essentials']
            },
            {
                'name': 'Opal Statement Ring',
                'description': 'Stunning opal ring in sterling silver setting. The opal displays beautiful color play and is perfect for special occasions.',
                'price': Decimal('149.99'),
                'category': created_categories['Rings'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Handmade Ceramic Ring',
                'description': 'Unique ceramic ring with hand-painted design. Each piece is individually crafted and glazed.',
                'price': Decimal('34.99'),
                'category': created_categories['Rings'],
                'drop': created_drops['Bohemian Dreams']
            },

            # Anklets
            {
                'name': 'Delicate Chain Anklet',
                'description': 'Thin silver chain anklet with a small charm. Perfect for summer and beach days.',
                'price': Decimal('44.99'),
                'category': created_categories['Anklets'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Gold Ankle Chain',
                'description': 'Elegant gold-plated ankle chain with adjustable length. Adds a touch of glamour to any outfit.',
                'price': Decimal('59.99'),
                'category': created_categories['Anklets'],
                'drop': created_drops['Golden Hour Essentials']
            },

            # Hair Accessories
            {
                'name': 'Pearl Hair Clips Set',
                'description': 'Set of three pearl-embellished hair clips. Perfect for elegant updos and special occasions.',
                'price': Decimal('29.99'),
                'category': created_categories['Hair Accessories'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Gold Hair Pins',
                'description': 'Set of decorative gold-plated hair pins with geometric patterns. Great for securing updos with style.',
                'price': Decimal('24.99'),
                'category': created_categories['Hair Accessories'],
                'drop': created_drops['Golden Hour Essentials']
            },

            # Bags & Purses
            {
                'name': 'Woven Straw Clutch',
                'description': 'Handwoven straw clutch with leather trim. Perfect for summer events and beach outings.',
                'price': Decimal('89.99'),
                'category': created_categories['Bags & Purses'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Embroidered Crossbody Bag',
                'description': 'Hand-embroidered crossbody bag with bohemian patterns. Features adjustable strap and multiple pockets.',
                'price': Decimal('124.99'),
                'category': created_categories['Bags & Purses'],
                'drop': created_drops['Bohemian Dreams']
            },

            # Scarves & Wraps
            {
                'name': 'Silk Scarf Collection',
                'description': 'Luxurious silk scarves with hand-painted designs. Available in multiple colorways and patterns.',
                'price': Decimal('69.99'),
                'category': created_categories['Scarves & Wraps'],
                'drop': created_drops['Summer Elegance Collection']
            },
            {
                'name': 'Handwoven Shawl',
                'description': 'Artisan handwoven shawl with fringe details. Made from natural fibers in earthy tones.',
                'price': Decimal('89.99'),
                'category': created_categories['Scarves & Wraps'],
                'drop': created_drops['Bohemian Dreams']
            }
        ]

        for product_data in products:
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                self.stdout.write(f'Created product: {product.name} - ${product.price}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data!\n'
                f'Categories: {len(created_categories)}\n'
                f'Drops: {len(created_drops)}\n'
                f'Products: {len(products)}\n\n'
                f'You can now:\n'
                f'1. Visit http://127.0.0.1:8000/admin/ to manage your data\n'
                f'2. Visit http://localhost:3000 to see your frontend with real data\n'
                f'3. Test the API at http://127.0.0.1:8000/api/'
            )
        ) 