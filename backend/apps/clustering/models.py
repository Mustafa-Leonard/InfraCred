from django.db import models

class Cluster(models.Model):
    center = models.CharField(max_length=255, help_text="Format: lat,lng")
    radius = models.FloatField(default=0.0) # in meters
    category = models.ForeignKey('reports.Category', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Cluster {self.id} - {self.category.name}"
