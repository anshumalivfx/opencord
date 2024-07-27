import { currentProfile } from "@/lib/currentProfile";

export async function PATCH(
  Req: Request,
  { params }: { params: { memberid: string } }
) {
  try {
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
