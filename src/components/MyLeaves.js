import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/image.png";

export default function MyLeaves() {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMyLeaves();
    }, [fetchMyLeaves]);

    const fetchMyLeaves = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/leave/my-requests/", {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                // Only show Sick Leave and Casual Leave
                const filteredLeaves = data.filter(leave =>
                    ["Sick Leave", "Casual Leave"].includes(leave.leave_type_name)
                );
                setLeaves(filteredLeaves);
            }
        } catch (err) {
            console.error("Error fetching leaves:", err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const getStatusBadge = (status) => {
        const badges = {
            Pending: "bg-warning text-dark",
            Approved: "bg-success",
            Rejected: "bg-danger",
        };
        return badges[status] || "bg-secondary";
    };

    const filteredLeaves = leaves.filter((leave) => {
        if (filter === "all") return true;
        return leave.status.toLowerCase() === filter;
    });

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
                        <button className="btn btn-primary btn-sm" onClick={() => navigate("/leave-request")}>
                            Request Leave
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
                <div className="card shadow-sm">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">📋 My Leave Requests</h5>
                        <div className="btn-group btn-group-sm">
                            <button
                                className={`btn ${filter === "all" ? "btn-light" : "btn-outline-light"}`}
                                onClick={() => setFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`btn ${filter === "pending" ? "btn-light" : "btn-outline-light"}`}
                                onClick={() => setFilter("pending")}
                            >
                                Pending
                            </button>
                            <button
                                className={`btn ${filter === "approved" ? "btn-light" : "btn-outline-light"}`}
                                onClick={() => setFilter("approved")}
                            >
                                Approved
                            </button>
                            <button
                                className={`btn ${filter === "rejected" ? "btn-light" : "btn-outline-light"}`}
                                onClick={() => setFilter("rejected")}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : filteredLeaves.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <h5>No leave requests found</h5>
                                <p>Click "Request Leave" to submit a new request</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Leave Type</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Days</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredLeaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td className="fw-bold">{leave.leave_type_name}</td>
                                                <td>{new Date(leave.start_date).toLocaleDateString()}</td>
                                                <td>{new Date(leave.end_date).toLocaleDateString()}</td>
                                                <td>
                                                    <span className="badge bg-info">{leave.total_days} days</span>
                                                </td>
                                                <td>
                                                    <small className="text-muted" style={{ maxWidth: "200px", display: "block" }}>
                                                        {leave.reason.length > 50 ? leave.reason.substring(0, 50) + "..." : leave.reason}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(leave.status)}`}>{leave.status}</span>
                                                    {leave.status === "Approved" && leave.approved_by_name && (
                                                        <small className="d-block text-muted mt-1">by {leave.approved_by_name}</small>
                                                    )}
                                                    {leave.status === "Rejected" && leave.rejection_reason && (
                                                        <small className="d-block text-danger mt-1">{leave.rejection_reason}</small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(leave.created_at).toLocaleDateString()}
                                                    </small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
