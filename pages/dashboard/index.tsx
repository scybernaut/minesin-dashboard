import Layout from "../../components/Layout";
import { dashboardActions } from "../../lib/actions";
import MinesinAPI, { MembersArray } from "../../lib/api";

import MembersList from "../../components/MembersList";
import ResourceBars from "../../components/ResourceBars";

import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  const [members, setMembers] = useState<MembersArray>();
  const [cpu, setCPU] = useState<number>();
  const [ram, setRAM] = useState<number>();

  const ignoreCanceled = (reason: { isCancelled: boolean } | any) => {
    if (reason.isCanceled !== true) throw reason;
  };

  const promisesRef = useRef<ReturnType<typeof getPromises>>();

  const getPromises = (api: MinesinAPI) => {
    return {
      cpu: api.getCPUUsage(),
      ram: api.getRAMUsage(),
      members: api.getMembers(),
    };
  };

  useEffect(() => {
    const api = new MinesinAPI(localStorage.getItem("accessToken") ?? "", router, true);

    const retrieveData = async () => {
      const promises = getPromises(api);

      const ongoing = [
        promises.cpu.promise.then(setCPU),
        promises.ram.promise.then(setRAM),
        promises.members.promise.then(setMembers),
      ];

      Object.values(promises).forEach((promise) => promise.promise.catch(ignoreCanceled));

      promisesRef.current = promises;

      return ongoing;
    };

    retrieveData();
    const interval = setInterval(retrieveData, 15000);

    return () => {
      clearInterval(interval);
      Object.values(promisesRef.current ?? {}).forEach((promise) => promise.cancel());
    };
  }, []);

  return (
    <Layout
      actions={dashboardActions(router)}
      color="bg-gray-900"
      className="text-white p-4 mx-auto grid grid-cols-1 sm:grid-cols-2 auto-rows-min gap-4 lg:gap-12 w-full max-w-5xl"
      showToggle
    >
      <MembersList className="row-span-2" members={members ?? []} />
      <ResourceBars
        usages={{
          cpu: cpu ?? 0,
          ram: ram ?? 0,
        }}
      />
    </Layout>
  );
}
