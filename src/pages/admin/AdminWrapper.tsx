import { useSession } from "next-auth/react";
import Link from "next/link";
import { BounceLoader } from "react-spinners";
import Nav from "./Nav";

export default function AdminWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-black">
        <BounceLoader color="#786298" />
        <p className="text-xs font-extralight uppercase tracking-widest">
          Načítám session...
        </p>
      </div>
    );

  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-black">
        <h1 className="text-4xl font-bold">
          Nejsi Oprávněn navštívit tuto stránku
        </h1>
        <Link
          className="my-5 rounded-lg bg-yellow-400 py-2 px-4 font-light uppercase tracking-widest text-white shadow-lg shadow-black transition-all hover:bg-yellow-500"
          href={"/"}
        >
          Zpět Domů
        </Link>
      </div>
    );
  }
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-purple-700 to-black">
      <Nav />
      {children}
    </div>
  );
}
