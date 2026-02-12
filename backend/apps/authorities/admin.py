from django.contrib import admin
from .models import Agency, RoutingRule

@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email', 'contact_phone')
    search_fields = ('name', 'contact_email')

@admin.register(RoutingRule)
class RoutingRuleAdmin(admin.ModelAdmin):
    list_display = ('category', 'county', 'level', 'agency', 'active')
    list_filter = ('level', 'active', 'category', 'county')
    search_fields = ('category__name', 'agency__name', 'county__name')
    autocomplete_fields = ['category', 'county', 'agency']
