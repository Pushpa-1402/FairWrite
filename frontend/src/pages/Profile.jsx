import {
  FaUserCircle,
  FaShieldAlt,
  FaChartBar,
  FaFileAlt,
  FaMoon,
  FaSignOutAlt,
  FaHistory
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {

  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {

      window.location.href = "/login";

      return;

    }

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setUser(storedUser);

  }, []);

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";

  };

  const handleThemeChange = () => {

    const newTheme =
      theme === "dark"
        ? "light"
        : "dark";

    setTheme(newTheme);

    localStorage.setItem(
      "theme",
      newTheme
    );

  };

  const handleChangePassword = async () => {

  if (
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmPassword.trim()
  ) {

    alert("Please fill all fields");
    return;

  }

  if (newPassword !== confirmPassword) {

    alert("Passwords do not match");
    return;

  }

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/change-password",
      {
        user_id: user.id,
        current_password: currentPassword,
        new_password: newPassword
      }
    );

    alert(response.data.message);

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (error) {

    if (error.response?.data?.detail) {

      alert(error.response.data.detail);

    } else {

      alert("Something went wrong");

    }

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
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition"
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
            className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-500"
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>

        </div>

      </div>

      {/* Main Content */}

      <div className="flex-1 p-10 overflow-y-auto">

        <div className="bg-white/5 border border-gray-800 rounded-3xl p-10 backdrop-blur-lg">

          {/* Header */}

          <div className="flex items-center gap-6 mb-12">

            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-5xl">

              <FaUserCircle />

            </div>

            <div>

              <h1 className="text-4xl font-bold">

                {user?.username || "User"}

              </h1>

              <p className="text-gray-400 mt-2">

                {user?.email || ""}

              </p>

            </div>

          </div>

          {/* Account Settings */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-6">
              Account Settings
            </h2>

            <div className="space-y-4">

              {/* <button
                onClick={handleThemeChange}
                className="w-full p-5 rounded-2xl bg-black/20 border border-gray-800 flex items-center justify-between hover:bg-white/5 transition"
              >

                <div className="flex items-center gap-4">

                  <FaMoon className="text-cyan-400" />

                  <span>
                    Change Theme
                  </span>

                </div>

                <span className="text-cyan-400">

                  {theme === "dark"
                    ? "Dark"
                    : "Light"}

                </span>

              </button> */}

            </div>

          </div>

          {/* Change Password */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-6">
              Change Password
            </h2>

            <div className="space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                className="w-full bg-black/20 border border-gray-700 rounded-2xl p-4 outline-none"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                className="w-full bg-black/20 border border-gray-700 rounded-2xl p-4 outline-none"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="w-full bg-black/20 border border-gray-700 rounded-2xl p-4 outline-none"
              />

              <button
                onClick={
                  handleChangePassword
                }
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold"
              >
                Update Password
              </button>

            </div>

          </div>

          {/* Security */}

          <div>

            <h2 className="text-2xl font-bold mb-6">
              Security
            </h2>

            <button
              onClick={handleLogout}
              className="w-full p-5 rounded-2xl border border-red-500 text-red-400 hover:bg-red-500/10 transition flex items-center justify-center gap-3"
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Profile;