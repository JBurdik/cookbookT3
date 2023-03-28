import { BarLoader } from "react-spinners";
import NavBar from "./NavBar";

const Layout = ({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  return (
    <>
      <NavBar />

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
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-primary-900">
        <div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16 ">
          {/* if is loading show this spiner */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-5">
              <BarLoader color="#faba8d" />
              <p className="text-xs font-extralight uppercase tracking-widest">
                {children}
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </>
  );
};

export default Layout;
