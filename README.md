# Nim Attendance Portal 📱🏢

A modern, geolocation-based attendance management system built with **Django** (Backend) and **React** (Frontend). Designed for **Nim Technologies**, this portal ensures accurate employee attendance tracking using geofencing and provides a seamless user experience via a Progressive Web App (PWA).

## 🚀 capabilities

- **📍 Geofencing Attendance**: Employees can only check in/out when they are within **200 meters** of the office location.
- **🕒 Cutoff Time Logic**: 
  - Check-In is strictly disabled after **11:00 AM**.
  - Late status is automatically marked if checking in after 10:00 AM.
- **📱 Progressive Web App (PWA)**:
  - Installable on mobile and desktop.
  - Offline capabilities (Workbox caching).
  - App-like experience with a standalone launch.
- **🔐 Secure Authentication**:
  - Employee login via ID, Email, or Name.
  - Token-based authentication (Django REST Framework).
- **📊 Dashboard & History**:
  - View daily attendance status.
  - Check monthly attendance history.
  - Apply for leave/permissions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Create React App)
- **Styling**: Bootstrap 5, Custom CSS
- **PWA**: Workbox (Service Workers, Manifest)
- **Routing**: React Router DOM`



### Backend
- **Framework**: Django, Django REST Framework (DRF)
- **Database**: MySQL
- **Authentication**: TokenAuthentication

---

## 📝 Implementation Plan & Status

### ✅ Completed Features
- [x] **Project Setup**: Initial Django & React scaffolding.
- [x] **Database Integration**: MySQL connection with `Employee`, `Attendance`, and `Department` models.
- [x] **Geofencing Logic**: 
    - Backend calculation using Haversine formula.
    - Frontend geolocation capture.
    - **Office Coordinates**: `8.1631162, 77.4108498`.
- [x] **Authentication Flow**:
    - Login API with multiple credentials support (ID/Email/Name).
    - Frontend Login Page with error handling.
- [x] **Attendance Rules**:
    - **Cutoff Time**: Check-in blocked after 11:00 AM.
    - **Late Marking**: Automatic "Late" status between 10:00 AM - 11:00 AM.
- [x] **PWA Implementation**:
    - `manifest.json` configuration.
    - Service Worker setup using Workbox for offline support.
    - Cache management (v3).
- [x] **Leave Management**: 
    - Full workflow for leave application and approval.
    - Integrated leave balance tracking.
    - Simplified UI: Only **Sick Leave** and **Casual Leave** are displayed to employees.
    - Backend stability: Resolved 500 errors in leave calculation and submission APIs.
- [x] **UI/UX Polishing**:
    - Cleaned up ESLint dependencies and hook ordering.
    - Removed redundant "(days/year)" mentions in leave forms.
    - Responsive Dashboard and History pages.

### 🚧 Future Roadmap
- [ ] **Face Recognition**: Add AI-based face verification during check-in.
- [ ] **Push Notifications**: Notify employees about check-in times and approvals.
- [ ] **Admin Analytics**: Interactive charts for attendance trends.
- [ ] **Multi-Location Support**: Allow assigning employees to different office branches.

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.x
- Node.js & npm
- MySQL Server

### 1. Backend Setup
```bash
cd attendance_backend
# Create virtual environment
python -m venv venv
# Activate virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create Superuser
python manage.py createsuperuser

# Start Server
python manage.py runserver 0.0.0.0:8000
```

### 2. Frontend Setup
```bash
cd attendance_frontend
# Install dependencies
npm install

# Start Development Server
npm start
```

### 3. PWA Production Build
```bash
cd attendance_frontend
npm run build
```

---

## 🧪 How to Test

1. **Login**: Use credentials (e.g., `admin@gmail.com` / `admin`).
2. **Check-In**: 
   - Ensure you are within 200m of the office.
   - Try checking in before 11:00 AM (Success).
   - Try checking in after 11:00 AM (Blocked with error).
3. **PWA**:
   - Open in Chrome.
   - Click the "Install" icon in the address bar.
   - Test offline mode by disabling network in DevTools.

---

**Developed for Nim Technologies**