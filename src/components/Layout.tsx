import Link from "next/link";
import { useRouter } from "next/router";
import { FiHome } from "react-icons/fi";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <>
      {pathname !== "/" && (
        <Link
          href="/"
          className="fixed bottom-4 right-4 rounded-full bg-white/30 p-4 text-white/70"
        >
          <FiHome size={"2rem"} />
        </Link>
      )}
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
