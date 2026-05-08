#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
BASE_URL="${BASE_URL%/}"
COOKIE_JAR="$(mktemp)"
BODY_FILE="$(mktemp)"

cleanup() {
  rm -f "$COOKIE_JAR" "$BODY_FILE"
}
trap cleanup EXIT

request() {
  local method="$1"
  local path="$2"
  local body="${3:-}"

  if [[ -n "$body" ]]; then
    curl -sS -o "$BODY_FILE" -w "%{http_code}" -X "$method" \
      -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
      -H "Content-Type: application/json" \
      --data "$body" \
      "$BASE_URL$path"
  else
    curl -sS -o "$BODY_FILE" -w "%{http_code}" -X "$method" \
      -b "$COOKIE_JAR" -c "$COOKIE_JAR" \
      "$BASE_URL$path"
  fi
}

expect_status() {
  local actual="$1"
  local expected="$2"
  local label="$3"

  if [[ "$actual" != "$expected" ]]; then
    echo "✗ $label returned HTTP $actual"
    cat "$BODY_FILE"
    echo
    exit 1
  fi
}

expect_body_contains() {
  local pattern="$1"
  local label="$2"

  if ! grep -q "$pattern" "$BODY_FILE"; then
    echo "✗ $label"
    cat "$BODY_FILE"
    echo
    exit 1
  fi
}

mask_code() {
  local code="$1"
  echo "${code:0:4} **** **** ${code: -4}"
}

echo "Access-code smoke test: $BASE_URL"

status="$(request POST /api/access/create)"
expect_status "$status" "200" "create access code"
access_code="$(sed -n 's/.*"accessCode":"\([^"]*\)".*/\1/p' "$BODY_FILE")"
if [[ ! "$access_code" =~ ^[0-9]{4}\ [0-9]{4}\ [0-9]{4}\ [0-9]{4}$ ]]; then
  echo "✗ create response did not include a formatted access code"
  cat "$BODY_FILE"
  echo
  exit 1
fi
echo "✓ create access code ($(mask_code "$access_code"))"

status="$(request GET /api/access/me)"
expect_status "$status" "200" "session after create"
expect_body_contains '"loggedIn":true' "session should be active after create"
echo "✓ session is active after create"

sample_progress='{"progress":{"completedLessons":["urgent"],"unlockedLessons":["urgent","links"],"lessonScores":{"urgent":{"correct":5,"total":5,"stars":3,"completedAt":"2026-05-08T00:00:00.000Z"}},"totalStars":3,"lastPlayedAt":"2026-05-08T00:00:00.000Z","streak":1,"language":"uk","textSize":"normal","soundEnabled":true}}'
status="$(request PUT /api/progress "$sample_progress")"
expect_status "$status" "200" "save progress"
expect_body_contains '"ok":true' "save progress should return ok"
echo "✓ save progress"

status="$(request GET /api/progress)"
expect_status "$status" "200" "load progress"
expect_body_contains '"totalStars":3' "loaded progress should match saved progress"
echo "✓ load progress"

status="$(request POST /api/access/logout)"
expect_status "$status" "200" "logout"
expect_body_contains '"ok":true' "logout should return ok"
echo "✓ logout"

status="$(request GET /api/access/me)"
expect_status "$status" "200" "session after logout"
expect_body_contains '"loggedIn":false' "session should be inactive after logout"
echo "✓ session is inactive after logout"

status="$(request POST /api/access/login '{"code":"123"}')"
expect_status "$status" "400" "invalid short code"
echo "✓ invalid short code is rejected"

status="$(request POST /api/access/login "{\"code\":\"$access_code\"}")"
expect_status "$status" "200" "login with created code"
expect_body_contains '"ok":true' "login should return ok"
echo "✓ login with created code"

status="$(request GET /api/progress)"
expect_status "$status" "200" "load progress after login"
expect_body_contains '"totalStars":3' "progress should persist after logout/login"
echo "✓ progress persists after logout/login"

status="$(request POST /api/access/delete)"
expect_status "$status" "200" "delete access account"
expect_body_contains '"ok":true' "delete access account should return ok"
echo "✓ delete access account"

echo "Access-code smoke test passed."
