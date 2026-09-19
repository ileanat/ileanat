import { getLocationAccessRequests } from "@/lib/server/locationAccessAdmin";

export async function GET() {
  return getLocationAccessRequests();
}
