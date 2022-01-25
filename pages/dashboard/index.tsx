import Layout from "../../components/Layout";
import { dashboardActions } from "../../lib/actions";
import {
  checkTokenStatus,
  apiErrorHandler,
  Member,
  TokenStatus,
} from "../../lib/helper";

import MembersList from "../../components/MembersList";
import ResourceBars from "../../components/ResourceBars";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import axios from "axios";
import { LogoutOptions, routeLogout } from "../../lib/shorthands";

export default function Dashboard() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>();
  const [cpu, setCPU] = useState<number>();
  const [ram, setRAM] = useState<number>();

  const setMembersFromRaw = (members: Member[]): void => {
    members.sort((l, r) => {
      if (!l.online && !r.online) {
        if (!l.offlineSince || !r.offlineSince) {
          console.log("member is offline but offlineSince is not present");
          return 0;
        }

        return Date.parse(r.offlineSince) - Date.parse(l.offlineSince);
      }

      if (l.online !== r.online) return +r.online - +l.online;

      if (!l.onlineSince || !r.onlineSince) {
        console.log("member is online but onlineSince is not present");
        return 0;
      }

      return Date.parse(r.onlineSince) - Date.parse(l.onlineSince);
    });

    setMembers(members);
  };

  useEffect(() => {
    // const api = new MinesinAPI(localStorage.getItem("accessToken") ?? "", router, true);
    const token = localStorage.getItem("accessToken");
    const tokenStatus = checkTokenStatus(token);
    if (tokenStatus !== TokenStatus.Valid) {
      routeLogout(router, tokenStatus || undefined, LogoutOptions.removeToken);
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "https://minesin.krissada.com/api/",
      headers: { Authorization: "Bearer " + token },
    });

    const socket = io("https://minesin.krissada.com", {
      path: "/socket/",
      auth: { token },
    });

    socket.on("connect_error", (error) => {
      console.error(error);
    });

    socket.on("connect", async () => {
      console.log("socket connected");

      // Fetch initial member data
      const { data: members } = await axiosInstance
        .get<Member[]>("/members")
        .catch((err) => {
          apiErrorHandler(router, err);
          return { data: null };
        });

      if (members) setMembersFromRaw(members);
    });

    type ResourcesData = {
      cpuPercent: number;
      ramPercent: number;
    };
    socket.on("resourcesStatus", (resources: ResourcesData) => {
      setCPU(resources.cpuPercent);
      setRAM(resources.ramPercent);
    });

    // socket.on("serversStatus", (statuses) => {

    // })

    socket.on("memberLocationUpdate", (updated: Member) => {
      if (!members) return;
      const index = members.findIndex((m) => m.uuid == updated.uuid);

      if (index != -1) {
        const newMembers = [...members];
        newMembers[index].location = updated.location;
        setMembers(newMembers);
      }
    });

    socket.on("memberStatusUpdate", (updated: Member) => {
      if (!members) return;
      const index = members.findIndex((m) => m.uuid == updated.uuid);

      if (index != -1) {
        const newMembers = [...members];
        newMembers[index].online = updated.online;
        setMembers(newMembers);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnnected");
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Layout
      actions={dashboardActions(router)}
      color="bg-gray-900"
      className="text-white p-4 mx-auto w-full max-w-5xl"
      showToggle
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:flex-wrap gap-4 lg:gap-8 w-full">
        <MembersList className="grow min-w-fit" members={members ?? []} />
        <ResourceBars
          className="grow min-w-2/5"
          usages={{
            cpu: cpu ?? 0,
            ram: ram ?? 0,
          }}
        />
      </div>
    </Layout>
  );
}
