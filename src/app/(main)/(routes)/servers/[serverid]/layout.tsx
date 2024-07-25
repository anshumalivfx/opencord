import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const ServerLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string; id: string };
}) => {
  const profile = await params;
  if (!profile) return redirectToSignIn();

  const serverDB = await db.server.findUnique({
    where: {
      id: profile.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!serverDB) return redirect("/");

  return (
    <div className="h-full ">
      <div className="hidden md:flex h-full w-60"></div>
      {children}
    </div>
  );
};

export default ServerLayout;
