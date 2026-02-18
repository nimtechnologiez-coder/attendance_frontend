// Centralized API configuration
// During development, it uses http://localhost:8000
// In production, it will use the value of the REACT_APP_API_URL environment variable

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/api/accounts/login/`,
    LOGOUT: `${API_BASE_URL}/api/accounts/logout/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/accounts/forgot-password/`,

    EMPLOYEE_ME: `${API_BASE_URL}/api/employee/me/`,

    ATTENDANCE_TODAY: `${API_BASE_URL}/api/attendance/today/`,
    CHECK_IN: `${API_BASE_URL}/api/attendance/checkin/`,
    CHECK_OUT: `${API_BASE_URL}/api/attendance/checkout/`,
    ATTENDANCE_HISTORY: (month) => `${API_BASE_URL}/api/attendance/history/?month=${month}`,

    PERMISSION_CREATE: `${API_BASE_URL}/api/permission/create/`,
    PERMISSION_LIST: `${API_BASE_URL}/api/permission/list/`,

    LEAVE_TYPES: `${API_BASE_URL}/api/leave/types/`,
    LEAVE_BALANCE: `${API_BASE_URL}/api/leave/balance/`,
    LEAVE_REQUEST: `${API_BASE_URL}/api/leave/request/`,
    MY_LEAVE_REQUESTS: `${API_BASE_URL}/api/leave/my-requests/`,
    PENDING_LEAVE: `${API_BASE_URL}/api/leave/pending/`,
    APPROVE_LEAVE: (id) => `${API_BASE_URL}/api/leave/${id}/approve/`,
    REJECT_LEAVE: (id) => `${API_BASE_URL}/api/leave/${id}/reject/`,
};
