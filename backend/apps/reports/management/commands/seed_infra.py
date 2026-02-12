from django.core.management.base import BaseCommand
from apps.reports.models import InfrastructureType, Category

class Command(BaseCommand):
    help = 'Seed initial infrastructure types and categories'

    def handle(self, *args, **kwargs):
        data = {
            "Road and Transport": ["Potholes", "Collapsed sections", "Damaged bridges", "Blocked roads"],
            "Water and Sanitation": ["Burst water pipes", "No water supply", "Sewage overflow", "Blocked drainage", "Open manholes"],
            "Electricity": ["Power outage", "Fallen power lines", "Broken street-lights", "Exposed electrical cables"],
            "Solid Waste": ["Illegal dumping sites", "Uncollected garbage", "Overflowing bins", "Burning wastes"],
            "Public Facilities": ["Damaged school buildings", "Broken hospital equipment", "Collapsed public toilets"],
            "Flooding and Drainage": ["Flooded roads", "Blocked culverts", "Storm water overflow"],
            "Public Safety": ["Uncovered trenches", "Collapsing buildings", "Dangerous construction sites"]
        }

        for infra_name, categories in data.items():
            infra_type, created = InfrastructureType.objects.get_or_create(name=infra_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Infrastructure Type: {infra_name}'))
            
            for cat_name in categories:
                Category.objects.get_or_create(infra_type=infra_type, name=cat_name)
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded infrastructure categories'))
