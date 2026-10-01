from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse


User = get_user_model()


class AccountAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = 'Safe-local-password-92!'
        self.user = User.objects.create_user(
            username='local-citizen',
            email='citizen@example.com',
            password=self.password,
        )

    def test_login_accepts_username(self):
        response = self.client.post(reverse('login'), {
            'username': self.user.username,
            'password': self.password,
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_accepts_email_case_insensitively(self):
        response = self.client.post(reverse('login'), {
            'username': 'CITIZEN@example.com',
            'password': self.password,
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['id'], self.user.id)

    def test_refresh_rotation_invalidates_the_previous_token(self):
        login_response = self.client.post(reverse('login'), {
            'username': self.user.username,
            'password': self.password,
        })
        original_refresh = login_response.data['refresh']

        refresh_response = self.client.post(reverse('token_refresh'), {'refresh': original_refresh})

        self.assertEqual(refresh_response.status_code, 200)
        self.assertIn('access', refresh_response.data)
        self.assertNotEqual(refresh_response.data['refresh'], original_refresh)
        replay_response = self.client.post(reverse('token_refresh'), {'refresh': original_refresh})
        self.assertEqual(replay_response.status_code, 401)

    def test_registration_creates_a_password_that_can_log_in(self):
        response = self.client.post(reverse('register'), {
            'username': 'new-citizen',
            'email': 'new@example.com',
            'password': 'Unique-local-password-37!',
            'role': 'citizen',
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['username'], 'new-citizen')
        self.assertTrue(User.objects.get(username='new-citizen').check_password('Unique-local-password-37!'))
        login_response = self.client.post(reverse('login'), {
            'username': 'new-citizen',
            'password': 'Unique-local-password-37!',
        })
        self.assertEqual(login_response.status_code, 200)
        self.assertIn('access', login_response.data)

    def test_registration_rejects_admin_role(self):
        response = self.client.post(reverse('register'), {
            'username': 'public-admin',
            'email': 'admin@example.com',
            'password': 'Unique-local-password-37!',
            'role': 'admin',
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('role', response.data)

    def test_registration_rejects_duplicate_email_case_insensitively(self):
        response = self.client.post(reverse('register'), {
            'username': 'duplicate-email',
            'email': 'CITIZEN@example.com',
            'password': 'Unique-local-password-37!',
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.data)

    def test_registration_rejects_a_weak_password(self):
        response = self.client.post(reverse('register'), {
            'username': 'weak-password-user',
            'email': 'weak-password@example.com',
            'password': 'tiny',
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('non_field_errors', response.data)

    def test_password_reset_sends_link_and_updates_password(self):
        response = self.client.post(reverse('password_reset'), {'email': self.user.email})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        reset_response = self.client.post(reverse('password_reset_confirm'), {
            'uid': uid,
            'token': token,
            'password': 'Another-safe-password-27!',
        })

        self.assertEqual(reset_response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('Another-safe-password-27!'))
        old_password_login = self.client.post(reverse('login'), {
            'username': self.user.username,
            'password': self.password,
        })
        new_password_login = self.client.post(reverse('login'), {
            'username': self.user.username,
            'password': 'Another-safe-password-27!',
        })
        self.assertEqual(old_password_login.status_code, 401)
        self.assertEqual(new_password_login.status_code, 200)

    def test_password_reset_request_does_not_disclose_unknown_email(self):
        response = self.client.post(reverse('password_reset'), {'email': 'unknown@example.com'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)