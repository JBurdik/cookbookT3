import Link from "next/link";
import { FiCommand, FiHome } from "react-icons/fi";

const Nav = () => {
  return (
    <nav className="fixed bottom-4 right-4 flex flex-col gap-4 ">
      <Link className="admin-nav" href={"/admin"}>
        <FiCommand size={"1.5em"} />
      </Link>
      <Link className="admin-nav" href={"/"}>
        <FiHome size={"1.5em"} />
      </Link>
    </nav>
  );
};

export default Nav;
