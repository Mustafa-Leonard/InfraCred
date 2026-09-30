import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.authority_users.models import AuthorityProfile

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
    print("Updating Authority User names and fixing admin visibility...")
    
    # 1. Update Names
    updated_count = 0
    for county in COUNTIES:
        for dept in DEPARTMENTS:
            username = f"{clean_slug(dept)}_{clean_slug(county)}"
            
            try:
                user = User.objects.get(username=username)
                user.first_name = dept
                user.last_name = county
                user.save()
                updated_count += 1
                # print(f"Updated {username} -> {dept} {county}")
            except User.DoesNotExist:
                # print(f"User {username} not found, skipping.")
                pass

    print(f"Updated names for {updated_count} users.")

    # 2. Fix Admin Visibility (Ensure admin1 is superuser)
    try:
        admin = User.objects.get(username="admin1")
        if not admin.is_superuser:
            admin.is_superuser = True
            admin.is_staff = True
            admin.save()
            print("SUCCESS: Elevated 'admin1' to Superuser status.")
        else:
            print("VERIFIED: 'admin1' is already a Superuser.")
            
        # Ensure admin1 has a profile (optional but good for consistency)
        if not hasattr(admin, 'authority_profile'):
             print("Creating missing profile for admin1...")
             # Assign to National Agency if exists, else first one
             from apps.authorities.models import Agency
             agency = Agency.objects.first()
             AuthorityProfile.objects.create(user=admin, agency=agency, permission_level='admin')

    except User.DoesNotExist:
        print("ERROR: 'admin1' user not found!")

    print("Done.")

if __name__ == "__main__":
    run()
