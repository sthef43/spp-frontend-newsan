---
description: Group changes into semantic commits and push
rules: all of commits in spanish
---

Group all current changes into meaningful semantic commits and push the current branch.

Optional context for coommits message: `$ARGUMENTS`

Rules:

- Firts inspect the full repository state:
  - `git status --short`
  - `git diff --stat`
  - `git diff`
  - `git log --oneline -10`
- Identify related files groups by intent: feature, fix, refactor, test, docs, chore, release, or config.
- Create multiple commits when there are independment changes. Do not mix unrelated changes in the same commit.
- If `$ARGUMENTS` is not empty, use it as context to adjust commit messages, but do not force that text if it does
  not accuratley describe the changes.
- Use clear, semantic, concise commit messages that follow the repo's recent style.
- Before comiiting, check for sensitive or suspicious files (`.env`, tokens, credentials, keys, secrets). if any appear, stop and ask.
- Include new, modified, and delted files that belong to each group.
- Do not reverts existing changes.
- Do not use `--no-verify`.
- Do not amend commits.
- Do not force push.

Flow.

1. Show the proposed commit plan with the files included in each commit.
2. If the grouping is clear, continue. If there is real ambiguity, ask before commiting.
3. For each group:

- Add only the files for that group with `git add <files>`.
- Create the commit with a semantic message.

4. Once all commits have benn created, run:
   `git push`
5. When finished, summarize the commits created and the all files changed in the push:
