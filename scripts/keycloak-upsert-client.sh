#!/usr/bin/env bash
set -euo pipefail

KEYCLOAK_BASE_URL="${KEYCLOAK_BASE_URL:-http://localhost:9990}"
REALM="${REALM:-fitfluence}"
CLIENT_ID="${CLIENT_ID:-fitfluence-web-admin}"
REDIRECT_URI="${REDIRECT_URI:-http://localhost:3000/auth/callback}"
WEB_ORIGIN="${WEB_ORIGIN:-http://localhost:3000}"
ADMIN_USER="${ADMIN_USER:-}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

if [[ -z "$ADMIN_USER" || -z "$ADMIN_PASSWORD" ]]; then
  echo "Set ADMIN_USER and ADMIN_PASSWORD env vars."
  exit 1
fi

TOKEN_RESPONSE="$(
  curl -sS -X POST \
    "${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=${ADMIN_USER}" \
    -d "password=${ADMIN_PASSWORD}" \
    -d "grant_type=password" \
    -d "client_id=admin-cli"
)"

ACCESS_TOKEN="$(echo "$TOKEN_RESPONSE" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')"
if [[ -z "$ACCESS_TOKEN" ]]; then
  echo "Failed to get admin token."
  echo "$TOKEN_RESPONSE"
  exit 1
fi

CLIENT_QUERY_RESPONSE="$(
  curl -sS \
    "${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/clients?clientId=${CLIENT_ID}" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
)"

if echo "$CLIENT_QUERY_RESPONSE" | grep -q "\"clientId\":\"${CLIENT_ID}\""; then
  echo "Client '${CLIENT_ID}' already exists in realm '${REALM}'."
  exit 0
fi

curl -sS -o /dev/null -w "%{http_code}" \
  -X POST "${KEYCLOAK_BASE_URL}/admin/realms/${REALM}/clients" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"clientId\": \"${CLIENT_ID}\",
    \"name\": \"Fitfluence Web Admin\",
    \"enabled\": true,
    \"publicClient\": true,
    \"standardFlowEnabled\": true,
    \"directAccessGrantsEnabled\": false,
    \"implicitFlowEnabled\": false,
    \"serviceAccountsEnabled\": false,
    \"redirectUris\": [\"${REDIRECT_URI}\"],
    \"webOrigins\": [\"${WEB_ORIGIN}\"],
    \"attributes\": {
      \"pkce.code.challenge.method\": \"S256\"
    }
  }" | {
  read -r status
  if [[ "$status" != "201" ]]; then
    echo "Failed to create client. HTTP $status"
    exit 1
  fi
}

echo "Client '${CLIENT_ID}' created in realm '${REALM}'."
