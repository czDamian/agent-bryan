"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Schema for Login Form
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for Register Form
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Onboard = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          type: isRegister ? "register" : "login",
        }),
      });

      const result = await response.json();
      setResponseMessage(result.message || "Something went wrong");
      if (result?.message === "Login successful") {
        setTimeout(() => {
          router.push("/chat");
        }, 3000);
      }

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }
    } catch (error) {
      setResponseMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {isRegister ? "Register" : "Login"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isRegister && (
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
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      {responseMessage && (
        <p
          className={`text-sm italic text-center mt-2 ${
            responseMessage.includes("success")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {responseMessage}
        </p>
      )}
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-sm text-blue-400 hover:underline"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default Onboard;
