from django.db import models
from django.conf import settings

# ... (rest of imports if any, but in this file it was just models and settings)

class InfrastructureType(models.Model):
    name = models.CharField(max_length=100) # e.g., Road and Transport
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True) # Icon class name

    def __str__(self):
        return self.name

class Category(models.Model):
    infra_type = models.ForeignKey(InfrastructureType, related_name='categories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100) # e.g., Pothole
    
    def __str__(self):
        return f"{self.infra_type.name} - {self.name}"

class Report(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('investigating', 'Investigating'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    )
    
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reports', on_delete=models.CASCADE)
    infra_type = models.ForeignKey(InfrastructureType, on_delete=models.PROTECT)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    description = models.TextField()
    location = models.CharField(max_length=255, help_text="Format: lat,lng")
    address = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='reports/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Clustering reference (filled by celery task later)
    cluster = models.ForeignKey('clustering.Cluster', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Report {self.id}: {self.category.name} at {self.address}"
