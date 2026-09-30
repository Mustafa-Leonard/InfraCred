from .models import TrustScore, UserReputation, Confirmation
from apps.reports.models import Report
from django.db.models import Count, QuerySet

class TrustScoringEngine:
    @staticmethod
    def calculate_report_score(report: Report):
        """
        Calculates trust score based on:
        - Reporter reputation (0-30%)
        - Confirmations (0-30%)
        - Media presence (0-20%)
        - Spatial similarity/Clustering (0-20%)
        """
        # 1. Reporter Factor
        reputation, _ = UserReputation.objects.get_or_create(user=report.reporter)
        reporter_factor = (reputation.score / 100.0) * 30.0

        # 2. Confirmation Factor
        conf_count = report.confirmations.count()
        # Cap at 10 confirmations for max score
        confirmation_factor = min(conf_count * 3, 30.0)

        # 3. Media Factor
        media_factor = 20.0 if report.image else 0.0

        # 4. Spatial Factor
        spatial_factor = 0.0
        if report.cluster:
            # More reports in the same cluster = higher spatial trust
            similar_reports = report.cluster.report_set.count()
            spatial_factor = min(similar_reports * 4, 20.0)

        overall = reporter_factor + confirmation_factor + media_factor + spatial_factor

        TrustScore.objects.update_or_create(
            report=report,
            defaults={
                'overall_score': overall,
                'reporter_factor': reporter_factor,
                'confirmation_factor': confirmation_factor,
                'media_factor': media_factor,
                'spatial_factor': spatial_factor
            }
        )
        return overall

class ReputationEngine:
    @staticmethod
    def update_user_reputation(user):
        """
        Updates user reliability based on history.
        """
        reputation, _ = UserReputation.objects.get_or_create(user=user)
        reports = Report.objects.filter(reporter=user)
        
        total = reports.count()
        if total == 0:
            return

        resolved = reports.filter(status='resolved').count()
        rejected = reports.filter(status='rejected').count()
        
        # Base score 50 + (resolved * 5) - (rejected * 10)
        # Clamped between 0 and 100
        new_score = 50.0 + (resolved * 5.0) - (rejected * 10.0)
        reputation.score = max(0.0, min(100.0, new_score))
        reputation.total_reports = total
        reputation.verified_reports = resolved
        reputation.save()
