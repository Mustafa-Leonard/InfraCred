from django.contrib import admin
from .models import InfrastructureType, Category, Report

@admin.register(InfrastructureType)
class InfrastructureTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'infra_type')
    list_filter = ('infra_type',)
    search_fields = ('name', 'infra_type__name')


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'status', 'created_at')
    list_filter = ('status', 'infra_type')
    raw_id_fields = ('reporter', 'cluster')
