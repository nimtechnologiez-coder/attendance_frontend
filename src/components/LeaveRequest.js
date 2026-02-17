import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/image.png";

export default function LeaveRequest() {
    const navigate = useNavigate();
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [formData, setFormData] = useState({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchLeaveTypes();
        fetchLeaveBalance();
    }, [fetchLeaveTypes, fetchLeaveBalance]);

    const fetchLeaveTypes = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/leave/types/", {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                // Only show Sick Leave and Casual Leave
                const filteredTypes = data.filter(type =>
                    ["Sick Leave", "Casual Leave"].includes(type.name)
                );
                setLeaveTypes(filteredTypes);
            }
        } catch (err) {
            console.error("Error fetching leave types:", err);
        }
    }, [token]);

    const fetchLeaveBalance = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/leave/balance/", {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                // Only show balance for Sick Leave and Casual Leave
                const filteredBalance = data.filter(balance =>
                    ["Sick Leave", "Casual Leave"].includes(balance.leave_type)
                );
                setLeaveBalance(filteredBalance);
            }
        } catch (err) {
            console.error("Error fetching leave balance:", err);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("http://localhost:8000/api/leave/request/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Leave request submitted successfully!" });
                setFormData({ leave_type: "", start_date: "", end_date: "", reason: "" });
                fetchLeaveBalance(); // Refresh balance
                setTimeout(() => navigate("/my-leaves"), 2000);
            } else {
                setMessage({ type: "error", text: data.error || "Failed to submit leave request" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#1e6e64" }}>
            {/* Navbar */}
            <nav className="navbar navbar-light bg-white shadow-sm">
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand d-flex align-items-center" href="/dashboard">
                        <img src={logo} alt="Nim Technologies Logo" style={{ height: "50px", marginRight: "10px" }} />
                    </a>
                    <div className="d-flex gap-3">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </button>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/my-leaves")}>
                            My Leaves
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row">
                    {/* Leave Balance Cards */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">📊 Leave Balance</h5>
                            </div>
                            <div className="card-body">
                                {leaveBalance.length === 0 ? (
                                    <p className="text-muted">Loading balance...</p>
                                ) : (
                                    leaveBalance.map((balance, index) => (
                                        <div key={index} className="mb-3 pb-3 border-bottom">
                                            <h6 className="fw-bold">{balance.leave_type}</h6>
                                            <div className="d-flex justify-content-between small">
                                                <span>Total: {balance.total_allowed}</span>
                                                <span className="text-success">Available: {balance.available}</span>
                                            </div>
                                            <div className="d-flex justify-content-between small text-muted">
                                                <span>Used: {balance.used}</span>
                                                <span>Pending: {balance.pending}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Leave Request Form */}
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">📝 Request Leave</h5>
                            </div>
                            <div className="card-body">
                                {message.text && (
                                    <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Leave Type *</label>
                                        <select
                                            className="form-select"
                                            value={formData.leave_type}
                                            onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Leave Type</option>
                                            {leaveTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Start Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.start_date}
                                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">End Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.end_date}
                                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                min={formData.start_date || new Date().toISOString().split("T")[0]}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Reason *</label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            placeholder="Please provide a reason for your leave request..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-success" disabled={loading}>
                                            {loading ? "Submitting..." : "Submit Request"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => navigate("/dashboard")}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
