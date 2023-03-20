import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef } from "react";
import Layout from "../components/Layout";
import { api } from "../utils/api";
function Profile() {
  const { data: session, status } = useSession();
  const name = useRef<HTMLInputElement>(null);
  const changeName = api.users.setName.useMutation({
    onSuccess: (data) => {
      if (session && session.user && name.current) {
        session.user.name = data.user.name as string;
        name.current.value = data.user.name as string;
      }
    },
  });
  if (status === "loading") return <Layout isLoading>Načítam data...</Layout>;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      name.current &&
      session &&
      session.user &&
      name.current.value !== session.user.name
    )
      changeName.mutate(name.current.value);
  };
  return (
    <Layout>
      <h1>Profile</h1>
      {session && session.user && (
        <section className="flex flex-col items-center gap-2">
          <Image
            src={session.user.image || ""}
            alt={session.user.name || "User image"}
            width={100}
            height={100}
            className="rounded-full border-4 border-purple-400"
          />
          <h2>{session.user.name}</h2>
          <div className="flex items-end gap-2">
            <p className="text-xs font-extralight">Role:</p>
            <p className="text-sm font-bold tracking-wide text-purple-400">
              {session.user.role}
            </p>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <h4 className="m-0 text-center">Upravit údaje</h4>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-light">Nové jméno:</label>
              <input
                type="text"
                ref={name}
                className="rounded-md border border-purple-200 bg-gray-700/40 p-2 outline-none"
              />
            </div>
            <button
              className="flex items-center justify-center rounded-md border border-purple-200 bg-gray-700/40 p-2"
              type="submit"
            >
              Nastavit
            </button>
          </form>
        </section>
      )}
    </Layout>
  );
}

export default Profile;
