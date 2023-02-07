import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBook, FaCogs, FaHome } from "react-icons/fa";

const Index = () => {
  const { data: session } = useSession();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-black">
      <h1 className="text-4xl font-bold">
        Hello <span className="text-purple-400">{session?.user?.name}</span>
      </h1>
      <h4 className="text-xl font-light tracking-widest text-yellow-300">
        {session?.user?.role}
      </h4>
      <div className="flex flex-row gap-4">
        <Link
          className="flex flex-col items-center rounded-xl bg-white/40 px-7 py-4"
          href={"/"}
        >
          <FaHome />
          <span>Domu</span>
        </Link>
        <Link
          className="flex flex-col items-center rounded-xl bg-white/40 px-7 py-4"
          href={"/admin/recepty"}
        >
          <FaBook />
          <span>Recepty</span>
        </Link>
        <Link
          className="flex flex-col items-center rounded-xl bg-white/40 px-7 py-4"
          href={"#"}
        >
          <FaCogs />
          <span>Nastaveni</span>
        </Link>
      </div>
    </div>
  );
};

export default Index;
