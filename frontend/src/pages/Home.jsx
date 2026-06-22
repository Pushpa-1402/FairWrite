import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

function Home() {

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/20 blur-[150px] rounded-full"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6 border-b border-gray-800 bg-black/20 backdrop-blur-xl">

        <div className="flex items-center gap-3">

          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-3 rounded-2xl">
            <FaShieldAlt className="text-black text-xl" />
          </div>

          <h1 className="text-3xl font-bold">
            Fair<span className="text-cyan-400">Write</span>
          </h1>

        </div>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold hover:scale-[1.02] transition"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">

        <div className="mb-8 px-6 py-3 rounded-full border border-gray-700 bg-white/5 backdrop-blur-xl">
          ✨ AI Powered Inclusive Writing Platform
        </div>

        <h1 className="text-7xl font-extrabold leading-tight max-w-6xl">

          Detect bias.
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {" "}Write inclusively.
          </span>

        </h1>

        <p className="text-gray-400 text-2xl max-w-4xl mt-10 leading-relaxed">

          Analyze job posts, articles, and professional documents
          with AI-powered bias detection and inclusive rewriting.

        </p>

        <div className="flex gap-6 mt-14">

          <Link
            to="/signup"
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black text-xl font-bold hover:scale-[1.03] transition"
          >
            Get Started
          </Link>

          {/* <Link
            to="/login"
            className="px-10 py-5 rounded-2xl border border-gray-700 hover:bg-white/5 transition text-xl"
          >
            Login
          </Link> */}

        </div>

      </div>

    </div>
  );
}

export default Home;