import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AttendanceDashboard from "./components/Attendancepage";   // ✅ correct
import LoginPage from "./components/LoginPage";                  // ✅ correct
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import AttendanceHistory from "./components/AttendanceHistory";  // ✅ correct
import HalfDayPermissionForm from "./components/Permission";     // ✅ correct
import Dashboard from "./components/AttendanceDashboard";        // ✅ added
import ForgotPasswordPage from "./components/ForgotPassword"; // ✅ new
import LeaveRequest from "./components/LeaveRequest"; // ✅ Leave management
import MyLeaves from "./components/MyLeaves"; // ✅ Leave management
import LeaveApproval from "./components/LeaveApproval"; // ✅ Leave management

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

serviceWorkerRegistration.register();
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/attendance-history" element={<AttendanceHistory />} />
        <Route path="/half-day-permission" element={<HalfDayPermissionForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* ✅ new */}
        <Route path="/leave-request" element={<LeaveRequest />} /> {/* ✅ Leave management */}
        <Route path="/my-leaves" element={<MyLeaves />} /> {/* ✅ Leave management */}
        <Route path="/leave-approval" element={<LeaveApproval />} /> {/* ✅ Leave management */}
      </Routes>
    </Router>
  </React.StrictMode>
);
