import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.authorities.models import Agency
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

def clean_name(name):
    """Helper to create clean slugs for usernames"""
    return name.lower().replace(" ", "_").replace("'", "")

def run():
    print("Starting population of Kenya Authority Users...")
    
    total_created = 0
    
    for county in COUNTIES:
        for dept in DEPARTMENTS:
            # 1. Generate Username: department_county (e.g., water_and_sanitation_kilifi)
            dept_slug = clean_name(dept)
            county_slug = clean_name(county)
            username = f"{dept_slug}_{county_slug}"
            
            # 2. Generate Agency Name: {Dept} Authority {County} (e.g., Water and Sanitation Authority Kilifi)
            agency_name = f"{dept} Authority {county}"
            
            print(f"Processing: {username} for {agency_name}...")

            # 3. Create or Get Agency
            agency, created = Agency.objects.get_or_create(
                name=agency_name,
                defaults={
                    "contact_email": f"contact@{username}.go.ke",
                    "contact_phone": "020-000000",
                    "website": f"https://{county_slug}.go.ke/{dept_slug}"
                }
            )

            # 4. Create User
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=f"{username}@infracred.go.ke",
                    password="password123",  # Default password
                    role='authority',
                    agency=agency
                )
                
                # 5. Create Authority Profile
                AuthorityProfile.objects.create(
                    user=user,
                    agency=agency,
                    permission_level='admin'  # Authority Admin
                )
                
                total_created += 1
                print(f"  -> Created user: {username}")
            else:
                print(f"  -> User {username} already exists. Skipping.")

    print(f"\nPopulation Complete! Total new users created: {total_created}")
    print("All users have password: 'password123'")

if __name__ == "__main__":
    run()
