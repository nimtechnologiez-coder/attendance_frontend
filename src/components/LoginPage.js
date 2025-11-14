import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // ✅ Added Link
import logo from "../components/Images/image.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ employee_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: formData.employee_id,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setErrorMessage(data.error || "Invalid Employee ID or Password");
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
        backgroundColor: "#1e6e64",
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

      {/* Login Form */}
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
                Employee Login
              </h4>
              <form onSubmit={handleLogin}>
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

                <div className="mb-2">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control rounded-3"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* ✅ Forgot Password Link */}
                <div className="d-flex justify-content-end mb-3">
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: "14px",
                      color: "#6610f2",
                      textDecoration: "none",
                      fontWeight: "500",
                    }}
                  >
                    Forgot Password?
                  </Link>
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
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="modal-dialog"
            style={{
              marginTop: "80px",
            }}
          >
            <div className="modal-content rounded-4 shadow-lg">
              <div
                className="modal-header"
                style={{ backgroundColor: "#6610f2", color: "#fff" }}
              >
                <h5 className="modal-title">Login Error</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p style={{ fontSize: "16px", color: "#333" }}>{errorMessage}</p>
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

export default LoginPage;
