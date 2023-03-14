import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaCog,
  FaHeart,
  FaSignInAlt,
  FaUser,
} from "react-icons/fa";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-0 right-0 z-50 flex h-16 items-center justify-center bg-purple-500 px-4 py-4"
      >
        <FaBars size={25} />
      </button>
      {isOpen && (
        <div className="fixed top-0 right-0 z-30 flex h-full flex-col gap-6 bg-black py-12 px-4">
          {/* buttons */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
            <FaBook size={20} />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
            <FaSignInAlt size={20} />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
            <FaHeart size={20} />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
            <FaCog size={20} />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30">
            <FaUser size={20} />
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
