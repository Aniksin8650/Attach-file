import React, { useState, useRef } from "react";
import "./../styles/LeaveApplication.css";

function LeaveApplication() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef(null);

  // Fetch employee data by ID
  const fetchEmployeeDetails = async () => {
    const id = employeeId.trim();
    if (!id) {
      setEmployeeData({});
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/api/employees/${id}`);
      if (res.ok) {
        const data = await res.json();
        setEmployeeData(data); // ✅ Only set employee data
      } else {
        setEmployeeData({});
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setEmployeeData({});
    }
  };


  // File change with type validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Invalid file type! Only PDF, JPG, PNG allowed.");
      e.target.value = "";
      return;
    }
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Tomorrow's date for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };
  const minDate = getTomorrowDate();

  // Input class for validation highlighting
  const getInputClass = (field) =>
    submitAttempted && errors[field] ? "input-error" : "";

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const newErrors = {};

    if (!employeeId.trim()) newErrors.employeeId = true;
    if (!employeeData || !employeeData.empId) newErrors.employeeId = true;
    if (!reason.trim()) newErrors.reason = true;
    if (!startDate) newErrors.startDate = true;
    if (!endDate) newErrors.endDate = true;
    if (startDate && endDate && new Date(endDate) < new Date(startDate))
      newErrors.endDate = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert("Please fix the highlighted fields.");
      return;
    }

    const formData = new FormData();
    formData.append("empId", employeeData.empId);
    formData.append("name", employeeData.name);
    formData.append("department", employeeData.department);
    formData.append("designation", employeeData.designation);
    formData.append("reason", reason);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("contact", contact);
    if (file) formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/api/leave/apply", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccessMessage("Leave application submitted successfully!");
        setTimeout(() => setSuccessMessage(""), 5000);

        // Reset form
        setEmployeeId("");
        setEmployeeData({});
        setReason("");
        setContact("");
        setStartDate("");
        setEndDate("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setSubmitAttempted(false);
        setErrors({});
      } else {
        alert("Failed to submit leave application.");
      }
    } catch (error) {
      console.error("Error submitting leave:", error);
      alert("Error submitting leave application.");
    }
  };

  return (
    <div className="leave-container">
      <h2>Leave Application</h2>

      {/* Success message */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Employee ID */}
        <div className="form-row">
          <label>Employee ID:</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => {
              if (e.target.value.length <= 6) setEmployeeId(e.target.value);
            }}
            onBlur={fetchEmployeeDetails}
            onKeyDown={(e) => { if (e.key === "Enter") fetchEmployeeDetails(); }}
            placeholder="Enter Employee ID"
            className={getInputClass("employeeId")}
          />
        </div>

        {/* Employee details (read-only) */}
        <div className="form-row">
          <label>Name:</label>
          <input type="text" value={employeeData.name || ""} readOnly />
        </div>
        <div className="form-row">
          <label>Department:</label>
          <input type="text" value={employeeData.department || ""} readOnly />
        </div>
        <div className="form-row">
          <label>Designation:</label>
          <input type="text" value={employeeData.designation || ""} readOnly />
        </div>

        {/* Reason */}
        <div className="form-row">
          <label>Reason for Leave:</label>
          <input
            type="text"
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={getInputClass("reason")}
          />
        </div>

        {/* Start and End Dates */}
        <div className="form-row">
          <label>Leave Start Date:</label>
          <input
            type="date"
            value={startDate}
            min={minDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={getInputClass("startDate")}
          />
        </div>
        <div className="form-row">
          <label>Leave End Date:</label>
          <input
            type="date"
            value={endDate}
            min={startDate || minDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={getInputClass("endDate")}
          />
        </div>

<div className="form-row">
  <label>Contact During Leave:</label>
  <div className="phone-input">
    <span>+91</span>
    <input
      type="text"
      placeholder="Enter 10-digit number"
      value={contact} // keeps value from database
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, ""); // remove non-numeric
        if (val.length <= 10) setContact(data.phone || ""); // allow max 10 digits
      }}
    />
  </div>
</div>


        {/* File */}
        <div className="form-row">
          <label>Attach File:</label>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          {file && (
            <div className="file-preview">
              <p>{file.name}</p>
              <button type="button" onClick={handleRemoveFile}>Delete</button>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Submit Application</button>
      </form>
    </div>
  );
}

export default LeaveApplication;
