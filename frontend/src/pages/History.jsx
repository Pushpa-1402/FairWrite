import {
  FaChartBar,
  FaFileAlt,
  FaShieldAlt,
  FaUserCircle,
  FaHistory,
  FaTrash
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function History() {

  const [history, setHistory] = useState([]);

  const [selectedAnalysis, setSelectedAnalysis] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (user) {

      fetchHistory(user.id);

    }

  }, []);

  const fetchHistory = async (userId) => {

    try {

      const response = await axios.get(
        `http://127.0.0.1:8000/history/${userId}`
      );

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleDelete = async () => {

    try {

      await axios.delete(
        `http://127.0.0.1:8000/delete-analysis/${selectedAnalysis.id}`
      );

      setHistory(
        history.filter(
          (item) =>
            item.id !== selectedAnalysis.id
        )
      );

      setShowDeleteModal(false);

      toast.success(
        "Analysis deleted successfully"
      );

    } catch (error) {

      toast.error(
        "Failed to delete analysis"
      );

    }

  };

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
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5"
          >
            <FaChartBar />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/analysis"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5"
          >
            <FaFileAlt />
            <span>Analysis</span>
          </Link>

          <Link
            to="/history"
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-500"
          >
            <FaHistory />
            <span>History</span>
          </Link>

          <Link
            to="/profile"
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5"
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>

        </div>

      </div>

      {/* Content */}

      <div className="flex-1 p-10">

        <h1 className="text-5xl font-bold mb-10">
          Analysis History
        </h1>

        <div className="space-y-6">

          {history.length > 0 ? (

            history.map((item, index) => (

              <div
                key={item.id}
                className="bg-white/5 border border-gray-800 rounded-3xl p-8"
              >

                <div className="flex justify-between items-center mb-4">

                  <h2 className="text-xl font-bold">

                    Analysis #{history.length - index}

                  </h2>

                  <button
                    onClick={() => {

                      setSelectedAnalysis(item);

                      setShowDeleteModal(true);

                    }}
                    className="text-red-400 hover:text-red-300 transition"
                  >

                    <FaTrash size={18} />

                  </button>

                </div>

                <p className="mb-2">

                  <span className="text-cyan-400">
                    Bias:
                  </span>

                  {" "}

                  {item.detected_bias}

                </p>

                <p className="mb-2">

                  <span className="text-purple-400">
                    Severity:
                  </span>

                  {" "}

                  {item.severity}

                </p>

                <p className="mb-2">

                  <span className="text-green-400">
                    Rewrite:
                  </span>

                  {" "}

                  {item.rewritten_text}

                </p>

                <p className="text-gray-400 mt-4">

                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}

                </p>

              </div>

            ))

          ) : (

            <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

              No analysis history found.

            </div>

          )}

        </div>

      </div>

      {/* Delete Modal */}

      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="w-full max-w-md bg-[#0B1220] border border-gray-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-4">

              Delete Analysis

            </h2>

            <p className="text-gray-400 mb-8">

              Are you sure you want to delete this analysis?

              <br />

              This action cannot be undone.

            </p>

            <div className="flex justify-end gap-4">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="px-5 py-3 rounded-2xl border border-gray-700 hover:bg-white/5"
              >

                Cancel

              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600"
              >

                Delete

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default History;