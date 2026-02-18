import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../components/Images/image.png";
import { API_ENDPOINTS } from "../apiConfig";

const formatTime = (timeStr) => {
  if (!timeStr) return "--:--";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const AttendancePage = () => {
  const [status, setStatus] = useState("Loading...");
  const [statusClass, setStatusClass] = useState("status-box bg-light text-dark");
  const [attendance, setAttendance] = useState({ date: "", checkIn: "", checkOut: "", status: "" });
  const [employee, setEmployee] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  const token = localStorage.getItem("token");

  const fetchTodayAttendance = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(API_ENDPOINTS.ATTENDANCE_TODAY, {
        headers: { Authorization: `Token ${token}` },
      });
      const data = await res.json();

      if (res.status === 200) {
        setAttendance({
          date: data.attendance.date,
          checkIn: data.attendance.check_in,
          checkOut: data.attendance.check_out,
          status: data.attendance.status || "",
        });
        setEmployee(data.employee);

        if (data.attendance.check_in && !data.attendance.check_out) {
          setStatus(`✅ Checked In at ${formatTime(data.attendance.check_in)} (${data.attendance.status})`);
          setStatusClass("status-box bg-success text-white");
        } else if (data.attendance.check_in && data.attendance.check_out) {
          const checkoutMsg =
            data.attendance.status === "Late"
              ? `⚠️ Checked Out at ${formatTime(data.attendance.check_out)}`
              : `✅ Checked Out at ${formatTime(data.attendance.check_out)}`;
          setStatus(
            `Checked In: ${formatTime(data.attendance.check_in)} (${data.attendance.status}), ${checkoutMsg}`
          );
          setStatusClass("status-box bg-success text-white");
        } else {
          setStatus("No action yet");
          setStatusClass("status-box bg-light text-dark");
        }
      } else {
        setStatus(data.error || "Unable to fetch attendance");
        setStatusClass("status-box bg-danger text-white");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error fetching attendance");
      setStatusClass("status-box bg-danger text-white");
    }
  }, [token]);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCheck = async (type) => {
    if (!token) return alert("Please login");

    setLoading(true);

    // Get Geolocation
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const endpoint = type === "checkin" ? API_ENDPOINTS.CHECK_IN : API_ENDPOINTS.CHECK_OUT;
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await res.json();

          if (res.status === 200) {
            fetchTodayAttendance();
          } else {
            alert(data.error || "Action failed");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong. Try again later.");
        } finally {
          setLoading(false);
          setShowCheckoutModal(false);
          setShowCheckinModal(false);
        }
      },
      (error) => {
        setLoading(false);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access is required for attendance. Please enable location permissions.";
        }
        alert(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const openCheckoutModal = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCurrentTime(timeStr);
    setShowCheckoutModal(true);
  };

  // ✅ Check-In Modal (after 11:00 AM cutoff)
  const handleCheckinClick = () => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(11, 0, 0, 0);

    if (now > cutoff) {
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setCurrentTime(timeStr);
      setShowCheckinModal(true);
    } else {
      handleCheck("checkin");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1e6e64" }}>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={logo} alt="Nim Technologies Logo" style={{ height: "50px", marginRight: "10px" }} />
          </a>
          <button className="navbar-toggler d-lg-none" type="button" onClick={() => setIsNavOpen(true)}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-none d-lg-flex gap-3">
            <a className="btn btn-primary btn-sm text-white" href="/dashboard" style={{ borderRadius: "10px" }}>
              Dashboard
            </a>
            <button
              className="btn btn-outline-danger btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center p-3">
        <div className="card shadow-lg text-center p-4"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
          }}
        >
          <h2 className="fw-bold mb-4" style={{ color: "#6610f2" }}>Employee Attendance</h2>

          {/* Employee Info */}
          <div className="mb-4 text-dark text-start small">
            <p className="mb-1"><strong>Name:</strong> {employee.name || "—"}</p>
            <p className="mb-1"><strong>Email:</strong> {employee.email || "—"}</p>
            <p className="mb-0">Working Hours: <strong>10:00 AM – 6:00 PM</strong></p>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mb-4">
            <button
              className="btn btn-success flex-fill py-2"
              onClick={handleCheckinClick}
              disabled={loading || attendance.checkIn}
            >
              {loading ? "Processing..." : attendance.checkIn ? "Checked In" : "Check In"}
            </button>
            <button
              className="btn btn-danger flex-fill py-2"
              onClick={openCheckoutModal}
              disabled={loading || !attendance.checkIn || attendance.checkOut}
            >
              {attendance.checkOut ? "Checked Out" : "Check Out"}
            </button>
          </div>

          {/* Status */}
          <div className={`${statusClass} mt-3`}
            style={{ fontSize: "1rem", fontWeight: "500", borderRadius: "10px", padding: "12px", wordWrap: "break-word" }}
          >
            {status}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000 }}
        >
          <div className="p-4" style={{ background: "white", borderRadius: "15px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <h5 className="fw-bold mb-2">Confirm Check-Out</h5>
            <p className="mb-1">Are you sure you want to check out now?</p>
            <p className="text-muted mb-3">Time: <strong>{currentTime}</strong></p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-secondary flex-fill" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
              <button className="btn btn-danger flex-fill" onClick={() => handleCheck("checkout")}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkin Modal (after 11:00 AM cutoff) */}
      {showCheckinModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000 }}
        >
          <div className="p-4" style={{ background: "white", borderRadius: "15px", maxWidth: "400px", width: "90%", textAlign: "center" }}>
            <h5 className="fw-bold mb-2">❌ Check-In Closed</h5>
            <p className="mb-1">Check-In is not allowed after <strong>11:00 AM</strong>.</p>
            <p className="text-muted mb-3">Current Time: <strong>{currentTime}</strong></p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button className="btn btn-secondary flex-fill" onClick={() => setShowCheckinModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
