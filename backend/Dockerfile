FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .
# Install Gunicorn for production and debugpy for development
RUN pip install --no-cache-dir gunicorn debugpy
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Port for Gunicorn and debugpy
EXPOSE 8000
EXPOSE 5678

# Healthcheck to make sure the container is running correctly
HEALTHCHECK CMD curl --fail http://localhost:8000/ || exit 1

# Run migrations before starting the application so SQLite is initialized.
CMD ["sh", "-c", "python manage.py migrate && gunicorn --bind 0.0.0.0:8000 smartoptions.wsgi"]
