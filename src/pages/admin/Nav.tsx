import Link from "next/link";
import { RiHome2Line, RiHomeGearLine } from "react-icons/ri";

const Nav = () => {
  return (
    <nav className="fixed bottom-4 right-4 flex flex-col gap-4 ">
      <Link className="admin-nav" href={"/admin"}>
        <RiHomeGearLine size={"1.5em"} />
      </Link>
      <Link className="admin-nav" href={"/"}>
        <RiHome2Line size={"1.5em"} />
      </Link>
    </nav>
  );
};

export default Nav;
