import Link from "next/link";

const Header = () => {
  return (
    <div className="flex p-2 font-bold bg-gray-950 gap-2 justify-center items-center">
      <div>Agent Bryan</div>
      <div className="flex gap-2">
        <Link href="/chat" className="underline">
          Chat
        </Link>
        <Link href="/personalize" className="underline">
          Personalize
        </Link>
        <Link href="/onboard" className="underline">
          Onboard
        </Link>
      </div>
    </div>
  );
};

export default Header;
