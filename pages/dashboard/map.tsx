import Layout from "../../components/Layout";
import { dashboardActions } from "../../lib/actions";
import { useRouter } from "next/router";

export default function Map() {
  const router = useRouter();

  return (
    <Layout actions={dashboardActions(router)} color="bg-gray-900" always="transparent" fullWidth>
      <iframe
        src="https://omsinkrissada.sytes.net/api/minecraft/map/"
        title="Minecraft world map"
        className="w-full h-non-nav"
      />
    </Layout>
  );
}
