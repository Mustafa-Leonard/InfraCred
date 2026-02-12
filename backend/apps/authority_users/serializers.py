from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import AuthorityProfile

User = get_user_model()

class AuthorityProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    display_username = serializers.ReadOnlyField(source='user.username')
    agency_name = serializers.ReadOnlyField(source='agency.name')
    user_id = serializers.ReadOnlyField(source='user.id')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = AuthorityProfile
        fields = ['id', 'user_id', 'username', 'password', 'display_username', 'first_name', 'last_name', 'agency', 'agency_name', 'permission_level']
        extra_kwargs = {
            'agency': {'required': False}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        
        if not username or not password:
            raise serializers.ValidationError({"detail": "Username and password are required for new users."})

        # Create the user
        user = User.objects.create_user(
            username=username,
            password=password,
            role='authority'
        )
        
        # Create profile
        profile = AuthorityProfile.objects.create(user=user, **validated_data)
        return profile

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        username = validated_data.pop('username', None)

        # Update User fields if provided
        user = instance.user
        if username:
            user.username = username
        if password:
            user.set_password(password)
        user.save()

        # Update Profile fields
        return super().update(instance, validated_data)
