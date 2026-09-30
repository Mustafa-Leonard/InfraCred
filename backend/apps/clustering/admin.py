from django.contrib import admin
from .models import Cluster

@admin.register(Cluster)
class ClusterAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'is_active', 'created_at')
    list_filter = ('is_active', 'category')
