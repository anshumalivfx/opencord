import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { v4 as v4uuid } from "uuid";

export const POST = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();
    if (!profile) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: v4uuid(),
        channels: {
          create: {
            name: "general",
            profileId: profile.id,
          },
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
            userId: profile.userId,
          },
        },
      },
    });
    return Response.json(server, {
      status: 201,
    });
  } catch (error) {
    console.log("[SERVER_POST]", error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      serverid: searchParams.get("serverid"),
    };
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile)
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    const server = await db.server.findUnique({
      where: {
        id: queryParam.serverid as string,
        profileId: profile.id,
      },
    });
    if (!server)
      return Response.json(
        {
          message: ("Server not found" + queryParam.serverid) as string,
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
        name,
        imageUrl,
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
    return Response.json(
      {
        message: "Internal Error",
      },
      {
        status: 500,
      }
    );
  }
}
