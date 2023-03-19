import { Role } from "@prisma/client";
import { motion as m } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaCog,
  FaHeart,
  FaSignInAlt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FiCommand } from "react-icons/fi";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: sessionData } = useSession();
  // framer motion variants for animation open and close menu
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 1, x: "100%" },
  };
  return (
    <>
      <div className="fixed bottom-0 right-0 z-50 flex w-20 items-center justify-center rounded-lg border border-purple-200 bg-purple-500/20 px-4 py-4 backdrop-blur-lg">
        <m.button
          onClick={() => setIsOpen(!isOpen)}
          className=""
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <m.div>
              <FaTimes size={20} />
            </m.div>
          ) : (
            <m.div>
              <FaBars size={20} />
            </m.div>
          )}
        </m.button>
      </div>
      <m.div
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 z-30 flex h-full w-20 flex-col items-center gap-6 border-l border-gray-50/20 bg-gray-300/20 py-12 shadow-lg shadow-black backdrop-blur-md"
      >
        {/* buttons */}
        <Link
          href="/"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30"
        >
          <FaBook size={20} />
        </Link>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
          <FaHeart size={20} />
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
          <FaCog size={20} />
        </div>

        {sessionData ? (
          <>
            <AuthShowcase />
            <button
              className="mb-6 flex items-center justify-center"
              onClick={() => void signOut()}
            >
              <FaSignOutAlt size={20} />
            </button>
          </>
        ) : (
          <div
            onClick={() => void signIn()}
            className="mt-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white/30"
          >
            <FaSignInAlt size={20} />
          </div>
        )}
      </m.div>
    </>
  );
};

export default Nav;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const role = sessionData?.user?.role;

  return (
    <>
      <div className="mt-auto">
        <p className="flex flex-row items-center justify-center gap-2 text-center text-white">
          {sessionData && sessionData.user && sessionData.user.image && (
            <Link href="/">
              <Image
                src={sessionData.user.image}
                alt={sessionData.user.name || "User image"}
                width={55}
                height={55}
                className="rounded-full border-2 border-white transition-all hover:border-purple-300"
              />
            </Link>
          )}
        </p>
      </div>
      {role === Role.ADMIN && (
        <Link href="/admin">
          <FiCommand size={20} />
        </Link>
      )}
    </>
  );
};
