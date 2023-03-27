import { Role } from "@prisma/client";
import { motion as m } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaSignInAlt, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { FiBook, FiCommand, FiHeart, FiInfo, FiSettings } from "react-icons/fi";
import css from "./NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: sessionData } = useSession();
  // framer motion variants for animation open and close menu
  const variants = {
    open: { opacity: 1, y: 0, display: "flex" },
    closed: { opacity: 1, y: "125%", transitionEnd: { display: "none" } },
  };
  const animateOptionsIcon = {
    show: {
      scale: 1,
      display: "block",
    },
    hide: {
      scale: 0,
      transitionEnd: {
        display: "none",
      },
    },
  };
  const animateOptionsText = {
    show: {
      rotate: 0,
      opacity: 1,
      display: "block",
    },
    hide: {
      rotate: 180,
      opacity: 0,
      transitionEnd: {
        display: "none",
      },
    },
  };
  return (
    <>
      <div className="fixed bottom-0 left-1/2 z-50 flex h-16 w-full max-w-4xl -translate-x-1/2 flex-row items-center justify-between rounded-lg border border-primaryL-200 bg-primary-300/20 px-4 py-2 backdrop-blur-md">
        <Link href="/" className={css.btn}>
          <FiBook size={20} />
          <span>Recepty</span>
        </Link>
        <Link href="/favorites" className={css.btn}>
          <FiHeart size={20} />
          <span>Oblibene</span>
        </Link>
        <Link href="/" className={css.btn}>
          <FiSettings size={20} />
          <span>Nastaveni</span>
        </Link>
        <button className={css.btn} onClick={() => setIsOpen(!isOpen)}>
          {/* icon of more btn */}
          <m.div
            initial={{ display: "none" }}
            transition={{
              delay: isOpen ? 0.3 : 0,
              duration: 0.3,
              type: "spring",
              bounce: 0.5,
            }}
            animate={isOpen ? animateOptionsIcon.show : animateOptionsIcon.hide}
          >
            <FaTimes size={20} />
          </m.div>
          <m.div
            transition={{
              delay: isOpen ? 0 : 0.3,
              duration: 0.3,
              type: "spring",
              bounce: 0.5,
            }}
            animate={isOpen ? animateOptionsIcon.hide : animateOptionsIcon.show}
          >
            <FaBars size={20} />
          </m.div>

          {/* text of icon */}
          <m.span
            initial={{ display: "none" }}
            transition={{
              delay: isOpen ? 0.3 : 0,
              duration: 0.3,
              type: "spring",
            }}
            animate={isOpen ? animateOptionsText.show : animateOptionsText.hide}
          >
            Close
          </m.span>
          <m.span
            transition={{
              delay: isOpen ? 0 : 0.3,
              duration: 0.3,
              type: "spring",
            }}
            animate={isOpen ? animateOptionsText.hide : animateOptionsText.show}
          >
            More
          </m.span>
        </button>
      </div>
      {/* more menu */}
      <m.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.5,
        }}
        className="fixed bottom-16 right-0 z-30 flex w-full max-w-4xl flex-col items-center gap-6 border-t border-gray-50/20 bg-gray-700/20 pt-12 pb-3 shadow-lg shadow-black backdrop-blur-md"
      >
        {/* buttons */}
        <m.div
          whileHover={{ scale: 1.2, color: "#faba8d" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="flex items-center justify-center gap-2 rounded-full bg-white/30 px-4 py-2 "
        >
          <FiInfo size={20} />O projektu
        </m.div>

        {sessionData ? (
          <>
            <AuthShowcase />
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

export default NavBar;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const role = sessionData?.user?.role;

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <div className="mt-auto">
        <p className="flex flex-row items-center justify-center gap-2 text-center text-white">
          {sessionData && sessionData.user && sessionData.user.image && (
            <Link href="/profile">
              <Image
                src={sessionData.user.image}
                alt={sessionData.user.name || "User image"}
                width={55}
                height={55}
                className="rounded-full border-2 border-white transition-all hover:border-primary-300"
              />
            </Link>
          )}
        </p>
      </div>
      {role === Role.ADMIN && (
        <m.span
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          whileHover={{ scale: 1.5 }}
        >
          <Link href="/admin" className="transition hover:text-primaryS-500">
            <FiCommand size={20} />
          </Link>
        </m.span>
      )}
      <m.button
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 10,
          duration: 0.3,
        }}
        whileHover={{ scale: 1.5 }}
        className="hover:text-primaryS-500"
        onClick={() => void signOut()}
      >
        <FaSignOutAlt size={20} />
      </m.button>
    </div>
  );
};
