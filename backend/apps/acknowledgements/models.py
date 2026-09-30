from django.db import models
from django.conf import settings

class Acknowledgement(models.Model):
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='acknowledgements')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    digital_signature = models.TextField(blank=True, help_text="Digital acknowledgement record/audit trail")
    is_official = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Ack by {self.user.username} for {self.case}"
