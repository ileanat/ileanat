import { postLocationAccessApproval } from "@/lib/server/locationAccessAdmin";
import type { ApprovalDurationMinutes } from "@/lib/locationAccess";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedDurations: ApprovalDurationMinutes[] = [15, 60, 1440, 0];

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.durationMinutes !== "number" ||
    !allowedDurations.includes(body.durationMinutes)
  ) {
    return Response.json(
      {
        error:
          "Approval duration must be 15 minutes, 1 hour, 24 hours, or until revoked.",
      },
      { status: 400 },
    );
  }

  return postLocationAccessApproval(id, body.durationMinutes);
}
