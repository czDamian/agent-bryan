"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";

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

const PersonalizedBlueprint = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    console.log("User Data:", formData);
    setStatus("");

    setLoading(true);

    try {
      const response = await fetch("/api/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: formData }),
      });

      const responseData = await response.json(); // Fix variable name
      setStatus(responseData.message); // Set status as a string
    } catch (error) {
      console.error("Personalization error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Personalized Blueprint</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Age</label>
          <input
            type="number"
            {...register("age")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Diet</label>
          <input
            type="text"
            {...register("diet")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.diet && (
            <p className="text-red-500 text-sm">{errors.diet.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Activity Level</label>
          <input
            type="text"
            {...register("activityLevel")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.activityLevel && (
            <p className="text-red-500 text-sm">
              {errors.activityLevel.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">Health Goals</label>
          <textarea
            {...register("healthGoals")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.healthGoals && (
            <p className="text-red-500 text-sm">{errors.healthGoals.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-600 rounded hover:bg-green-700"
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {status && (
          <div className="mt-4">
            <h1 className="font-bold mb-3 text-lg">Personalization Result</h1>
            <ReactMarkdown>{status}</ReactMarkdown>
          </div>
        )}
      </form>
    </div>
  );
};

export default PersonalizedBlueprint;
