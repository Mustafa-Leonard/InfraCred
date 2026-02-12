import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.authority_users.models import AuthorityProfile
from apps.authorities.models import Agency

User = get_user_model()

# List of all 47 Counties in Kenya
COUNTIES = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta",
    "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
    "Tharaka Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
    "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
    "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo Marakwet", "Nandi",
    "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
    "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
    "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"
]

# List of 7 Departments
DEPARTMENTS = [
    "Water and Sanitation",
    "Power",
    "Transport",
    "Public Safety",
    "Public Facilities",
    "Environment",
    "Flooding and Drainage"
]

def clean_slug(name):
    return name.lower().replace(" ", "_").replace("'", "")

def run():
    print("Starting Fix and Populate Script...")

    # 1. Fix Admin User
    try:
        admin, created = User.objects.get_or_create(username="admin1", defaults={"email":"admin1@infracred.com"})
        if created:
            admin.set_password("password123")
        
        # Ensure Superuser
        if not admin.is_superuser or not admin.is_staff:
            admin.is_superuser = True
            admin.is_staff = True
            admin.save()
            print("SUCCESS: Elevated 'admin1' to Superuser status.")
        else:
            print("VERIFIED: 'admin1' is already a Superuser.")

        # Ensure Admin Profile
        if not hasattr(admin, 'authority_profile'):
             print("Creating missing profile for admin1...")
             agency = Agency.objects.first()
             if agency:
                AuthorityProfile.objects.create(user=admin, agency=agency, permission_level='admin')
             else:
                 print("WARNING: No agencies found! Cannot create profile for admin.")

    except Exception as e:
        print(f"ERROR fixing admin: {e}")

    # 2. Update User Names
    print("Updating Authority User names...")
    updated_count = 0
    for county in COUNTIES:
        for dept in DEPARTMENTS:
            username = f"{clean_slug(dept)}_{clean_slug(county)}"
            
            try:
                user = User.objects.get(username=username)
                # Only update if names are missing or raw defaults
                user.first_name = dept
                user.last_name = county
                user.save()
                updated_count += 1
            except User.DoesNotExist:
                pass

    print(f"Updated names for {updated_count} users.")
    print("Done.")

if __name__ == "__main__":
    run()
