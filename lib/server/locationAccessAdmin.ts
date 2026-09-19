import { NextResponse } from "next/server";
import type { ApprovalDurationMinutes, LocationAccessRequest } from "@/lib/locationAccess";

function getAdminConfig() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const adminApiKey = process.env.LOCATION_ADMIN_API_KEY;

  if (!backendUrl || !adminApiKey) {
    return null;
  }

  return { backendUrl, adminApiKey };
}

async function proxyAdminRequest(path: string, init?: RequestInit) {
  const config = getAdminConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Admin location access is not configured." },
      { status: 503 },
    );
  }

  const response = await fetch(`${config.backendUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      "X-Admin-Api-Key": config.adminApiKey,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error ?? "Unable to complete the admin request." },
      { status: response.status },
    );
  }

  return NextResponse.json(data, { status: response.status });
}

export async function getLocationAccessRequests() {
  return proxyAdminRequest("/api/location-access/admin/requests");
}

export async function postLocationAccessAction(id: string, action: "deny" | "revoke") {
  return proxyAdminRequest(`/api/location-access/admin/requests/${id}/${action}`, {
    method: "POST",
  });
}

export async function postLocationAccessApproval(
  id: string,
  durationMinutes: ApprovalDurationMinutes,
) {
  return proxyAdminRequest(`/api/location-access/admin/requests/${id}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ durationMinutes }),
  });
}

export type { LocationAccessRequest };
