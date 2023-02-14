import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaBook, FaCogs } from "react-icons/fa";
import AdminWrapper from "./AdminWrapper";

const Index = () => {
  const { data: session } = useSession();
  return (
    <AdminWrapper>
      <h1>
        Hello <span className="text-purple-400">{session?.user?.name}</span>
      </h1>
      <h4 className="text-xl font-light tracking-widest text-yellow-300">
        {session?.user?.role}
      </h4>
      <div className="flex flex-row gap-4">
        <Link
          className="flex flex-col items-center rounded-xl bg-white/40 px-7 py-4"
          href={"/admin/recepty"}
        >
          <FaBook />
          <span>Recepty</span>
        </Link>
        <Link
          className="flex flex-col items-center rounded-xl bg-white/40 px-7 py-4"
          href={"/admin/options"}
        >
          <FaCogs />
          <span>Nastaveni</span>
        </Link>
      </div>
    </AdminWrapper>
  );
};

export default Index;
