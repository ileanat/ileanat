import { postLocationAccessAction } from "@/lib/server/locationAccessAdmin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return postLocationAccessAction(id, "revoke");
}
