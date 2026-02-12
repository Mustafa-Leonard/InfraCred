from .models import RoutingRule

def get_assigned_agency(category_id, county_id):
    """
    Real-time routing algorithm.
    Input: category_id, location(county_id)
    
    Logic:
    Step 1 - try county agency
    Step 2 - fallback to national level if nothing is found at county level
    """
    # Step 1: Try county agency
    rule = RoutingRule.objects.filter(
        category_id=category_id,
        county_id=county_id,
        level='county',
        active=True
    ).select_related('agency').first()
    
    if rule:
        return rule.agency
        
    # Step 2: Fallback to national level
    rule = RoutingRule.objects.filter(
        category_id=category_id,
        level='national',
        active=True
    ).select_related('agency').first()
    
    if rule:
        return rule.agency
        
    return None
