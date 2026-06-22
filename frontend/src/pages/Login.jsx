import {
  FaShieldAlt,
  FaEnvelope,
  FaLock
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/login",
      {
        email,
        password
      }
    );

    if (response.data.message === "Login successful") {
      toast.success("Login successful");


      localStorage.setItem("isLoggedIn", "true");

localStorage.setItem(
  "user",
  JSON.stringify({
    id: response.data.user_id,
    username: response.data.username,
    email: response.data.email
  })
);

    window.location.href = "/dashboard";

    } else {

      toast.error("Invalid email or password");

    }

  } catch (error) {

    toast.error("Something went wrong");

  }

};
  

  return (
    <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center px-6">

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[150px] rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 border border-gray-800 backdrop-blur-xl rounded-3xl p-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">

          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-3xl mb-4">
            <FaShieldAlt className="text-black text-3xl" />
          </div>

          <h1 className="text-4xl font-bold">
            Equity<span className="text-cyan-400">AI</span>
          </h1>

          <p className="text-gray-400 mt-3 text-center">
            Sign in to access AI-powered bias detection analytics
          </p>

        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Email */}
          <div>

            <label className="text-gray-300 mb-2 block">
              Email Address
            </label>

            <div className="flex items-center gap-3 bg-black/20 border border-gray-800 rounded-2xl px-4 py-4">

              <FaEnvelope className="text-cyan-400" />

             <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="bg-transparent outline-none w-full text-white"
/>
        
            </div>

          </div>

          {/* Password */}
          <div>

            <label className="text-gray-300 mb-2 block">
              Password
            </label>

            <div className="flex items-center gap-3 bg-black/20 border border-gray-800 rounded-2xl px-4 py-4">

              <FaLock className="text-purple-400" />

              <input
  type="password"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="bg-transparent outline-none w-full text-white"
/>

            </div>

          </div>

          {/* Login Button */}
         <button
  onClick={handleLogin}
  className="block text-center w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold text-lg hover:scale-[1.02] transition"
>
  Sign In
</button>

<p className="text-center text-gray-400 mt-6">

  Don’t have an account?

  <Link
    to="/signup"
    className="text-cyan-400 ml-2 hover:underline"
  >
    Sign Up
  </Link>

</p>

        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8">
          Powered by AI Technology • EquityAI
        </p>

      </div>

    </div>
  );
}

export default Login;