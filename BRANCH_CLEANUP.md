# Branch Cleanup Instructions

## Current Status
- **Local**: Only `main` branch
- **Remote**: `main`, `gh-pages`, and `profile-page.2` (which is the DEFAULT branch)

## To Complete the Cleanup

### Option 1: Using GitHub Web UI (Recommended)
1. Go to: https://github.com/Jviyata/profile-page.2/settings/branches
2. Under "Default branch", change from `profile-page.2` to `main` using the dropdown
3. Click "Update"
4. Then run this command to delete the remote branch:
   ```bash
   git push origin --delete profile-page.2
   ```

### Option 2: Using GitHub API (Requires Personal Access Token)
```bash
export GITHUB_TOKEN="your_personal_access_token_here"

# Update default branch to main
curl -X PATCH \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/Jviyata/profile-page.2 \
  -d '{"default_branch":"main"}'

# Delete profile-page.2 branch
git push origin --delete profile-page.2
```

## Verification
After completing the steps, run:
```bash
git branch -a
```

Expected output:
```
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/gh-pages
  remotes/origin/main
```

## Notes
- `gh-pages` is automatically managed by GitHub Actions (do not delete manually)
- `main` is the authoritative branch with all code
- All development work happens on `main`
- GitHub Actions automatically deploys to `gh-pages` on every push to `main`
