import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function PATCH(
  Req: Request,
  { params }: { params: { memberid: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(Req.url);
    const { role } = await Req.json();

    const serverId = searchParams.get("serverId");

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

    if (!serverId) {
      return Response.json(
        {
          message: "Serverid missing",
        },
        {
          status: 400,
        }
      );
    }

    if (!params.memberid) {
      return Response.json(
        {
          message: "Memberid missing",
        },
        {
          status: 400,
        }
      );
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) {
      return Response.json(
        {
          message: "Server not found",
        },
        {
          status: 404,
        }
      );
    }

    const updateMember = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberid,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return Response.json(
      {
        ...updateMember,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
