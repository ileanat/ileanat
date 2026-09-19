export type LocationAccessStatus =
  | "PENDING"
  | "APPROVED"
  | "DENIED"
  | "REVOKED";

export type LocationAccessRequest = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  status: LocationAccessStatus;
  createdAt: string;
  expiresAt: string | null;
};

export type SubmitLocationAccessRequest = {
  name: string;
  email: string;
  message?: string;
};

export type LocationAccessValidationResponse = {
  approved: boolean;
  status: LocationAccessStatus | null;
  expiresAt: string | null;
};

export type ApprovalDurationMinutes = 15 | 60 | 1440 | 0;

export type SubmitLocationAccessResponse = {
  id: string;
  message: string;
};

export async function submitLocationAccessRequest(
  payload: SubmitLocationAccessRequest,
): Promise<SubmitLocationAccessResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error(
      "Location requests are unavailable right now. Please try again later.",
    );
  }

  const response = await fetch(`${backendUrl}/api/location-access/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to submit your request right now.");
  }

  if (!data?.id || !data?.message) {
    throw new Error("Unable to submit your request right now.");
  }

  return data as SubmitLocationAccessResponse;
}

export async function validateLocationAccess(
  token: string,
): Promise<LocationAccessValidationResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error("Location access validation is unavailable right now.");
  }

  const response = await fetch(
    `${backendUrl}/api/location-access/validate?token=${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Unable to validate this access link.");
  }

  if (typeof data?.approved !== "boolean") {
    throw new Error("Unable to validate this access link.");
  }

  return data as LocationAccessValidationResponse;
}

export function formatRequestDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function statusLabel(status: LocationAccessStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "DENIED":
      return "Denied";
    case "REVOKED":
      return "Revoked";
  }
}

export function statusClasses(status: LocationAccessStatus) {
  switch (status) {
    case "PENDING":
      return "border-accent/30 bg-accent/10 text-accent";
    case "APPROVED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "DENIED":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "REVOKED":
      return "border-border bg-background text-muted";
  }
}
