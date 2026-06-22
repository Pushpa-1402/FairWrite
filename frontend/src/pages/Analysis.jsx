import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


function Analysis() {

  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfMessageType, setPdfMessageType] = useState("");

  

  const handlePdfUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      
      setText(response.data.text);

      setPdfMessage("PDF uploaded successfully");
      setPdfMessageType("success");

    } catch (error) {

      console.log(error);

      setPdfMessage("PDF upload failed");
      setPdfMessageType("error");

    }

    setUploading(false);

  };

  const analyzeText = async () => {

    if (!text.trim()) {

      alert("Please enter some text");

      return;

    }

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        {
          text: text
        }
      );

      setResult(response.data);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await axios.post(
        "http://127.0.0.1:8000/save-analysis",
        {
          user_id: user.id,
          original_text: text,
          detected_bias:
            response.data.detected_bias.join(", "),
          severity:
            response.data.severity,
          rewritten_text:
            response.data.rewritten_text
        }
      );

    } catch (error) {

      console.log(error);

      alert("Analysis failed");

    }

    setLoading(false);

  };

  const exportPdf = async () => {

  if (!result) return;

  try {

    const response = await axios.post(
      "http://127.0.0.1:8000/export-pdf",
      {
        detected_bias: result.detected_bias.join(", "),
        severity: result.severity,
        rewritten_text: result.rewritten_text
      },
      {
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;

    link.download = "FairWrite_Report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (error) {

    console.log(error);

    alert("PDF export failed");

  }

};

  return (

    <div className="min-h-screen bg-[#050816] text-white p-10">
  

      <div className="mb-12">

       <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mb-6 px-5 py-3 rounded-2xl bg-white/5 border border-gray-700 hover:border-cyan-400 transition">
             ← Back to Dashboard
        </Link> 

        <h1 className="text-5xl font-bold">
          Bias Analysis
        </h1>

        <p className="text-gray-400 mt-4">
          Analyze text, job descriptions, or PDF documents using AI.
        </p>

      </div>

      <div className="bg-white/5 border border-gray-800 rounded-3xl p-8 backdrop-blur-lg">

        <textarea
          rows="10"
          placeholder="Paste your text here or upload a PDF..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-black/20 border border-gray-700 rounded-2xl p-6 text-white outline-none focus:border-cyan-400 resize-none"
        />

        <div className="mt-6 flex gap-4">

          <label
            htmlFor="pdf-upload"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold cursor-pointer hover:scale-105 transition"
          >
            {uploading
              ? "Uploading..."
              : "Upload PDF"}
          </label>

          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />

          <button
            onClick={analyzeText}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-black font-bold hover:scale-105 transition"
          >
            {loading
              ? "Analyzing..."
              : "Analyze Text"}
          </button>

        </div>

        {pdfMessage && (

  <p
    className={`mt-4 font-medium ${
      pdfMessageType === "success"
        ? "text-cyan-400"
        : "text-red-400"
    }`}
  >
    {pdfMessage}
  </p>

)}
{result && (

  <div className="mt-4">

    <button
      onClick={exportPdf}
      className="px-8 py-4 rounded-2xl border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
    >
      Export PDF
    </button>

  </div>

)}

      </div>

      {result && (

        <div className="mt-12 grid lg:grid-cols-4 gap-8">

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400 mb-4">
              Detected Bias
            </h2>

            <h1 className="text-2xl font-bold text-cyan-400">

              {result.detected_bias?.length > 0
                ? result.detected_bias.join(", ")
                : "No Bias"}

            </h1>

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400 mb-4">
              Severity
            </h2>

            <h1 className="text-3xl font-bold text-purple-400">

              {result.severity}

            </h1>

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400 mb-4">
              AI Suggestions
            </h2>

            {result.suggestions?.length > 0 ? (

              result.suggestions.map(
                (item, index) => (

                  <div
                    key={index}
                    className="mb-3"
                  >

                    <span className="text-cyan-400">
                      {item.biased_word}
                    </span>

                    {" → "}

                    {item.inclusive_alternative}

                  </div>

                )
              )

            ) : (

              <p>No suggestions</p>

            )}

          </div>

          <div className="bg-white/5 border border-gray-800 rounded-3xl p-8">

            <h2 className="text-gray-400 mb-4">
              Inclusive Rewrite
            </h2>

            <p className="text-green-400 whitespace-pre-wrap">

              {result.rewritten_text}

            </p>

          </div>

        </div>

      )}

    </div>

  );

}

export default Analysis;