import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../components/Images/image.png";

const AttendanceHistory = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({ present: 0, late: 0, absent: 0 });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch attendance for selected month
  const fetchAttendance = async (month) => {
    if (!month) return;

    try {
      const url = `http://localhost:8000/api/attendance/history/?month=${month}`;
      const res = await fetch(url, {
        headers: { Authorization: `Token ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const data = await res.json();
      setAttendanceData(data);

      // Update summary
      let present = 0,
        late = 0,
        absent = 0;
      data.forEach((record) => {
        if (record.status === "Present") present++;
        else if (record.status === "Late") late++;
        else if (record.status === "Absent") absent++;
      });
      setSummary({ present, late, absent });
      setError("");
    } catch (err) {
      console.error(err);
      setError("No records found for this month.");
      setAttendanceData([]);
      setSummary({ present: 0, late: 0, absent: 0 });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#1e6e64" }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img
              src={logo}
              alt="Company Logo"
              style={{ height: "50px", marginRight: "10px" }}
            />
          </a>
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setIsNavOpen(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="d-none d-lg-flex gap-3">
            <a
              className="btn btn-primary btn-sm text-white"
              href="/dashboard"
              style={{ borderRadius: "11px" }}
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

        {/* Mobile Nav */}
        <div
          className={`position-fixed top-0 start-0 h-100 p-4 ${
            isNavOpen ? "show" : ""
          }`}
          style={{
            backgroundColor: "#ede3eaff",
            width: "80%",
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
          <a className="btn btn-primary mb-3 w-100" href="/dashboard">
            Dashboard
          </a>
          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        <h2 className="fw-bold text-center mb-4 text-white">
          Attendance Monthly Report
        </h2>

        {/* Month Picker */}
        <div className="row justify-content-center g-2 mb-4">
          <div className="col-12 col-md-auto text-center">
            <label
              htmlFor="monthFilter"
              className="form-label fw-semibold text-white"
            >
              Select Month:
            </label>
          </div>
          <div className="col-12 col-md-auto">
            <input
              type="month"
              id="monthFilter"
              className="form-control"
              onChange={(e) => fetchAttendance(e.target.value)}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="row g-3 mb-4">
          {["present", "late", "absent"].map((key, idx) => (
            <div className="col-12 col-sm-6 col-md-4" key={idx}>
              <div
                className="p-4 text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "15px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}
              >
                <h3 className="mb-1">{summary[key]}</h3>
                <p className="mb-0 text-uppercase fw-semibold">
                  {key === "present"
                    ? "Days Present"
                    : key === "late"
                    ? "Days Late"
                    : "Days Absent"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p className="text-center text-danger">{error}</p>}

        {/* Attendance Table */}
        <div
          className="p-3"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
          }}
        >
          <div className="table-responsive">
            <table className="table text-white table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length > 0 ? (
                  attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.check_in || "-"}</td>
                      <td>{record.check_out || "-"}</td>
                      <td>
                        {record.status === "Present" && (
                          <span className="badge bg-success px-3 py-2">
                            Present
                          </span>
                        )}
                        {record.status === "Late" && (
                          <span className="badge bg-danger px-3 py-2">
                            Late
                          </span>
                        )}
                        {record.status === "Absent" && (
                          <span className="badge bg-warning px-3 py-2">
                            Absent
                          </span>
                        )}
                      </td>
                      <td>{record.remarks || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
