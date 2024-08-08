"use server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

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

    if (!name) {
      return Response.json(
        {
          message: "Channel name missing",
        },
        {
          status: 400,
        }
      );
    }

    if (name === "general") {
      return Response.json(
        {
          message: "Name cannot be 'general'",
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
  } catch (error) {
    console.log("CHANNEL_POST: ", error);
    return Response.json(
      {
        message: "Internal Server Error on Creating new Channel",
      },
      {
        status: 500,
      }
    );
  }
}
