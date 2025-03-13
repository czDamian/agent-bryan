"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Benefits from "./Benefits";
import Footer from "./Footer";
import StatsCard from "./StatsCard";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="bg-white">
      {/* Navbar */}
      <header className="w-full">
        {/* Desktop Navigation */}
        <div className="bg-[#EFE6EA] hidden md:flex text-xl sm:text-2xl md:text-3xl font-coolvetica py-6 px-12 mx-auto max-w-full tracking-wider justify-between items-center border-b border-[#D9BDC5]">
          <div className="flex items-center space-x-8">
            <div className="text-[#BD99A2] font-bold">Agent Bryan</div>
            <Link
              href="/chat"
              className="font-rubik tracking-normal text-lg text-[#8F788D] hover:text-[#7e6a7c] transition-colors"
            >
              Chat
            </Link>
            <Link
              href="#features"
              className="font-rubik tracking-normal text-lg text-[#8F788D] hover:text-[#7e6a7c] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="font-rubik tracking-normal text-lg text-[#8F788D] hover:text-[#7e6a7c] transition-colors"
            >
              About
            </Link>
          </div>
          <Link
            href="/onboard"
            className="font-rubik tracking-normal text-lg bg-[#BD99A2] text-white px-6 py-2 rounded-lg hover:bg-[#a3838c] transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="bg-[#f8f3f6] flex justify-between items-center text-xl sm:text-2xl md:text-3xl font-coolvetica text-center py-4 px-6 md:hidden border-b border-[#D9BDC5]">
          <div className="text-[#BD99A2] font-bold">Agent Bryan</div>
          <Link
            href="/onboard"
            className="font-rubik tracking-normal text-sm bg-[#BD99A2] text-white px-4 py-1.5 rounded-lg hover:bg-[#a3838c] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.2,
                    },
                  },
                }}
              >
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-coolvetica font-bold text-[#d180ac]"
                  variants={textVariants}
                  custom={0}
                >
                  Unlock Your Health Potential
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-[#8F788D] font-coolvetica"
                  variants={textVariants}
                  custom={1}
                >
                  With AI-Powered Insights Tailored Just For You
                </motion.p>
              </motion.div>

              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                Agent Bryan combines advanced AI technology with deep health
                expertise to provide personalized wellness recommendations,
                track your progress, and help you achieve optimal health
                outcomes.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Link
                  href="/onboard"
                  className="bg-[#BD99A2] hover:bg-[#a3838c] text-center text-white px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Start Your Health Journey
                </Link>
                <a
                  href="https://youtube.com/"
                  className="bg-transparent border-2 border-[#BD99A2] text-center text-[#BD99A2] hover:bg-[#f9eef1] px-8 py-3 rounded-full font-medium transition-colors"
                >
                  Watch Demo
                </a>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
              >
                <FaRegCheckCircle className="text-[#BD99A2]" />
                <span>No credit card required</span>
              </motion.div>
            </div>

            {/* Right Content - Animated Image Background */}
            <motion.div
              className="relative h-96 md:h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e9cedc] to-[#dab4c3] rounded-3xl overflow-hidden">
                <div className="relative h-full flex flex-col justify-center items-center p-8 text-center z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className=" mb-6 px-5 py-2 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Image
                      src="/hdLogo.png"
                      width={60}
                      height={60}
                      alt="Agent Bryan Icon"
                    />
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-coolvetica font-bold text-[#8F788D] mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    Your AI Health Partner
                  </motion.h3>
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                          delayChildren: 1,
                        },
                      },
                    }}
                  >
                    {[
                      "Personalized Health Plans",
                      "24/7 Nutrition Guidance",
                      "Fitness Tracking",
                      "Mental Wellness Support",
                      "Sleep Optimization",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-center space-x-2"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.5 },
                          },
                        }}
                      >
                        <FaCheck className="text-[#d180ac] " />
                        <span className="text-[#8F788D] font-medium">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <StatsCard />

      {/* Key Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-coolvetica font-bold text-[#BD99A2] mb-4">
              Why Choose Agent Bryan?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of health management with our AI-powered
              platform designed to simplify your wellness journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Insights",
                description:
                  "Advanced algorithms analyze your health data to provide personalized recommendations tailored to your unique needs.",
                icon: (
                  <HiOutlineLightBulb className="text-[#d180ac] w-12 h-12" />
                ),
              },
              {
                title: "Holistic Health Approach",
                description:
                  "Focus on all aspects of wellness including nutrition, physical activity, mental wellbeing, and sleep quality.",
                icon: <FaRegHeart className="text-[#d180ac] w-12 h-12" />,
              },
              {
                title: "Continuous Learning",
                description:
                  "Our AI system adapts to your feedback and progress, constantly refining its recommendations to optimize your health journey.",
                icon: <MdAutoGraph className="text-[#d180ac] w-12 h-12" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#e6dbdf] p-8 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-coolvetica font-bold text-[#8F788D] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#EFE6EA] py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-coolvetica font-bold text-[#BD99A2]">
              Ready to Transform Your Health Journey?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the benefits
              of AI-powered health insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/onboard"
                className="bg-[#BD99A2] hover:bg-[#a3838c] text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="#contact"
                className="bg-white border border-[#BD99A2] text-[#BD99A2] hover:bg-[#f9eef1] px-8 py-3 rounded-full font-medium transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-deep-wood-300 text-white px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-1 flex-col md:flex-row justify-center items-center mb-12 mx-auto max-w-4xl">
            <motion.div
              className="text-4xl lg:text-5xl space-y-4 p-4 text-center font-coolvetica"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>Experience the</div>
              <div>benefits of using</div>
              <div>Agent Bryan</div>
            </motion.div>
            <motion.p
              className="mt-8 md:mt-16 mx-auto max-w-md md:text-lg text-center px-8 py-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Agent Bryan delivers a seamless, personalized health experience.
              Get tailored insights, real-time wellness alerts, and interactive
              learning with achievement opportunities. Its intuitive design
              makes health education engaging and rewarding, helping you make
              smarter, healthier decisions.
            </motion.p>
          </div>

          <Benefits />
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="bg-[#F9F4F6] rounded-2xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-coolvetica font-bold text-[#BD99A2] mb-2">
                Stay Updated with Health Tips
              </h3>
              <p className="text-gray-600">
                Subscribe to our newsletter for the latest health insights and
                Agent Bryan updates.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BD99A2] focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-[#8F788D] hover:bg-[#7e6a7c] text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3 text-center">
              By subscribing, you agree to our Privacy Policy and Terms of
              Service.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </section>
  );
};

export default Hero;
