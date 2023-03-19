import { Role } from "@prisma/client";
import { AnimatePresence, motion as m } from "framer-motion";
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
import css from "./NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: sessionData } = useSession();
  // framer motion variants for animation open and close menu
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 1, x: "100%" },
  };
  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 flex w-full flex-row items-center justify-between rounded-lg border border-purple-200 bg-purple-500/20 px-4 py-2 backdrop-blur-md">
        <button className={css.btn}>
          <FaBook size={20} />
          <span>Recepty</span>
        </button>
        <m.button className={css.btn} onClick={() => setIsOpen(!isOpen)}>
          <AnimatePresence>
            <m.div
              key={isOpen ? "open" : "closed"}
              className=" flex items-center justify-center"
              // animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <m.div
                key={isOpen ? "open" : "closed"}
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </m.div>
              {/* {isOpen ? (
                <m.div
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <FaTimes size={20} />
                </m.div>
              ) : (
                <m.div
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <FaBars size={20} />
                </m.div> 
              )}*/}
            </m.div>
          </AnimatePresence>
          <span>{isOpen ? "Close" : "More"}</span>
        </m.button>
      </div>
      <m.div
        initial="closed"
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
              className="mb-6 flex items-center justify-center transition hover:text-purple-400"
              onClick={() => void signOut()}
            >
              <FaSignOutAlt size={20} />
            </button>
          </>
        ) : (
          <div
            onClick={() => void signIn()}
            className="mt-auto mb-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white/30"
          >
            <FaSignInAlt size={20} />
          </div>
        )}
      </m.div>
    </>
  );
};

export default NavBar;

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
        <Link href="/admin" className="transition hover:text-purple-300">
          <FiCommand size={20} />
        </Link>
      )}
    </>
  );
};
