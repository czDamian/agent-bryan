"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import StatusModal from "./StatusModal";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce
    .number()
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),
  diet: z
    .string()
    .refine(
      (val) => ["vegan", "keto", "omnivore", "vegetarian"].includes(val),
      {
        message: "No diet selected",
      }
    ),
  activityLevel: z
    .string()
    .min(3, "Activity level must be at least 3 characters"),
  healthGoals: z.string().min(5, "Health goals must be at least 5 characters"),
});

// Form step definitions
const FORM_STEPS = [
  {
    id: "basic-info",
    label: "Basic Info",
    fields: ["name", "age"],
    icon: "👤",
  },
  {
    id: "diet",
    label: "Diet",
    fields: ["diet"],
    icon: "🍽️",
  },
  {
    id: "activity",
    label: "Activity Level",
    fields: ["activityLevel"],
    icon: "🏃‍♂️",
  },
  {
    id: "goals",
    label: "Health Goals",
    fields: ["healthGoals"],
    icon: "🎯",
  },
];

// Diet options configuration
const DIET_OPTIONS = [
  { value: "", label: "Select Diet" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Low carbo diet" },
  { value: "omnivore", label: "Balanced" },
  { value: "vegetarian", label: "Vegetarian" },
];

// Diet descriptions component
const DietDescriptions = () => (
  <div className="flex flex-col gap-2 bg-[#36302F] p-3 rounded-md my-3 text-gray-300 text-sm">
    <p>
      <span className="font-semibold text-[#d37a90]">Vegan:</span> Plant based
      foods like fruits and vegetables. Excludes all animal products.
    </p>
    <p>
      <span className="font-semibold text-[#d37a90]">Low carbo diet:</span> High
      fat and low carb diet e.g., meat, fish, nuts.
    </p>
    <p>
      <span className="font-semibold text-[#d37a90]">Balanced:</span> Both plant
      and animal foods.
    </p>
    <p>
      <span className="font-semibold text-[#d37a90]">Vegetarian:</span> Avoids
      meat but may consume either eggs or dairy products.
    </p>
  </div>
);

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
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  // Form navigation handlers
  const handleNextStep = async () => {
    const fieldsToValidate = FORM_STEPS[step].fields;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const handleBackStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // Form submission handler
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

  // Progress percentage calculation
  const progressPercentage = ((step + 1) / FORM_STEPS.length) * 100;

  // Reusable form input component
  const FormInput = ({
    label,
    name,
    type = "text",
    placeholder = "",
    description,
  }) => (
    <div className="mb-4">
      <label className="block mb-2 font-medium text-[#d37a90]">{label}</label>
      {description && (
        <p className="pl-2 text-sm mb-3 bg-[#36302F] p-3 rounded-md text-gray-300">
          {description}
        </p>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full bg-[#36302F] border text-white p-3 border-light-pink-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d37a90] focus:border-transparent transition-all"
      />
      {errors[name] && (
        <p className="text-[#d37a90] text-sm mt-1 pl-2">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#262323] to-[#1d1a1a] min-h-screen px-4 py-12">
      <div className="max-w-xl mx-auto p-8 bg-[#2a2424] border border-[#8F788D] text-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-3 text-[#d37a90]">
            Customize Your Blueprint
          </h2>
          <p className="text-sm text-gray-400">
            Answer a few quick questions to get personalized insights and
            recommendations tailored just for you.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {FORM_STEPS.map((formStep, index) => (
              <div
                key={formStep.id}
                className={`flex flex-col items-center ${
                  index <= step ? "text-[#d37a90]" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 text-lg ${
                    index <= step
                      ? "bg-[#d37a90] text-white"
                      : "bg-[#36302F] text-gray-400 border border-gray-600"
                  }`}
                >
                  {formStep.icon}
                </div>
                <span className="text-xs hidden sm:block">
                  {formStep.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-[#36302F] rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-[#8F788D] to-[#d37a90] h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Step Title */}
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>{FORM_STEPS[step].icon}</span>
            <span>{FORM_STEPS[step].label}</span>
          </h3>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <>
              <FormInput
                label="Name (or nickname)"
                name="name"
                placeholder="Enter your name"
              />
              <FormInput
                label="Age (18+)"
                name="age"
                type="number"
                placeholder="Enter your age"
              />
            </>
          )}

          {/* Step 1: Diet */}
          {step === 1 && (
            <div>
              <label className="block mb-2 font-medium text-[#d37a90]">
                What kind of diet do you normally follow?
              </label>
              <p className="pl-2 text-sm mb-3 bg-[#36302F] p-3 rounded-md text-gray-300">
                Knowing what you typically eat helps to identify potential areas
                for improvement or foods that might be hindering your progress.
              </p>
              <DietDescriptions />
              <select
                {...register("diet")}
                className="w-full border p-3 border-light-pink-100 rounded-md appearance-none bg-[#36302F] text-white focus:outline-none focus:ring-2 focus:ring-[#d37a90] focus:border-transparent"
              >
                {DIET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.diet && (
                <p className="text-[#d37a90] text-sm mt-1 pl-2">
                  {errors.diet.message}
                </p>
              )}
            </div>
          )}

          {/* Step 2 - Physical Exercises */}
          {step === 2 && (
            <FormInput
              label="What Physical Exercises do you do?"
              name="activityLevel"
              placeholder="e.g., jogging, weight lifting, yoga"
              description="Are you already working out, or are you just starting out? Common exercises include jogging, weight lifting, push-ups, cycling, walking, etc."
            />
          )}

          {/* Step 3: Health Goals */}
          {step === 3 && (
            <div>
              <label className="block mb-2 font-medium text-[#d37a90]">
                What Health Goals do you want to achieve?
              </label>
              <p className="pl-2 text-sm mb-3 bg-[#36302F] p-3 rounded-md text-gray-300">
                Examples: Weight Management, Fitness & Physical Activity,
                Nutrition, Sleep, Stress Management & Mental Wellbeing,
                Longevity & Preventive Health
              </p>
              <textarea
                {...register("healthGoals")}
                placeholder="Describe your health goals here..."
                className="w-full bg-[#36302F] border text-white p-3 border-light-pink-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#d37a90] focus:border-transparent min-h-32"
              />
              {errors.healthGoals && (
                <p className="text-[#d37a90] text-sm mt-1 pl-2">
                  {errors.healthGoals.message}
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBackStep}
                className="px-6 py-3 text-white bg-[#36302F] rounded-md hover:bg-[#444040] transition-all flex items-center gap-2"
              >
                <span>←</span> Previous
              </button>
            ) : (
              <div></div> // Empty div to maintain flex layout
            )}

            {step < FORM_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-gradient-to-r from-[#8F788D] to-[#d37a90] rounded-md hover:opacity-90 transition-all flex items-center gap-2"
              >
                Next <span>→</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#d37a90] to-[#a56978] rounded-md hover:opacity-90 transition-all flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            )}
          </div>

          {status && (
            <StatusModal status={status} onClose={() => setStatus("")} />
          )}
        </form>
      </div>

      <div className="px-16 text-center pt-8 text-white">
        <Link
          href="/"
          className="px-4 py-2 bg-[#36302F] rounded-md hover:bg-[#444040] transition-all mr-4"
        >
          Home
        </Link>
        <Link
          href="/chat"
          className="px-4 py-2 bg-[#36302F] rounded-md hover:bg-[#444040] transition-all"
        >
          Chat
        </Link>
      </div>
    </div>
  );
};

export default PersonalizedBlueprint;
