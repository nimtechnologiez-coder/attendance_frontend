import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../components/Images/image.png";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeePermissionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    startTime: "",
    endTime: "",
    reason: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // ✅ Auto-close mobile nav when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch logged-in employee info
  useEffect(() => {
    const fetchEmployee = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "warning", text: "Please login first." });
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/employee/me/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFormData((prev) => ({
            ...prev,
            employeeName: data.name,
            employeeId: data.employeeId,
          }));
        } else {
          setMessage({ type: "warning", text: "Employee details not found. Please login again." });
        }
      } catch (error) {
        console.error(error);
        setMessage({ type: "danger", text: "Failed to fetch employee info." });
      }
    };
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime || !formData.reason) {
      setMessage({ type: "warning", text: "Please fill in all fields." });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/permission/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          start_time: formData.startTime,
          end_time: formData.endTime,
          reason: formData.reason,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowModal(true);
        setFormData((prev) => ({ ...prev, startTime: "", endTime: "", reason: "" }));
      } else {
        setMessage({ type: "danger", text: data.error || "Failed to submit request." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: "An error occurred while submitting request." });
    }
  };

  const handleModalOk = () => {
    setShowModal(false);
    navigate("/attendance");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1e6e64" }}>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={logo} alt="Logo" style={{ height: "50px", marginRight: "10px" }} />
          </a>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsNavOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Links */}
          <div className="d-none d-lg-flex gap-3">
            <a
              className="btn btn-primary btn-sm text-white"
              href="/dashboard"
              style={{ borderRadius: "10px" }}
            >
              Dashboard
            </a>
            <button
              className="btn btn-outline-danger btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div
          className={`position-fixed top-0 start-0 h-100  p-4 ${isNavOpen ? "show" : ""}`}
          style={{
            backgroundColor: "#ede3eaff",
            width: "60%",
            maxWidth: "300px",
            zIndex: 1050,
            transform: isNavOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <button className="btn btn-close mb-4" onClick={() => setIsNavOpen(false)}></button>
          <a className="btn btn-primary mb-3 w-100" href="/dashboard">
            Dashboard
          </a>
          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center p-3">
        <div
          className="card shadow-lg p-4 w-100"
          style={{
            maxWidth: "450px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="fw-bold mb-4 text-center" style={{ color: "#6610f2" }}>
            Permission Request
          </h2>

          {message.text && <div className={`alert alert-${message.type} text-center`}>{message.text}</div>}

          <form onSubmit={handleSubmit}>
            <label className="fw-bold mt-2">Employee Name</label>
            <input type="text" name="employeeName" value={formData.employeeName} readOnly className="form-control bg-light" />

            <label className="fw-bold mt-3">Employee ID</label>
            <input type="text" name="employeeId" value={formData.employeeId} readOnly className="form-control bg-light" />

            <label className="fw-bold mt-3">Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="form-control" required />

            <label className="fw-bold mt-3">End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="form-control" required />

            <label className="fw-bold mt-3">Reason</label>
            <textarea
              name="reason"
              rows="3"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Explain your reason..."
              className="form-control"
              required
            />

            <button type="submit" className="btn btn-primary w-100 mt-4 py-2">
              Submit Request
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
        >
          <div
            className="p-4 text-center"
            style={{
              background: "linear-gradient(135deg, #d1f7d6, #f0fff4)",
              borderRadius: "20px",
              maxWidth: "400px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "scaleIn 0.3s",
            }}
          >
            <div className="d-flex justify-content-center mb-3">
              <CheckCircle size={60} className="text-success" />
            </div>
            <h4 className="text-success fw-bold">Permission Request Submitted!</h4>
            <p className="text-muted mt-2">Your request has been sent successfully</p>
            <button className="btn btn-success px-4 mt-3" onClick={handleModalOk}>
              OK
            </button>
          </div>
          <style>{`
            @keyframes scaleIn {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default EmployeePermissionForm;
