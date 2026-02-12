from django.db import models
from django.conf import settings

class Agency(models.Model):
    name = models.CharField(max_length=200)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    website = models.URLField(blank=True)
    
    def __str__(self):
        return self.name


class RoutingRule(models.Model):
    LEVEL_CHOICES = (
        ('county', 'County'),
        ('national', 'National'),
    )
    
    category = models.ForeignKey('reports.Category', on_delete=models.CASCADE, related_name='routing_rules')
    county = models.ForeignKey('geo.County', on_delete=models.CASCADE, null=True, blank=True, related_name='routing_rules')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='routing_rules')
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.name} -> {self.agency.name} ({self.level})"


