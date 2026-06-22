import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {

    // Empty fields check
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword
    ) {

      toast.error("Please fill all fields");

      return;
    }

    // Password match check
    if (password !== confirmPassword) {

      toast.error("Passwords do not match");

      return;
    }

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/register",
        {
          username,
          email,
          password
        }
      );

      if (
        response.data.message ===
        "User registered successfully"
      ) {

        toast.success("Account created successfully");

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } else {

        toast.error(response.data.message);

      }

    } catch (error) {

      toast.error("Signup failed");

    }

  };

  return (

    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-6">

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 border border-gray-800 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-white text-center">

          Create Account

        </h1>

        <p className="text-gray-400 text-center mt-3">

          Join EquityAI today

        </p>

        {/* Username */}
        <div className="mt-8">

          <label className="text-gray-300 text-sm">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mt-2 px-5 py-4 rounded-2xl bg-black/30 border border-gray-700 text-white outline-none focus:border-cyan-400"
          />

        </div>

        {/* Email */}
        <div className="mt-5">

          <label className="text-gray-300 text-sm">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 px-5 py-4 rounded-2xl bg-black/30 border border-gray-700 text-white outline-none focus:border-cyan-400"
          />

        </div>

        {/* Password */}
        <div className="mt-5">

          <label className="text-gray-300 text-sm">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 px-5 py-4 rounded-2xl bg-black/30 border border-gray-700 text-white outline-none focus:border-cyan-400"
          />

        </div>

        {/* Confirm Password */}
        <div className="mt-5">

          <label className="text-gray-300 text-sm">
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full mt-2 px-5 py-4 rounded-2xl bg-black/30 border border-gray-700 text-white outline-none focus:border-cyan-400"
          />

        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full mt-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold text-lg hover:scale-[1.02] transition"
        >

          Create Account

        </button>

        {/* Login Redirect */}
        <p className="text-center text-gray-400 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-cyan-400 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Signup;