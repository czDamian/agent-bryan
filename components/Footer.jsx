import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-[#282022] text-white py-6 pt-12 flex flex-col md:flex-row justify-between px-6 md:px-20 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Social Media</h3>
        <div className="flex flex-col gap-1">
          <Link href="#" className="hover:underline">
            Facebook
          </Link>
          <Link href="#" className="hover:underline">
            Instagram
          </Link>
          <Link href="#" className="hover:underline">
            Youtube
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Links</h3>
        <div className="flex flex-col gap-1">
          <Link href="/onboard" className="hover:underline">
            Login or Sign Up
          </Link>
          <Link href="/chat" className="hover:underline">
            Chat
          </Link>
          <Link href="/personalize" className="hover:underline">
            Personalize Blueprint
          </Link>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Legal</h3>
        <div className="flex flex-col gap-1">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Terms of use
          </Link>
          <Link href="#" className="hover:underline">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
