"use client"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Benefits from "./Benefits";
import Footer from "./Footer";
import StatsCard from "./StatsCard";

const Hero = () => {
  return (
    <section className="bg-light-pink-50">
      {/* Navbar */}
      <header className="bg-[#BD99A2] w-full">
        {/* Desktop Navigation */}
        <div className="bg-[#EFE6EA] hidden md:flex text-xl sm:text-2xl md:text-3xl font-coolvetica text-center py-4 px-12 mx-16 tracking-wider justify-between items-center">
          <Link
            href="/chat"
            className="hidden md:inline-block font-[100] mr-4 md:ml-8 font-rubik tracking-normal text-2xl"
          >
            Chat
          </Link>
          <div className="hidden md:block">Agent Bryan</div>
          <Link
            href="/onboard"
            className="hidden md:inline-block font-[100] md:mr-8 ml-4 font-rubik tracking-normal text-2xl border border-light-pink-100 px-4 py-1 rounded-lg hover:bg-light-pink-100 hover:text-white"
          >
            Get Started
          </Link>
        </div>
        
        {/* Mobile Navigation */}
        <div className="bg-[#EFE6EA] text-xl sm:text-2xl md:text-3xl font-coolvetica text-center py-4 px-12 mx-16 tracking-wider md:hidden">
          Agent Bryan
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-[position:left_15%,right_60%] md:bg-[position:left_15%,right_70%] lg:bg-[position:left_15%,right_80%]"
        style={{
          backgroundImage: `url('/agent-transparent.png'), url('/bryan-transparent.png')`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "contain, contain",
        }}
      >
        <div className="relative px-4 py-6">
          {/* Hero Text */}
          <div className="text-3xl md:text-4xl mb-96 flex gap-3 flex-col text-[#d180ac] font-coolvetica md:font-semibold">
            <div>Unlock Your</div>
            <div>Health Potential</div>
            <div>With AI-Powered</div>
            <div>Insights</div>
          </div>
          
          {/* Hero Image with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-20 right-[-5]"
          >
            <motion.div
              animate={{ 
                y: [0, 15, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/hero-brain.png?v=1"
                height={1000}
                width={1000}
                alt="hero-brain"
                className="max-w-xs"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center py-16">
        <Link
          href="/onboard"
          className="bg-[#8F788D] hover:bg-[#7e6a7c] text-lg text-white px-20 py-3 rounded-full"
        >
          Get Started
        </Link>
      </div>

      {/* Stats Section */}
      <StatsCard />

      {/* Benefits Section */}
      <div className="bg-[#BE98A2] text-white px-4">
        <div className="flex flex-1 flex-col md:flex-row justify-center items-center">
          <div className="text-4xl lg:text-5xl space-y-4 p-4 text-center font-coolvetica">
            <div className="mt-12">Experience the</div>
            <div>benefit of using</div>
            <div>Agent Bryan</div>
          </div>
          <p className="mt-8 md:mt-16 mx-auto max-w-md md:text-lg text-center px-8 py-2">
            Brayann AI delivers a seamless, personalized crypto experience. Get
            tailored insights, real-time security alerts, and interactive
            learning with earning opportunities. Its intuitive design makes
            crypto education engaging and rewarding, helping you make smarter,
            safer decisions.
          </p>
        </div>

        <Benefits />
      </div>

      {/* Footer */}
      <Footer />
    </section>
  );
};

export default Hero;