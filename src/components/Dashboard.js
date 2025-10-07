import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Dashboard.css";
// import Leave_Application from "./LeaveApplication"


function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="button-grid">
         <button
          className="dash-btn btn1"
          onClick={() => navigate("/leave-application")}
        >
          Leave Application
        </button>
        <button className="dash-btn btn2">TADA</button>
        <button className="dash-btn btn3">LTC</button>
        <button className="dash-btn btn4">Other</button>
      </div>
    </div>
  );
}

export default Dashboard;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./../styles/Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();

//   return (
//     <div className="dashboard">
//       <button
//         className="dash-btn btn1"
//         onClick={() => navigate("/leave-application")}
//       >
//         Leave Application
//       </button>
//       <button className="dash-btn btn2">TADA</button>
//       <button className="dash-btn btn3">LTC</button>
//       <button className="dash-btn btn4">Other</button>
//     </div>
//   );
// }

// export default Dashboard;

// function Dashboard() {
//   const navigate = useNavigate();

//   return (
    
//     <div className="dashboard">
//       <div className="left">
//         <button
//           className="dash-btn btn1"
//           onClick={() => navigate("/leave-application")}
//         >
//           Leave Application
//         </button>
//         <button className="dash-btn btn2">TADA</button>
//         </div>
//         <div className="right">
//         <button className="dash-btn btn3">LTC</button>
//         <button className="dash-btn btn4">Other</button>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;