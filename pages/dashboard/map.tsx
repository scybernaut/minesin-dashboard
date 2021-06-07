import Layout from "../../components/Layout";
import { dashboardNavs } from "../../lib/navs";

export default function Map() {
  return (
    <Layout navs={dashboardNavs} color="bg-gray-900">
      <iframe
        src="https://omsinkrissada.sytes.net/api/minecraft/map/"
        title="Minecraft world map"
        className="w-full h-non-nav"
      />
    </Layout>
  );
}
