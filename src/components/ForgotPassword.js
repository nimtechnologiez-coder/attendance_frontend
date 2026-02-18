import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../components/Images/image.png";
import { API_ENDPOINTS } from "../apiConfig";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Password Reset Submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.new_password !== formData.confirm_password) {
      setErrorMessage("New password and confirm password do not match!");
      setShowModal(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        API_ENDPOINTS.FORGOT_PASSWORD,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || "Password reset successfully! Please login.");
        setErrorMessage("");
        setShowModal(true);

        setTimeout(() => {
          navigate("/"); // redirect to login
        }, 2000);
      } else {
        setErrorMessage(data.error || "Failed to reset password.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Try again later.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e6e64", // ✅ same green background
      }}
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img
              src={logo}
              alt="Nim Technologies Logo"
              style={{ height: "50px", marginRight: "10px" }}
            />
          </a>
        </div>
      </nav>

      {/* Reset Password Form */}
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 p-3">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div
              className="card p-4 shadow-lg"
              style={{
                borderRadius: "15px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <h4
                className="text-center mb-4 fw-semibold"
                style={{ color: "#6610f2" }}
              >
                Reset Password
              </h4>
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">Employee ID</label>
                  <input
                    type="text"
                    name="employee_id"
                    className="form-control rounded-3"
                    placeholder="Enter your Employee ID"
                    value={formData.employee_id}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    name="current_password"
                    className="form-control rounded-3"
                    placeholder="Enter current password"
                    value={formData.current_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    className="form-control rounded-3"
                    placeholder="Enter new password"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    className="form-control rounded-3"
                    placeholder="Confirm new password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100"
                  style={{
                    background: "#6610f2",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: "500",
                  }}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog" style={{ marginTop: "80px" }}>
            <div className="modal-content rounded-4 shadow-lg">
              <div
                className="modal-header"
                style={{ backgroundColor: "#6610f2", color: "#fff" }}
              >
                <h5 className="modal-title">
                  {successMessage ? "Success" : "Error"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p style={{ fontSize: "16px", color: "#333" }}>
                  {successMessage || errorMessage}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#6610f2",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: "500",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
