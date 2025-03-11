import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { RiLoginBoxLine } from "react-icons/ri";
import { BsChatDots } from "react-icons/bs";
import { MdOutlinePersonalInjury } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { MdGavel } from "react-icons/md";
import { BiAccessibility } from "react-icons/bi";

const FooterSection = ({ title, items }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="flex flex-col gap-1">
      {items.map((item, index) => (
        <Link key={index} href={item.href} className="hover:underline flex items-center gap-2">
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  </div>
);

const Footer = () => {
  const socialLinks = [
    { href: "#", icon: <FaFacebook size={18} />, label: "Facebook" },
    { href: "#", icon: <FaInstagram size={18} />, label: "Instagram" },
    { href: "#", icon: <FaYoutube size={18} />, label: "Youtube" }
  ];

  const navLinks = [
    { href: "/onboard", icon: <RiLoginBoxLine size={18} />, label: "Login or Sign Up" },
    { href: "/chat", icon: <BsChatDots size={18} />, label: "Chat" },
    { href: "/personalize", icon: <MdOutlinePersonalInjury size={18} />, label: "Personalize Blueprint" }
  ];

  const legalLinks = [
    { href: "#", icon: <TbFileDescription size={18} />, label: "Privacy Policy" },
    { href: "#", icon: <MdGavel size={18} />, label: "Terms of use" },
    { href: "#", icon: <BiAccessibility size={18} />, label: "Accessibility" }
  ];

  return (
    <footer className="w-full bg-[#282022] text-white py-6 pt-12 flex flex-col md:flex-row justify-between px-6 md:px-20 gap-8">
      <FooterSection title="Social Media" items={socialLinks} />
      <FooterSection title="Links" items={navLinks} />
      <FooterSection title="Legal" items={legalLinks} />
    </footer>
  );
};

export default Footer;