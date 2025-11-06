import requests
import sys

def check_url(url, name):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            print(f"[OK] {name}: {url} - Working")
            return True
        else:
            print(f"[FAIL] {name}: {url} - Status {response.status_code}")
            return False
    except Exception as e:
        print(f"[ERROR] {name}: {url} - Error: {str(e)}")
        return False

print("SmartOptions Status Check")
print("=" * 40)

urls = [
    ("http://localhost:8000", "Backend API"),
    ("http://localhost:8000/admin/", "Admin Panel"),
    ("http://localhost:8000/swagger/", "Swagger UI"),
    ("http://localhost:8000/api/auth/", "Auth API"),
    ("http://localhost:19006", "Frontend"),
]

working = 0
for url, name in urls:
    if check_url(url, name):
        working += 1

print("=" * 40)
print(f"Status: {working}/{len(urls)} services working")

if working >= 3:
    print("Backend is ready! You can:")
    print("   • Access Swagger API docs: http://localhost:8000/swagger/")
    print("   • Use Admin panel: http://localhost:8000/admin/")
    print("   • Test API endpoints directly")