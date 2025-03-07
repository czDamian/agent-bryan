import Image from "next/image";
import Link from "next/link";
import Benefits from "./Benefits";
import Footer from "./Footer";
import StatsCard from "./StatsCard";

const Hero = () => {
  return (
    <section className="bg-light-pink-50">
      <div className="bg-[#BD99A2] w-full">
        {/* desktop  view */}
        <div className="bg-[#EFE6EA] hidden md:flex text-xl sm:text-2xl md:text-3xl font-coolvetica text-center py-4 px-12 mx-16 tracking-wider justify-between items-center">
          <Link
            href="/"
            className="hidden md:inline-block font-[100] mr-4 md:ml-8 font-rubik tracking-normal text-2xl"
          >
            Chat
          </Link>
          <div className="hidden md:block">Agent Bryan</div>
          <Link
            href="/"
            className="hidden md:inline-block font-[100] md:mr-8 ml-4 font-rubik tracking-normal text-2xl border border-light-pink-100 px-4 py-1 rounded-lg hover:bg-light-pink-100 hover:text-white"
          >
            Get Started
          </Link>
        </div>
        <div>
          {/* for mobile view */}

          <div className="bg-[#EFE6EA] text-xl sm:text-2xl md:text-3xl font-coolvetica text-center py-4 px-12 mx-16 tracking-wider md:hidden ">
            Agent Bryan
          </div>
        </div>
      </div>

      {/* New div wrapping the heading and hero-brain image */}
      <div
        className="relative w-full bg-cover bg-[position:left_15%,right_60%] md:bg-[position:left_15%,right_70%] lg:bg-[position:left_15%,right_80%]"
        style={{
          backgroundImage: `url('/agent-transparent.png'), url('/bryan-transparent.png')`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "contain, contain",
        }}
      >
        <div className="relative px-4 py-6">
          <div className="text-3xl md:text-4xl mb-96 flex gap-3 flex-col text-[#d180ac] font-coolvetica md:font-semibold">
            <div>Unlock Your</div>
            <div>Health Potential</div>
            <div>With AI-Powered</div>
            <div>Insights</div>
          </div>
          <div>
            <Image
              src="/hero-brain.png"
              height={1000}
              width={1000}
              alt="hero-brain"
              className="w-80 absolute top-20 right-[-5]"
            />
          </div>
        </div>
      </div>
      <div className="text-center py-16">
        <Link
          href="/onboard"
          className="bg-[#8F788D] hover:bg-[#7e6a7c] text-lg text-white px-20 py-3 rounded-full"
        >
          Get Started
        </Link>
      </div>
      <StatsCard />

      <div className="bg-[#BE98A2] text-white px-4 ">
        <div clas="flex flex-1 flex-col md:flex-row justify-center items-center">
          <div className="text-4xl lg:text-5xl space-y-4 p-4">
            <div className="mt-12">Experience the</div>
            <div>benefit of using</div>
            <div>Agent Bryan</div>
          </div>
          <p className=" mt-8 md:mt-16 max-w-md md:text-lg text-center p-8">
            Brayann AI delivers a seamless, personalized crypto experience. Get
            tailored insights, real-time security alerts, and interactive
            learning with earning opportunities. Its intuitive design makes
            crypto education engaging and rewarding, helping you make smarter,
            safer decisions.
          </p>
        </div>

        <Benefits />
      </div>
      <Footer />
    </section>
  );
};

export default Hero;
