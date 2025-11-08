import { getTranslations } from "next-intl/server";
import { HomeContent } from "./home-content";

export default async function Home() {
  const t = await getTranslations("Home");
  return <HomeContent title={t("title")} />;
}
