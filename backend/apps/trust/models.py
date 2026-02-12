from django.db import models
from django.conf import settings

class UserReputation(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reputation')
    score = models.FloatField(default=50.0) # 0-100
    total_reports = models.PositiveIntegerField(default=0)
    verified_reports = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}: {self.score}"

class Confirmation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    report = models.ForeignKey('reports.Report', related_name='confirmations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'report')

    def __str__(self):
        return f"{self.user.username} confirmed {self.report.id}"

class TrustScore(models.Model):
    report = models.OneToOneField('reports.Report', on_delete=models.CASCADE, related_name='trust_score')
    overall_score = models.FloatField(default=0.0)
    reporter_factor = models.FloatField(default=0.0)
    confirmation_factor = models.FloatField(default=0.0)
    media_factor = models.FloatField(default=0.0)
    spatial_factor = models.FloatField(default=0.0)
    last_calculated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Score for Report {self.report.id}: {self.overall_score}"
