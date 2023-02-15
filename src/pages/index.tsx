import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";

import { type Recepty } from "@prisma/client";
import Link from "next/link";
import Layout from "../components/Layout";
import RecipeForm from "../components/newRecipeForm";
import { api } from "../utils/api";

import { HiExclamation } from "react-icons/hi";

function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const news = api.news.getNews.useQuery(undefined).data;
  const getRecipes = api.recipes.getAll.useQuery().data;
  const options = api.options.getAll.useQuery().data;
  const admin = api.recipes.admin.useQuery();
  const [recipes, setRecipes] = useState<Recepty[]>();

  if (getRecipes && !recipes) {
    setRecipes([...getRecipes]);
  }

  const getData = (data: Recepty) => {
    if (recipes) {
      setRecipes([...recipes, data]);
    }
  };
  console.log(admin);
  if (options?.underConstruction)
    return (
      <Layout>
        <HiExclamation size={200} className="text-yellow-300" />
        <h1 className="text-4xl">
          Pracuji na vylepšení webu brzy bude znovu k dispozici
        </h1>
      </Layout>
    );
  return (
    <>
      <Head>
        <title>{options?.title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="sm:text-[5rem]">
            {options?.name}{" "}
            <span className="text-[hsl(280,100%,70%)]">Kuchařka</span>
          </h1>
          <div className="grid grid-cols-2 items-center justify-center gap-4">
            {news &&
              options?.showNews &&
              news.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                >
                  <h3 className="text-2xl font-bold">{item.title}</h3>

                  <p className="text-lg">{item.content}</p>
                </div>
              ))}
          </div>
          <h2 className="text-3xl">Recepty: </h2>
          <button
            className="rounded-sm bg-purple-600 px-4 py-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            Přidat recept
          </button>
          <div className="grid grid-cols-2 items-center justify-center gap-4">
            {recipes &&
              recipes.map((recipe, i) => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                  >
                    <h3 className="text-2xl font-bold">{recipe.title}</h3>

                    <p className="text-lg">{recipe.content}</p>

                    {recipe.ingredients &&
                      recipe.ingredients
                        .split(",")
                        .map((item, i) => <p key={i}>{item}</p>)}
                  </div>
                </Link>
              ))}
          </div>
          <RecipeForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={getData}
          />
          <div className="flex flex-col items-center justify-center gap-4"></div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const role = api.example.getUserRole.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  }).data?.role;

  return (
    <div className="fixed bottom-0 flex w-full flex-row items-center justify-between gap-4 bg-black/70 px-6 py-2">
      <p className="flex flex-row items-center justify-center gap-2 text-center text-white">
        {sessionData && (
          <span className="text-lg">{sessionData.user?.name}</span>
        )}
        <Link href="/admin">
          <span className="text-center text-xs text-red-500">
            {role && <span> - {role}</span>}
          </span>
        </Link>
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};