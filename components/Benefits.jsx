"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";
import { BsBarChartFill } from "react-icons/bs";
import { IoFlashOutline } from "react-icons/io5";

const cardData = [
  {
    title: "Personalized Meal Plans",
    description:
      "Get AI-curated nutrition recommendations tailored to your dietary preferences, health goals, and restrictions. Our system learns from your feedback to continuously improve your meal suggestions.",
    link: "/personalize",
    iconSvg: <AiOutlineShoppingCart className="w-8 h-8" />,
    button: "Explore Meal Plans",
    color: "from-[#764F65] to-[#4A4247]",
  },
  {
    title: "Smart Fitness Guidance",
    description:
      "Receive personalized workout routines based on your fitness level, available equipment, and goals. Our AI coach adapts exercises to your progress and provides real-time feedback on form.",
    link: "#fitness",
    iconSvg: <FaRegHeart className="w-8 h-8" />,
    button: "Start Training",
    color: "from-[#764F65] to-[#4A4247]",
  },
  {
    title: "Health Insights & Analysis",
    description:
      "Access comprehensive health analytics that track your progress and identify patterns. Our AI provides actionable recommendations based on your biometric data and health history.",
    link: "#insights",
    iconSvg: <BsBarChartFill className="w-8 h-8" />,
    button: "View Insights",
    color: "from-[#764F65] to-[#4A4247]",
  },
  {
    title: "Seamless Integrations",
    description:
      "Connect with your favorite health apps and wearable devices for a unified health experience. Import data from Apple Health, Fitbit, Garmin, and more to enhance your personalized recommendations.",
    link: "#coming-soon",
    iconSvg: <IoFlashOutline className="w-8 h-8" />,
    button: "Connect Devices",
    color: "from-[#764F65] to-[#4A4247]",
  },
];

export default function Benefits() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="relative py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2  id="features" className="text-3xl font-coolvetica font-bold mb-4">
            Powerful Features
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Discover how Agent Bryan's comprehensive health platform can
            transform your wellness journey with these key features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className={`relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br ${card.color} h-full flex flex-col`}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  backgroundPosition:
                    hoveredIndex === index
                      ? ["0% 0%", "100% 100%"]
                      : ["0% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 8,
                  ease: "linear",
                }}
                style={{
                  backgroundImage: 'url("/pattern-dots.png")',
                  backgroundSize: "200% 200%",
                }}
              />

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                    {card.iconSvg}
                  </div>
                  <motion.div
                    animate={{ rotate: hoveredIndex === index ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <RxCaretDown />
                  </motion.div>
                </div>

                <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
                <p className="text-sm opacity-90 mb-6 flex-1">
                  {card.description}
                </p>

                <Link
                  href={card.link}
                  className="mt-auto inline-flex items-center justify-center px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  {card.button}
                  <RxCaretRight />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/onboard"
            className="inline-flex items-center justify-center px-8 py-3 bg-white/20 hover:bg-white/30 rounded-full text-lg font-medium transition-all duration-200"
          >
            Get Started with All Features
            <RxCaretRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
