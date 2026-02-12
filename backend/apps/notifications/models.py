from django.db import models
from django.conf import settings


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('report_created', 'Report Created'),
        ('report_updated', 'Report Updated'),
        ('report_assigned', 'Report Assigned'),
        ('report_in_progress', 'Report In Progress'),
        ('report_resolved', 'Report Resolved'),
        ('report_rejected', 'Report Rejected'),
        ('comment_added', 'Comment Added'),
        ('acknowledgement', 'Acknowledgement Received'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    report = models.ForeignKey('reports.Report', on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.title}"
