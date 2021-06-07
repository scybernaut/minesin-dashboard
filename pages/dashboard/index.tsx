import Layout from "../../components/Layout";
import { dashboardActions } from "../../lib/actions";
import MinesinAPI, { MembersArray } from "../../lib/api";

import MembersList from "../../components/MembersList";
import ResourceBars from "../../components/ResourceBars";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  const [api, setAPI] = useState<MinesinAPI>();
  const [members, setMembers] = useState<MembersArray>();
  const [cpu, setCPU] = useState<number>();
  const [ram, setRAM] = useState<number>();

  const ignoreCanceled = (reason: { isCancelled: boolean } | any) => {
    if (reason.isCanceled !== true) throw reason;
  };

  useEffect(() => {
    const api = new MinesinAPI(localStorage.getItem("accessToken") ?? "", router, true);
    setAPI(api);
    const promises = {
      cpu: api.getCPUUsage(),
      ram: api.getRAMUsage(),
      members: api.getMembers(),
    };

    promises.cpu.promise.then(setCPU);
    promises.ram.promise.then(setRAM);
    promises.members.promise.then(setMembers);

    Object.values(promises).forEach((promise) => promise.promise.catch(ignoreCanceled));

    return () => Object.values(promises).forEach((promise) => promise?.cancel());
  }, []);

  // TODO: periodically request new data from API

  return (
    <Layout
      actions={dashboardActions(router)}
      color="bg-gray-900"
      className="text-white p-4 mx-auto grid grid-cols-1 sm:grid-cols-2 auto-rows-min gap-4 lg:gap-12 w-full max-w-5xl"
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
