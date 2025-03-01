import Image from "next/image";
import Link from "next/link";
import Benefits from "./Benefits";
import Footer from "./Footer";

const Hero = () => {
  return (
    <section className=" bg-light-pink-50">
      <div className="bg-[#BD99A2] w-full ">
        <h1 className="bg-[#EFE6EA] text-3xl font-coolvetica text-center py-4 px-12 mx-16 tracking-wider">
          Agent Bryan
        </h1>
      </div>
      <div className="relative px-4">
        <div className="text-4xl mb-96 flex gap-3 flex-col text-[#d180ac] mt-16 font-semibold font-coolvetica">
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
      <div className="text-center py-16 ">
        <Link
          href="/personalize"
          className="bg-[#8F788D] hover:bg-[#7e6a7c] text-lg text-white px-12 py-3 rounded-full"
        >
          Start your personalized plan
        </Link>
      </div>
      <div className="bg-[#BE98A2] text-white px-4">
        <div className="text-4xl p-8  text-center">
          <div className="mt-12">Experience the</div>
          <div>benefit of using</div>
          <div>Agent Brayann</div>
        </div>
        <p className="mx-auto mt-8 max-w-md text-center">
          Unlock the full potential of usingkk kkkkkkkkk kkkkk kkkhhhhhh nhhdjdt
          jfyjfykkkkkkkk kkkkkkkkkk kkkkkkkkk kkkk kkkkkkkkkmj hhddjjj jjjjjjjj
          jjjjjjjj jjjjjjjjjj jjjjjruy iirtetet eoiero wertiortiriot
          riotertioorero eoirgjeeertroit rtoitt ofkdg ggogoero iggihgio gooogo
          rige rgiu rgrui
        </p>
        <Benefits />
      </div>
      <Footer />
    </section>
  );
};

export default Hero;
