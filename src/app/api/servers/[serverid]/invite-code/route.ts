import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";

export async function PATCH(
  req: Request,
  { params }: { params: { serverid: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return Response.json(
        {
          error: "[UNAUTHORIZED] You must be logged in to perform this action.",
        },
        { status: 401 }
      );
    }
    if (!params.serverid) {
      return Response.json(
        { error: "Server ID is required." },
        { status: 400 }
      );
    }
    const server = await db.server.update({
      where: {
        id: params.serverid,
        profileId: profile.id,
      },
      data: {
        inviteCode: randomUUID(),
      },
    });
    return Response.json(server, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error: "An error occurred while trying to generate a new invite code.",
      },
      { status: 500 }
    );
  }
}
