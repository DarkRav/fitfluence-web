import { UserManager, WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

function ensureRandomUuid(): void {
  if (typeof window === "undefined") {
    return;
  }

  const cryptoRef = window.crypto as Crypto & { randomUUID?: () => string };
  if (typeof cryptoRef?.randomUUID === "function") {
    return;
  }
  if (typeof cryptoRef?.getRandomValues !== "function") {
    return;
  }

  cryptoRef.randomUUID = () => {
    const bytes = new Uint8Array(16);
    cryptoRef.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0"));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
  };
}

ensureRandomUuid();

const runtimeOrigin = typeof window !== "undefined" ? window.location.origin : "";
const redirectUri = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI ?? `${runtimeOrigin}/auth/callback`;
const postLogoutRedirectUri = `${runtimeOrigin}/login`;
const scope = process.env.NEXT_PUBLIC_OIDC_SCOPE ?? "openid";

const oidcSettings: UserManagerSettings = {
  authority: process.env.NEXT_PUBLIC_OIDC_ISSUER ?? "",
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "",
  redirect_uri: redirectUri,
  response_type: "code",
  scope,
  post_logout_redirect_uri: postLogoutRedirectUri,
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.sessionStorage })
      : undefined,
  automaticSilentRenew: true,
  revokeTokensOnSignout: true,
  loadUserInfo: true,
};

export const oidcUserManager = new UserManager(oidcSettings);

export function buildRegistrationUrl(): string | null {
  const authority = process.env.NEXT_PUBLIC_OIDC_ISSUER ?? "";
  const clientId = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "";
  if (!authority || !clientId) {
    return null;
  }

  const url = new URL(`${authority.replace(/\/$/, "")}/protocol/openid-connect/registrations`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", redirectUri);
  return url.toString();
}
