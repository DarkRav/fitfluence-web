import { UserManager, WebStorageStateStore, type UserManagerSettings } from "oidc-client-ts";

const oidcSettings: UserManagerSettings = {
  authority: process.env.NEXT_PUBLIC_OIDC_ISSUER ?? "",
  client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "",
  redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI ?? "",
  response_type: "code",
  scope: "openid profile email",
  post_logout_redirect_uri: `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.sessionStorage })
      : undefined,
  automaticSilentRenew: true,
  revokeTokensOnSignout: true,
  loadUserInfo: true,
};

export const oidcUserManager = new UserManager(oidcSettings);
