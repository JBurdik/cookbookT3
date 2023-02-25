import Link from "next/link";
import { useRouter } from "next/router";
import { RiHome2Line } from "react-icons/ri";
const LayooutNoCenter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <main className="flex min-h-screen flex-col bg-gray-900">
      {pathname != "/" ? (
        <Link href="/">
          <RiHome2Line />
        </Link>
      ) : null}
      <div className="gap- container flex flex-col items-center px-4 py-16 ">
        {children}
      </div>
    </main>
  );
};

export default LayooutNoCenter;
