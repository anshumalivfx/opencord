import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {  redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface InviteCodePageProps {
  params: {
    invitecode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  if (!params.invitecode) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.invitecode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  const server = await db.server.update({
      where: {
        inviteCode: params.invitecode,
      },
      data: {
        members: {
          create: {
            profileId: profile.id,
          },
        },
      },
    });
  return <div>InviteCodePage</div>;
};

export default InviteCodePage;
