import { UserManager, WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

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
