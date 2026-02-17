import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./Images/image.png";

export default function LeaveApproval() {
    const navigate = useNavigate();
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const token = localStorage.getItem("token");


    const fetchPendingLeaves = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/leave/pending/", {
                headers: { Authorization: `Token ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setPendingLeaves(data);
            } else if (res.status === 403) {
                alert("Admin access required");
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Error fetching pending leaves:", err);
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchPendingLeaves();
    }, [fetchPendingLeaves]);

    const handleApprove = async (leaveId) => {
        if (!window.confirm("Are you sure you want to approve this leave request?")) return;

        setProcessingId(leaveId);
        try {
            const res = await fetch(`http://localhost:8000/api/leave/${leaveId}/approve/`, {
                method: "POST",
                headers: { Authorization: `Token ${token}` },
            });

            if (res.ok) {
                alert("Leave request approved successfully!");
                fetchPendingLeaves();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to approve leave");
            }
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = (leave) => {
        setSelectedLeave(leave);
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason");
            return;
        }

        setProcessingId(selectedLeave.id);
        try {
            const res = await fetch(`http://localhost:8000/api/leave/${selectedLeave.id}/reject/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rejection_reason: rejectionReason }),
            });

            if (res.ok) {
                alert("Leave request rejected");
                setShowRejectModal(false);
                setRejectionReason("");
                setSelectedLeave(null);
                fetchPendingLeaves();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to reject leave");
            }
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setProcessingId(null);
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
                    <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">⏳ Pending Leave Approvals</h5>
                        <span className="badge bg-dark">{pendingLeaves.length} Pending</span>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : pendingLeaves.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <h5>✅ No pending leave requests</h5>
                                <p>All leave requests have been processed</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Leave Type</th>
                                            <th>Duration</th>
                                            <th>Days</th>
                                            <th>Reason</th>
                                            <th>Submitted</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingLeaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td>
                                                    <div>
                                                        <strong>{leave.employee_name}</strong>
                                                        <br />
                                                        <small className="text-muted">{leave.employee_id}</small>
                                                    </div>
                                                </td>
                                                <td className="fw-bold">{leave.leave_type_name}</td>
                                                <td>
                                                    <small>
                                                        {new Date(leave.start_date).toLocaleDateString()}
                                                        <br />
                                                        to {new Date(leave.end_date).toLocaleDateString()}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">{leave.total_days} days</span>
                                                </td>
                                                <td>
                                                    <small style={{ maxWidth: "250px", display: "block" }}>
                                                        {leave.reason.length > 80 ? leave.reason.substring(0, 80) + "..." : leave.reason}
                                                    </small>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(leave.created_at).toLocaleDateString()}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="btn-group btn-group-sm">
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => handleApprove(leave.id)}
                                                            disabled={processingId === leave.id}
                                                        >
                                                            {processingId === leave.id ? "..." : "✓ Approve"}
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => openRejectModal(leave)}
                                                            disabled={processingId === leave.id}
                                                        >
                                                            ✗ Reject
                                                        </button>
                                                    </div>
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

            {/* Reject Modal */}
            {showRejectModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
                >
                    <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px", width: "90%" }}>
                        <h5 className="mb-3">Reject Leave Request</h5>
                        <p className="text-muted">
                            Employee: <strong>{selectedLeave?.employee_name}</strong>
                            <br />
                            Leave: {selectedLeave?.leave_type_name} ({selectedLeave?.total_days} days)
                        </p>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Rejection Reason *</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a reason for rejection..."
                            ></textarea>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-danger" onClick={handleReject} disabled={processingId}>
                                {processingId ? "Processing..." : "Confirm Rejection"}
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason("");
                                    setSelectedLeave(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
