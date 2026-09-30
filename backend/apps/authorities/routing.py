from .models import RoutingRule, Agency
from apps.geo.models import County

class RoutingEngine:
    @staticmethod
    def resolve_county(location_str):
        """
        Determines the county for a given lat,lng string.
        Placeholder implementation: In production, this would use PostGIS 
        to find which County boundary contains the point.
        """
        # For demonstration/testing, if the location string is "0,0", return the first county
        # In a real app, we'd do: County.objects.filter(boundary__contains=point).first()
        return County.objects.first()

    @staticmethod
    def find_best_agency(category, location_str):
        """
        Routing Algorithm:
        1. Look for a County-level rule matching category and location.
        2. If not found, look for a National-level rule matching category.
        3. Fallback to first available agency.
        """
        county = RoutingEngine.resolve_county(location_str)
        
        # 1. County Level Search
        if county:
            rule = RoutingRule.objects.filter(
                category=category,
                county=county,
                level='county',
                active=True
            ).first()
            if rule:
                return rule.agency, f"Routed to {rule.agency.name} based on county-level rule for {category.name} in {county.name}."

        # 2. National Level Search
        rule = RoutingRule.objects.filter(
            category=category,
            level='national',
            active=True
        ).first()
        if rule:
            return rule.agency, f"Routed to {rule.agency.name} based on national-level rule for {category.name}."

        # 3. Fallback
        fallback_agency = Agency.objects.first()
        if fallback_agency:
            return fallback_agency, f"No specific routing rule found for {category.name}. Routed to fallback agency: {fallback_agency.name}."
        
        return None, "No agency available for routing."
