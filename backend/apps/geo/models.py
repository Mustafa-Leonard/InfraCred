from django.db import models

class County(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Jurisdiction(models.Model):
    name = models.CharField(max_length=100)
    boundary = models.TextField(help_text="GeoJSON boundary data")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

