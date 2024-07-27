import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverid: string } }
) {
  try {
    const profile = await currentProfile();
    const { id, values } = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const server = await db.server.findUnique({
      where: {
        id: id,
        profileId: profile.id,
      },
    });
    if (!server)
      return Response.json(
        {
          message: "Server not found" + params.serverid,
        },
        {
          status: 404,
        }
      );

    const updateServer = await db.server.update({
      where: {
        id: server.id,
        profileId: profile.id,
      },
      data: {
        name: values.name,
        imageUrl: values.imageUrl,
      },
    });

    return Response.json(
      {
        ...updateServer,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
