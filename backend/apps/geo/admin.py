from django.contrib import admin
from .models import Jurisdiction, County

@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Jurisdiction)
class JurisdictionAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')

