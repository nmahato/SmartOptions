# Django Backend Debugging Setup

## 1. VS Code Debugging (Recommended)

### Create Launch Configuration
Create `.vscode/launch.json` in your project root:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Django",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/backend/manage.py",
            "args": [
                "runserver",
                "0.0.0.0:8000"
            ],
            "django": true,
            "cwd": "${workspaceFolder}/backend",
            "env": {
                "DJANGO_SETTINGS_MODULE": "smartoptions.settings"
            },
            "console": "integratedTerminal",
            "justMyCode": false
        }
    ]
}
```

### How to Use:
1. Set breakpoints in your Python code
2. Press `F5` or go to Run > Start Debugging
3. Select "Django" configuration
4. Server starts in debug mode

## 2. PyCharm Debugging

### Django Run Configuration:
1. Go to Run > Edit Configurations
2. Add new Django Server configuration
3. Set:
   - Host: `0.0.0.0`
   - Port: `8000`
   - Python interpreter: Your virtual environment
   - Working directory: `backend/`
   - Environment variables: `DJANGO_SETTINGS_MODULE=smartoptions.settings`

## 3. Command Line Debugging with pdb

### Add to your code:
```python
import pdb; pdb.set_trace()
```

### Or use ipdb (enhanced debugger):
```bash
pip install ipdb
```

```python
import ipdb; ipdb.set_trace()
```

## 4. Django Debug Toolbar (Web Interface)

### Install:
```bash
pip install django-debug-toolbar
```

### Add to settings.py:
```python
INSTALLED_APPS = [
    # ... other apps
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ... other middleware
]

INTERNAL_IPS = [
    '127.0.0.1',
    'localhost',
]
```

### Add to urls.py:
```python
from django.conf import settings
from django.urls import include, path

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

## 5. Logging Configuration

### Add to settings.py:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

## 6. Environment Variables for Debugging

### Update .env.local:
```
DEBUG=1
DJANGO_LOG_LEVEL=DEBUG
```

## Quick Start (VS Code):
1. Install Python extension in VS Code
2. Create the launch.json file above
3. Set breakpoints in your views/models
4. Press F5 to start debugging
5. Access http://localhost:8000 to trigger breakpoints

## Debugging Tips:
- Use `print()` statements for quick debugging
- Check Django logs in the terminal
- Use browser developer tools for frontend issues
- Enable Django's debug mode for detailed error pages