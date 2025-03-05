import Image from "next/image";

const page = () => {
  return (
    <div className="bg-white min-h-[100vh]">
      <Image
        src="/loaderBg.png"
        width={1000}
        height={1000}
        alt="logo"
        className="w-full h-[30vh]"
      />
      <div className="flex items-center justify-center flex-col gap-12">
        <Image
          src="/hdLogo.png"
          width={100}
          height={100}
          alt="logo"
          className="w-40 animate-pulse"
        />
        <h1 className="text-4xl text-dark-pink-100 font-bold">Agent Bryan</h1>
      </div>
    </div>
  );
};

export default page;
