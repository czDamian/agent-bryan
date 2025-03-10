"use client";

import Link from "next/link";

const cardData = [
  {
    title: "Personalized Meal Plans",
    description:
      "AI-curated nutrition recommendations based on your goals and preferences. Get tailored meal plans to optimize your health and energy.",
    link: "/personalize",
    icon: "🍽️",
    button: "Learn More",
  },
  {
    title: "Smart Fitness Guidance",
    description:
      "Get a well tailored workouts and activity tracking powered by AI to help you stay on track and improve your fitness with every step.",
    link: "/chat",
    icon: "🏋️",
    button: "Learn More",
  },
  {
    title: "Health Insight and Analysis",
    description:
      "AI-curated nutrition recommendations based on your goals and preferences. Get tailored meal plans to optimize your health and energy",
    link: "/personalize",
    icon: "🍽️",
    button: "Learn More",
  },
  {
    title: "Integration",
    description:
      "AI-curated nutrition recommendations based on your goals and preferences. Get tailored meal plans to optimize your health and energy",
    link: "/onboard",
    icon: "🏋️",
    button: "Get Started",
  },
];

export default function Benefits() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 py-16 place-content-center place-items-center">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="w-80 p-6 bg-gradient-to-b from-[#764F65] to-[#4A4247] rounded-2xl shadow-lg text-white"
        >
          <div className="text-4xl bg-orange-500 p-3 rounded-full inline-block mb-4">
            {card.icon}
          </div>
          <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
          <p className="text-sm mb-4">{card.description}</p>
          <Link
            href={card.link}
            className="inline-block px-4 py-2 border border-light-pink-100 rounded-full hover:bg-light-pink-50 hover:text-gray-800 transition"
          >
            {card.button}
          </Link>
        </div>
      ))}
    </div>
  );
}
