"use client";

import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce
    .number()
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  diet: z.string().min(3, "Diet must be at least 3 characters"),
  activityLevel: z
    .string()
    .min(3, "Activity level must be at least 3 characters"),
  healthGoals: z.string().min(5, "Health goals must be at least 5 characters"),
});

const steps = ["Basic Info", "Lifestyle", "Health Goals"];

const PersonalizedBlueprint = () => {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const handleNextStep = async () => {
    const fieldsToValidate =
      step === 0
        ? ["name", "age"]
        : step === 1
        ? ["diet", "activityLevel"]
        : ["healthGoals"];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBackStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (formData) => {
    console.log("User Data:", formData);
    setStatus("");
    setLoading(true);

    try {
      const response = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: formData }),
        credentials: "include",
      });

      const responseData = await response.json();
      setStatus(responseData.message);
    } catch (error) {
      console.error("Personalization error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#262323] h-[100vh] py-20">
      <div className="max-w-lg mx-auto p-6 bg-[#262323] border border-light-pink-100 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Customize your AI Experience
        </h2>
        <p className="text-sm text-center text-gray-400 mb-4">
          Answer a few quick questions to get the most personalized insights and
          recommendations.
        </p>
        {/* Progress Bar */}
        <div className="w-full bg-[#262323] border border-light-pink-100 rounded-full h-3 mb-6">
          <div
            className="bg-light-pink-100 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 0 && (
            <>
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-transparent border text-white p-2 border-light-pink-100  rounded "
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">Age (18+) </label>
                <input
                  type="number"
                  {...register("age")}
                  className="w-full bg-transparent border text-white p-2 border-light-pink-100  rounded "
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age.message}</p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Lifestyle */}
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1">Diet</label>
                <p className="pl-2 text-sm mb-2">
                  Knowing what you typically eat helps to identify potential
                  areas for improvement or if there are there any foods that
                  might be hindering your progress?
                </p>
                <input
                  type="text"
                  {...register("diet")}
                  className="w-full bg-transparent border text-white p-2 border-light-pink-100  rounded "
                />
                {errors.diet && (
                  <p className="text-red-500 text-sm">{errors.diet.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1">Activity Level</label>
                <p className="pl-2 text-sm mb-2">
                  Understanding how active you are helps me determine the right
                  exercise recommendations. Are you already very active, or are
                  you just starting out?
                </p>
                <input
                  type="text"
                  {...register("activityLevel")}
                  className="w-full bg-transparent border text-white p-2 border-light-pink-100  rounded "
                />
                {errors.activityLevel && (
                  <p className="text-red-500 text-sm">
                    {errors.activityLevel.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 3: Health Goals */}
          {step === 2 && (
            <div>
              <label className="block mb-1">Health Goals</label>
              <p className="pl-2 text-sm mb-2">
                Eg: Weight Management, Fitness & Physical Activity, Nutrition,
                Sleep, Stress Management & Mental Wellbeing, Longevity &
                Preventive Health
              </p>
              <textarea
                {...register("healthGoals")}
                className="w-full bg-transparent border text-white p-2 border-light-pink-100  rounded "
              />
              {errors.healthGoals && (
                <p className="text-red-500 text-sm">
                  {errors.healthGoals.message}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 0 && (
              <button
                type="button"
                onClick={handleBackStep}
                className="px-6 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition"
              >
                Previous
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-[#8F788D] rounded hover:bg-dark-pink-100 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-[#d37a90] rounded hover:bg-[#a56978] transition"
              >
                {loading ? "Generating..." : "Submit"}
              </button>
            )}
          </div>

          {status && (
            <StatusModal status={status} onClose={() => setStatus("")} />
          )}
        </form>
      </div>
      <div className="px-16 text-center pt-8 text-white">
        <Link href="/" className="hover:underline mr-4">
          Home
        </Link>
        <Link href="/chat" className="hover:underline">
          Chat
        </Link>
      </div>
    </div>
  );
};

export default PersonalizedBlueprint;

const StatusModal = ({ status, onClose }) => {
  const printRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("Personal Blueprint.pdf");
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
        <div className=" flex gap-4 justify-between my-2">
          <button
            onClick={handleDownloadPDF}
            className="bg-[#D180AC] py-2 px-4 rounded hover:bg-[#c97fa7] transition"
          >
            Export as PDF
          </button>
          <button
            onClick={onClose}
            className="bg-[#262323]  py-2 px-4 rounded hover:bg-[#8F788D] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
