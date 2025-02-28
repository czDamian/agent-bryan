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
        credentials: "include",
      });

      const result = await response.json();
      setResponseMessage(result.message || "Something went wrong");
      if (result?.message === "Login successful") {
        setTimeout(() => {
          router.push("/chat");
          console.log("res", result);
        }, 3000);
      }
      if (result?.message === "Registered successfully, proceed to login") {
        setTimeout(() => {
          setIsRegister(false);
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
    <div className="max-w-md mt-20 mx-auto p-6 bg-gradient-to-b from-[#CBB8BD] to-[#774F65] text-black rounded-lg">
      <h2 className="text-2xl text-center font-bold mb-4">
        {isRegister ? "Register" : "Login"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-2 rounded"
            />
            {errors.name && (
              <p className="text-neutral-800 text-sm">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 rounded"
          />
          {errors.email && (
            <p className="text-neutral-800 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 rounded"
          />
          {errors.password && (
            <p className="text-neutral-800 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="py-5">
          <button
            type="submit"
            className="w-full  p-2 bg-light-pink-50 rounded hover:bg-light-pink-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </div>
      </form>
      {responseMessage && (
        <p
          className={`text-sm italic text-center mt-2 ${
            responseMessage.includes("success")
              ? "text-green-400"
              : "text-neutral-800"
          }`}
        >
          {responseMessage}
        </p>
      )}
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-sm text-white hover:underline"
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default Onboard;
