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
      {/* {pathname.startsWith("/recipe") ? (
        <main className="flex min-h-screen w-screen flex-col items-center bg-gray-900">
          <div className="flex h-full w-full flex-col items-center gap-12 ">
            {children}
          </div>
        </main>
      ) : (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-900">
          <div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16 ">
            {children}
          </div>
        </main>
      )} */}
      <main className="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-900">
        <div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16 ">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
