"use client";

import ReactMarkdown from "react-markdown";
import { useRef } from "react";

const header = `
  <div class="header">
     My Personalized Blueprint
  </div>
  <div class="content">
`;

const cssStyles = `
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 10px 5px;
    background: white;
    border-bottom: 1px solid #eee;
  }

 
  .content {
    padding-top: 100px;
  }
`;

const StatusModal = ({ status, onClose }) => {
  const printRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!status) return;

    try {
      const fullMarkdown = header + status + "</div>";
      const randomId = (Math.random() * 10).toFixed(2);
      const filename = `blueprint ${randomId}.pdf"`;

      const formData = new FormData();
      formData.append("markdown", fullMarkdown);
      formData.append("css", cssStyles);

      const response = await fetch("https://md-to-pdf.fly.dev", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error converting markdown to PDF:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        status ? "visible" : "invisible"
      }`}
    >
      <div
        ref={printRef}
        className="bg-[#4b4545] text-white p-6 rounded-lg shadow-lg max-w-xl max-h-[80vh] overflow-y-scroll w-full"
      >
        <h2 className="text-lg font-bold mb-2">
          Here is Your Personalized Blueprint Result
        </h2>
        <ReactMarkdown>{status}</ReactMarkdown>
        <div className="flex gap-4 justify-between my-2">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#D180AC] py-2 px-4 rounded hover:bg-[#c97fa7] transition"
          >
            Export as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-[#262323] py-2 px-4 rounded hover:bg-[#8F788D] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
