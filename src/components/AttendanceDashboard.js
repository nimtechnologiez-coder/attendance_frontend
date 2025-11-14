// Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../components/Images/image.png"; // ✅ make sure path is correct

export default function Dashboard() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  // ✅ Close mobile nav when resizing to large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsNavOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#1e6e64", fontFamily: "Segoe UI, sans-serif" }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src={logo}
              alt="Nim Technologies Logo"
              style={{ height: "50px", marginRight: "10px" }}
            />
          </a>

          {/* Mobile Menu Button */}
          <button
            
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsNavOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex gap-3">
            <button
              className="btn btn-outline-danger btn-sm"
              style={{ borderRadius: "10px" }}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div
          className="position-fixed top-0 start-0 h-100   p-4"
          style={{
            backgroundColor: "#ede3eaff",
            width: "60%",
            maxWidth: "300px",
            zIndex: 1050,
            transform: isNavOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <button
            className="btn btn-close mb-4"
            onClick={() => setIsNavOpen(false)}
          ></button>

          <button className="btn btn-outline-danger w-100" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Section */}
      <div className="container py-5">
        <div id="dashboard" className="row g-4 fade-in">
          {/* Attendance */}
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card card-hover text-center p-4"
              onClick={() => navigate("/attendance")}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: "2.2rem" }}>🕒</span>
              <h3 className="fw-semibold">Attendance</h3>
              <p className="text-muted">
                Check-In / Check-Out your daily attendance
              </p>
            </div>
          </div>

          {/* Permission */}
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card card-hover text-center p-4"
              onClick={() => navigate("/half-day-permission")}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: "2.2rem" }}>📝</span>
              <h3 className="fw-semibold">Permission</h3>
              <p className="text-muted">Request or view your permissions</p>
            </div>
          </div>

          {/* Attendance History */}
          <div className="col-12 col-md-6 col-lg-4">
            <div
              className="card card-hover text-center p-4"
              onClick={() => navigate("/attendance-history")}
              style={{ cursor: "pointer" }}
            >
              <span style={{ fontSize: "2.2rem" }}>📊</span>
              <h3 className="fw-semibold">Attendance History</h3>
              <p className="text-muted">
                View your past attendance records
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
