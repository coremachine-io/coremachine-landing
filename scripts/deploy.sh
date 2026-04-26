#!/bin/bash
# =============================================================================
# Core Machine - Full Deployment Automation
# =============================================================================
# Usage: ./scripts/deploy.sh
# Requirements:
#   - GITHUB_PAT env var (GitHub Personal Access Token)
#   - VERCEL_TOKEN env var (Vercel API Token)
#   - VERCEL_TEAM_ID env var (Vercel Team ID)
#   - PROJECT_ID env var (Vercel Project ID)
# =============================================================================

set -e

GITHUB_PAT="${GITHUB_PAT:-}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_TEAM_ID="${VERCEL_TEAM_ID:-}"
PROJECT_ID="${PROJECT_ID:-prj_FVqtI4hccbRfjNF2legspaUc2nkA}"
REPO="coremachine-io/coremachine-landing"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check required env vars
if [ -z "$GITHUB_PAT" ] || [ -z "$VERCEL_TOKEN" ]; then
    error "Missing required environment variables!"
    error "Required: GITHUB_PAT, VERCEL_TOKEN"
    exit 1
fi

cd /Users/coremachine/coremachine-landing

log "=== Step 1: Build ==="
pnpm run build

log "=== Step 2: Git Status ==="
git status --short

log "=== Step 3: Check if there are changes to commit ==="
if git diff --stat | grep -q "^[0-9]"; then
    log "Changes detected, committing..."
    git add -A
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
else
    warn "No changes to commit"
fi

log "=== Step 4: Push to GitHub ==="
git push origin main

log "=== Step 5: Trigger Vercel Deployment ==="
# Get current commit
COMMIT_SHA=$(git rev-parse HEAD)
log "Commit SHA: $COMMIT_SHA"

# Get repo ID
REPO_ID=$(curl -s -H "Authorization: token $GITHUB_PAT" \
  "https://api.github.com/repos/$REPO" | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('node_id','R_kgDOSEXL6A'))" 2>/dev/null || echo "R_kgDOSEXL6A")

# Create new Vercel deployment
RESPONSE=$(curl -s -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"coremachine-landing\",
    \"gitSource\": {
      \"type\": \"github\",
      \"repo\": \"$REPO\",
      \"ref\": \"main\",
      \"repoId\": \"$REPO_ID\"
    },
    \"project\": \"$PROJECT_ID\"
  }")

DEPLOYMENT_URL=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('url','ERROR'))" 2>/dev/null || echo "ERROR")
DEPLOYMENT_ID=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin).get('id','ERROR'))" 2>/dev/null || echo "ERROR")

if [ "$DEPLOYMENT_URL" != "ERROR" ]; then
    log "Deployment triggered successfully!"
    log "Deployment ID: $DEPLOYMENT_ID"
    log "Dashboard: https://vercel.com/coremachine-ios-projects/coremachine-landing/$DEPLOYMENT_ID"
    
    log "=== Step 6: Wait for deployment (polling every 30s) ==="
    while true; do
        sleep 30
        STATUS=$(curl -s "https://api.vercel.com/v6/deployments/$DEPLOYMENT_ID" \
          -H "Authorization: Bearer $VERCEL_TOKEN" 2>/dev/null | \
          python3 -c "import sys,json; print(json.load(sys.stdin).get('readyState','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
        
        if [ "$STATUS" = "READY" ]; then
            log "=== Deployment COMPLETE ==="
            log "Live URL: https://$DEPLOYMENT_URL"
            log "coremachine.io: https://coremachine.io"
            break
        elif [ "$STATUS" = "ERROR" ]; then
            error "Deployment failed! Check dashboard."
            break
        else
            echo -n "."
        fi
    done
else
    error "Failed to trigger deployment!"
    error "Response: $RESPONSE"
fi

log "=== Done ==="
