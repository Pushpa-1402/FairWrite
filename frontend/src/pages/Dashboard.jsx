import {
  FaChartBar,
  FaFileAlt,
  FaShieldAlt,
  FaUserCircle,
  FaHistory
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [history, setHistory] = useState([]);
  const [totalAnalyses, setTotalAnalyses] = useState(0);
  const [totalBiasDetected, setTotalBiasDetected] = useState(0);

  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {

      window.location.href = "/login";
      return;

    }

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user) {

      fetchDashboard(user.id);

    }

  }, []);

  const fetchDashboard = async (userId) => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/dashboard-stats/${userId}`
      );

      setTotalAnalyses(
        response.data.total_analyses
      );

      setTotalBiasDetected(
        response.data.total_bias_detected
      );

      setHistory(
        response.data.recent_activity
      );

    } catch (error) {

      console.log(error);

    }

  };

  const inclusiveRewrites =
    totalBiasDetected;

  const aiAccuracy =
    totalAnalyses > 0 ? "95%" : "0%";

  return (

    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* Sidebar */}

      <div className="w-72 bg-white/5 border-r border-gray-800 backdrop-blur-xl p-8">

        <div className="flex items-center gap-3 mb-16">

          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-2xl">

            <FaShieldAlt className="text-black text-xl" />

          </div>

          <h1 className="text-2xl font-bold">

            Equity
            <span className="text-cyan-400">
              AI
            </span>

          </h1>

        </div>

        <div className="space-y-6">

          <Link
            to="/dashboard"
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-500"
          >
            <FaChartBar />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/analysis"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition"
          >
            <FaFileAlt />
            <span>Analysis</span>
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition"
          >
            <FaHistory />
            <span>History</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition"
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-10 overflow-y-auto">

        <div className="flex justify-between items-center mb-12">

          <div>

            <h1 className="text-5xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-400 mt-3">
              Welcome back to EquityAI analytics
            </p>

          </div>

          <div className="flex gap-4">

            <Link
              to="/analysis"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold"
            >
              Analyze Text
            </Link>

            <button
              onClick={() => {

                localStorage.removeItem(
                  "isLoggedIn"
                );

                localStorage.removeItem(
                  "user"
                );

                window.location.href =
                  "/login";

              }}
              className="px-6 py-3 rounded-2xl border border-red-500 text-red-400 hover:bg-red-500/10 transition"
            >
              Logout
            </button>

          </div>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-8 mb-12">

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400">
              Total Analyses
            </h2>

            <h1 className="text-5xl font-bold mt-4 text-cyan-400">
              {totalAnalyses}
            </h1>

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400">
              Bias Detected
            </h2>

            <h1 className="text-5xl font-bold mt-4 text-purple-400">
              {totalBiasDetected}
            </h1>

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400">
              Inclusive Rewrites
            </h2>

            <h1 className="text-5xl font-bold mt-4 text-cyan-400">
              {inclusiveRewrites}
            </h1>

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400">
              AI Accuracy
            </h2>

            <h1 className="text-5xl font-bold mt-4 text-purple-400">
              {aiAccuracy}
            </h1>

          </div>

        </div>

        {/* Recent Activity */}

        <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-6">

            {history.length > 0 ? (

              history.map((item,index) => (

                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-black/20 border border-gray-800"
                >

            
                  <h3 className="font-semibold">
                    Analysis #{item.display_number}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Detected: {item.detected_bias}
                  </p>

                  <p className="text-gray-400 mt-2">
                    Severity: {item.severity}
                  </p>

                </div>

              ))

            ) : (

              <div className="p-5 rounded-2xl bg-black/20 border border-gray-800">

                <h3 className="font-semibold">
                  No Activity Yet
                </h3>

                <p className="text-gray-400 mt-2">
                  Start analyzing text to see activity.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;