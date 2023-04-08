import Head from "next/head";
import { FaCopyright } from "react-icons/fa";
import Layout from "../components/Layout";

const About = () => {
  return (
    <>
      <Head>
        <title>O projektu | Naservírováno.cz</title>
      </Head>
      <Layout>
        <h1>O projektu</h1>
        <p>
          Naservírovano je osobní kuchařka, která nabízí jednoduché a chutné
          recepty pro všechny milovníky vaření. Hlavním cílem je inspirace a
          motivace přátel a rodiny k přípravě ověřených receptů a jídel doma,
          které jsou nejen chutné, ale také snadno připravitelné.
        </p>
        <p>
          Naservírovano klade důraz na kvalitní suroviny a preferuje použití
          sezónních a lokálních potravin, aby se zajistila co nejvyšší kvalita
          jídel. Kromě toho, nabízí různé kategorie receptů, od snídaní až po
          dezerty, které jsou doplněny o popis ingrediencí, postup a fotografie
          pro co nejsnadnější přípravu. Věříme, že vaření by mělo být zábavné a
          dostupné pro každého, a právě tohle je základem filosofie kuchařky
          Naservírovano.
        </p>
        <span className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <FaCopyright /> Jiří Burdych 2023
        </span>
      </Layout>
    </>
  );
};

export default About;
