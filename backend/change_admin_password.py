#!/usr/bin/env python
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append('/app')

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smartoptions.settings')

# Setup Django
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    admin = User.objects.get(username='admin')
    admin.set_password('admin123')
    admin.save()
    print('Admin password successfully changed to admin123')
except User.DoesNotExist:
    print('Admin user not found')
except Exception as e:
    print(f'Error: {e}')