# RULES.md

# GyanMarg --- Project Rules & Engineering Protocol

**Version:** 1.0\
**Status:** Active\
**Project:** GyanMarg\
**Purpose:** Establish non-negotiable rules for development, AI-assisted
coding, documentation, Git workflows, architecture, security, and
project-context continuity.

------------------------------------------------------------------------

# 1. Purpose of This File

`RULES.md` is the operating contract for everyone and every AI coding
agent working on GyanMarg.

It defines:

-   How the project should be developed.
-   How AI agents should reason about changes.
-   How documentation must be maintained.
-   How Git should be used.
-   How multiple workflows/agents should preserve context.
-   What must never be changed casually.
-   How completed work should be recorded.

These rules apply regardless of whether the project is being developed
through:

-   Cursor
-   Windsurf
-   Claude Code
-   Gemini
-   Codex
-   VS Code
-   Other AI coding agents
-   Manual development

------------------------------------------------------------------------

# 2. Source-of-Truth Hierarchy

When information conflicts, use this priority:

``` text
1. Current code and database migrations
2. ARCHITECTURE.md
3. PRD.md
4. DESIGN.md
5. CONTEXT.md
6. RULES.md
7. Other documentation
```

However, **documentation must be updated when implementation changes**.

Do not intentionally allow documentation and implementation to diverge.

If there is uncertainty:

1.  Inspect the current implementation.
2.  Inspect the relevant documentation.
3.  Determine the intended behavior.
4.  Ask before making a high-impact architectural change.

------------------------------------------------------------------------

# 3. Mandatory Context File

The project MUST maintain a separate:

``` text
CONTEXT.md
```

This file is the **continuity layer for the project**.

It exists so that a developer or AI agent can understand the current
state of the project without relying on previous chat history.

## Why CONTEXT.md Exists

AI coding workflows are often fragmented.

For example:

``` text
Agent A
   ↓
implements authentication

Agent B
   ↓
implements assessment

Agent C
   ↓
implements RAG

Developer
   ↓
works on Git branch

Another Agent
   ↓
continues from a new session
```

None of these workflows should depend on conversation memory.

`CONTEXT.md` solves this problem.

------------------------------------------------------------------------

# 4. CONTEXT.md Is Not a Design Document

Do not turn `CONTEXT.md` into another PRD.

`PRD.md` explains:

> What the product should do.

`DESIGN.md` explains:

> How the product should look and behave.

`ARCHITECTURE.md` explains:

> How the system is technically structured.

`RULES.md` explains:

> How the project should be worked on.

`CONTEXT.md` explains:

> **What is happening right now.**

------------------------------------------------------------------------

# 5. Required CONTEXT.md Structure

The project must maintain the following sections:

``` md
# GyanMarg — Current Project Context

## Current Status

## Current Objective

## Completed Work

## Work In Progress

## Next Tasks

## Recent Decisions

## Architecture Changes

## Database Changes

## AI / RAG Changes

## UI / UX Changes

## Git / Branch Status

## Known Issues

## Blockers

## Important Files

## Environment / Configuration Notes

## Open Decisions

## Last Updated
```

------------------------------------------------------------------------

# 6. CONTEXT.md Update Rule

`CONTEXT.md` MUST be updated after any meaningful project change.

Meaningful changes include:

-   New feature implemented.
-   Feature significantly modified.
-   Database schema changed.
-   Migration added.
-   API/service changed.
-   Authentication changed.
-   RAG pipeline changed.
-   AI model/provider changed.
-   Major UI workflow changed.
-   Architecture changed.
-   Security behavior changed.
-   New dependency with architectural significance.
-   Important bug discovered.
-   Important bug fixed.
-   Git branch/workflow changed.
-   Major task completed.
-   Major blocker discovered.

Do not update it for every trivial typo or formatting change.

------------------------------------------------------------------------

# 7. Context Update Protocol

After completing a meaningful task:

``` text
Implement
   ↓
Test
   ↓
Review
   ↓
Update CONTEXT.md
   ↓
Commit
```

Never finish a major task and leave the context file stale.

The context update should describe:

-   What changed.
-   Why it changed.
-   What files changed.
-   What remains.
-   Any decisions made.
-   Any known limitations.

------------------------------------------------------------------------

# 8. CONTEXT.md Must Be Concise

Do not create a giant historical diary.

Bad:

``` text
On Monday we discussed...
Then on Tuesday...
Then the AI suggested...
Then we tried...
```

Good:

``` text
## Current Status

Authentication is implemented using Supabase Auth.

## Completed Work

- Email/password authentication
- Protected dashboard routes
- RLS policies for profiles

## Next Tasks

- Implement target-role selection
- Add competency schema

## Known Issues

- OAuth is not implemented yet
```

The context file should describe **current reality**, not every
conversation.

------------------------------------------------------------------------

# 9. AI Agent Startup Protocol

Every AI coding agent MUST follow this sequence before making
significant changes:

``` text
1. Read RULES.md
2. Read CONTEXT.md
3. Read relevant PRD sections
4. Read relevant DESIGN sections
5. Read relevant ARCHITECTURE sections
6. Inspect existing implementation
7. Understand Git branch/status
8. Plan the change
9. Implement
10. Test
11. Update CONTEXT.md
12. Report changes
```

Do not start coding immediately after opening the repository.

------------------------------------------------------------------------

# 10. Never Assume Previous Chat Context

AI agents must assume:

> **They know nothing that is not represented in the repository.**

Do not rely on:

-   Previous chat messages
-   Memory from another AI session
-   Verbal agreements
-   Uncommitted changes from another workflow
-   Assumptions about architecture

If an important decision is not documented, inspect the implementation
or ask.

------------------------------------------------------------------------

# 11. Git Is Part of the Context System

Git is not just a backup mechanism.

It is part of the project's development workflow.

Every meaningful feature should have a traceable history:

``` text
Requirement
    ↓
Implementation
    ↓
Tests
    ↓
CONTEXT.md
    ↓
Git Commit
```

------------------------------------------------------------------------

# 12. Git Status Must Be Checked Before Work

Before making changes:

``` bash
git status
git branch --show-current
git log -5 --oneline
```

Understand:

-   Current branch.
-   Uncommitted changes.
-   Recent commits.
-   Whether another workflow may already be modifying the repository.

Never blindly reset, checkout, clean, or overwrite changes.

------------------------------------------------------------------------

# 13. Never Destroy Existing Work

Do NOT use destructive Git commands casually.

Avoid:

``` bash
git reset --hard
git clean -fd
git checkout -- .
git restore .
```

unless the user explicitly requests it and the consequences are
understood.

If unexpected changes are found:

1.  Inspect them.
2.  Determine their origin if possible.
3.  Preserve them.
4.  Ask before deleting or overwriting.

------------------------------------------------------------------------

# 14. Branching Strategy

Recommended:

``` text
main
 │
 ├── develop
 │
 ├── feature/auth
 ├── feature/assessment
 ├── feature/competency-engine
 ├── feature/rag
 ├── feature/learning-path
 └── feature/dashboard
```

For a small SIH team, a simpler approach is acceptable:

``` text
main
 ├── feature/*
 └── fix/*
```

Do not create unnecessary branches for tiny changes.

------------------------------------------------------------------------

# 15. Commit Rules

Commits should be:

-   Small enough to understand.
-   Focused on one logical change.
-   Descriptive.
-   Buildable where practical.

Preferred format:

``` text
feat: add competency assessment engine
feat: implement RAG document retrieval
fix: prevent unauthorized profile access
docs: update current project context
refactor: simplify recommendation service
test: add readiness calculation tests
chore: update dependencies
```

Avoid:

``` text
update
changes
final
final2
working
stuff
```

------------------------------------------------------------------------

# 16. Commit Context Updates

When a meaningful task is completed, the context update should normally
be committed with the related work.

Example:

``` text
feat: implement competency gap analysis
```

The same commit may include:

``` text
CONTEXT.md
```

updated to reflect the completed implementation.

For larger milestones, a dedicated documentation commit is also
acceptable.

------------------------------------------------------------------------

# 17. Multiple AI Workflows

GyanMarg may be developed using multiple AI tools simultaneously.

Examples:

``` text
Claude → backend
Cursor → frontend
Codex → debugging
Gemini → research
Developer → Git integration
```

All workflows MUST treat the repository documentation as the shared
memory.

The minimum shared context is:

``` text
RULES.md
CONTEXT.md
PRD.md
DESIGN.md
ARCHITECTURE.md
```

An AI agent must not assume that another agent understands undocumented
decisions.

------------------------------------------------------------------------

# 18. Multi-Agent Handoff Protocol

Before handing work to another agent:

``` text
1. Finish or clearly mark current work.
2. Run relevant tests.
3. Update CONTEXT.md.
4. Record known issues.
5. Record next recommended action.
6. Commit changes where appropriate.
```

Example:

``` md
## Work In Progress

RAG retrieval pipeline is implemented.

## Next Tasks

- Add metadata filtering by competency.
- Add source citation UI.

## Known Issues

- PDF extraction fails for scanned PDFs.
```

The next agent should be able to continue without reading the previous
conversation.

------------------------------------------------------------------------

# 19. Parallel Work Rules

When multiple agents work simultaneously:

### Each agent must know:

-   Current branch.
-   Files being modified.
-   Dependencies on other work.
-   Expected interfaces.
-   Database changes.

Avoid having multiple agents edit the same core file simultaneously
unless necessary.

Prefer clear ownership:

``` text
Agent A → frontend
Agent B → database
Agent C → RAG
Agent D → testing
```

------------------------------------------------------------------------

# 20. Database Migration Rules

Database changes MUST use migrations.

Never make undocumented production schema changes manually.

Migration flow:

``` text
Change schema
    ↓
Create migration
    ↓
Test migration
    ↓
Update relevant documentation
    ↓
Update CONTEXT.md
    ↓
Commit
```

Migration files must be committed to Git.

------------------------------------------------------------------------

# 21. Supabase Rules

Supabase is the primary backend platform for the MVP.

Use it for:

-   PostgreSQL
-   Authentication
-   Row Level Security
-   Storage
-   Edge Functions
-   pgvector

Do not introduce another backend platform without documenting the
architectural reason.

------------------------------------------------------------------------

# 22. Row Level Security

RLS is mandatory for user-owned data.

Never assume frontend authorization is sufficient.

Security must be enforced server-side/database-side.

Example principle:

``` text
Learner
→ Own data

Admin
→ Authorized administrative data

Institution
→ Authorized aggregate data
```

Every new user-sensitive table must be reviewed for RLS.

------------------------------------------------------------------------

# 23. AI Rules

AI must not become the source of truth for deterministic business logic.

Use deterministic application logic for:

-   Competency scoring
-   Gap calculation
-   Readiness calculation
-   Permissions
-   Certificate eligibility
-   Assessment scoring

Use AI for:

-   Explanation
-   Personalization
-   Summarization
-   Tutoring
-   RAG-based question answering
-   Natural-language recommendations

------------------------------------------------------------------------

# 24. RAG Rules

RAG should use approved/controlled knowledge sources for
platform-specific educational answers.

Pipeline:

``` text
Source
 ↓
Ingestion
 ↓
Chunking
 ↓
Embedding
 ↓
pgvector
 ↓
Retrieval
 ↓
LLM
 ↓
Source-aware Response
```

Every RAG implementation should consider:

-   Metadata.
-   Retrieval quality.
-   Source attribution.
-   Access control.
-   Prompt injection.
-   Outdated content.
-   Duplicate content.

------------------------------------------------------------------------

# 25. AI API Key Rules

Never expose privileged AI credentials to the browser.

Never commit secrets.

Never put secrets inside:

-   Git
-   Client-side JavaScript
-   Public configuration
-   Screenshots
-   Documentation

Use environment variables and server-side execution.

------------------------------------------------------------------------

# 26. UI / UX Rules

All UI changes must follow `DESIGN.md`.

Do not introduce a random:

-   Color
-   Font
-   Radius
-   Shadow
-   Button style
-   Card style
-   Icon library

without a reason.

Use the existing GyanMarg design tokens and components.

------------------------------------------------------------------------

# 27. GyanMarg Visual Identity

Primary brand colors:

``` text
Deep Institutional Green
#123C2B

Saffron Gold
#C88719

Warm Ivory
#F5F0E3

Soft White
#FFFDF8
```

The interface should feel:

``` text
Professional
Trustworthy
Modern
Indian
Accessible
Government-ready
```

Avoid:

``` text
Neon AI aesthetics
Excessive gradients
Crypto-style visuals
Generic SaaS purple
Overly playful EdTech UI
Excessive glassmorphism
```

------------------------------------------------------------------------

# 28. Competency-First Rule

Every major learning feature should connect to competency.

Before adding a feature, ask:

``` text
Which competency does this support?
How does it affect learning?
How is improvement measured?
```

If a feature cannot answer these questions, it should be questioned
before implementation.

------------------------------------------------------------------------

# 29. Evidence-First Rule

Course completion does not equal competency.

The platform should prefer evidence such as:

-   Assessment performance
-   Practice performance
-   Projects
-   Reassessment
-   Mentor validation

over:

-   Time spent
-   Number of videos watched
-   Number of pages opened

Engagement metrics are useful but should not be confused with
competency.

------------------------------------------------------------------------

# 30. Recommendation Rules

Recommendations should be explainable.

Bad:

``` text
AI recommends: Statistics Course
```

Good:

``` text
Recommended because:

Your current Statistics proficiency is 46%.
The target role requires 80%.
Probability is a prerequisite for your next learning module.
```

Important recommendations should have a traceable reason.

------------------------------------------------------------------------

# 31. Architecture Rules

Prefer:

``` text
Modular architecture
+
Clear service boundaries
+
Simple infrastructure
```

Avoid premature:

``` text
Microservices
Service mesh
Complex event buses
Unnecessary Kubernetes
Multiple databases
```

The SIH MVP should prioritize:

-   Working product
-   Reliability
-   Demonstrability
-   Maintainability
-   Fast iteration

over architectural complexity.

------------------------------------------------------------------------

# 32. Code Quality

Code should be:

-   Typed.
-   Readable.
-   Modular.
-   Testable.
-   Consistent.
-   Small where practical.

Avoid:

-   Giant components.
-   Duplicated business logic.
-   Hard-coded secrets.
-   Magic numbers.
-   Unnecessary abstractions.
-   Dead code.

------------------------------------------------------------------------

# 33. TypeScript Rules

Prefer strict TypeScript.

Avoid unnecessary:

``` ts
any
```

Use explicit domain types for:

-   Competencies
-   Assessments
-   Learning paths
-   Recommendations
-   AI responses
-   User roles

Types should reflect the domain model.

------------------------------------------------------------------------

# 34. Error Handling

Never silently swallow important errors.

Bad:

``` ts
try {
  await operation()
} catch {}
```

Errors should:

-   Be logged appropriately.
-   Produce useful user feedback.
-   Preserve system state.
-   Avoid leaking sensitive implementation details.

------------------------------------------------------------------------

# 35. Testing Rules

Important business logic MUST have automated tests.

Priority:

``` text
Competency scoring
Gap analysis
Readiness calculation
Recommendation rules
Authorization
RAG retrieval
Assessment submission
```

Before merging major work:

``` text
Lint
Typecheck
Tests
Build
```

------------------------------------------------------------------------

# 36. Dependency Rules

Do not add a dependency simply because it is popular.

Before adding a package, consider:

-   Is it actually necessary?
-   Is the functionality already available?
-   Is it maintained?
-   Does it increase bundle size?
-   Does it introduce security risk?
-   Does it create vendor lock-in?

Document architecturally significant dependencies in `CONTEXT.md`.

------------------------------------------------------------------------

# 37. Documentation Rules

Documentation is part of implementation.

At minimum maintain:

``` text
README.md
PRD.md
DESIGN.md
ARCHITECTURE.md
RULES.md
CONTEXT.md
```

When implementation changes the documented behavior, update the relevant
document.

------------------------------------------------------------------------

# 38. Documentation Ownership

### PRD.md

Product requirements.

### DESIGN.md

UI/UX and design system.

### ARCHITECTURE.md

Technical architecture.

### RULES.md

Development rules.

### CONTEXT.md

Current implementation state.

### README.md

Developer/project onboarding.

Do not duplicate entire documents into each other.

------------------------------------------------------------------------

# 39. Open Decisions

Do not silently make high-impact decisions.

Examples:

-   Changing the database.
-   Changing authentication architecture.
-   Replacing Supabase.
-   Introducing microservices.
-   Changing the competency model.
-   Changing AI provider architecture.
-   Changing certificate trust model.

Record the decision in:

``` text
CONTEXT.md
```

and, when appropriate, update:

``` text
ARCHITECTURE.md
PRD.md
```

------------------------------------------------------------------------

# 40. Research vs Implementation

Research should inform implementation, not become an excuse to delay it.

Use this cycle:

``` text
Research
 ↓
Decision
 ↓
Document
 ↓
Implement
 ↓
Validate
```

Do not repeatedly research the same decision after a reasonable
architecture has already been selected.

------------------------------------------------------------------------

# 41. Do Not Over-Engineer

The team should constantly ask:

> **Does this complexity improve the product enough to justify itself?**

If not, don't build it.

For the SIH MVP, prioritize:

``` text
Core competency loop
>
AI/RAG quality
>
Assessment quality
>
UX clarity
>
Security
>
Reliability
>
Extra features
```

------------------------------------------------------------------------

# 42. Do Not Build Features Just for the Demo

A feature should have a real product reason.

Avoid adding:

-   Fake AI
-   Decorative analytics
-   Meaningless gamification
-   Fake blockchain
-   Artificial complexity
-   Screens that do not connect to the core learning loop

The demo should represent the actual product.

------------------------------------------------------------------------

# 43. Definition of Done

A feature is not done when the UI exists.

A feature is done when:

``` text
Requirement understood
        ↓
Implementation complete
        ↓
Edge cases considered
        ↓
Security considered
        ↓
Tests added/updated
        ↓
Documentation updated
        ↓
CONTEXT.md updated
        ↓
Git changes reviewed
        ↓
Commit created
```

------------------------------------------------------------------------

# 44. Pre-Merge Checklist

Before merging:

``` text
[ ] Feature matches PRD
[ ] UI matches DESIGN.md
[ ] Architecture remains consistent
[ ] No secrets committed
[ ] RLS/security reviewed
[ ] Error handling implemented
[ ] Tests pass
[ ] Typecheck passes
[ ] Build passes
[ ] CONTEXT.md updated
[ ] Relevant documentation updated
[ ] Git diff reviewed
```

------------------------------------------------------------------------

# 45. Context Integrity Check

Before switching workflows or handing the repository to another agent:

``` text
[ ] Current objective recorded
[ ] Completed work recorded
[ ] Remaining work recorded
[ ] Known issues recorded
[ ] Architecture decisions recorded
[ ] Database changes recorded
[ ] Git branch recorded
[ ] Uncommitted work understood
[ ] CONTEXT.md saved
```

This is mandatory for meaningful handoffs.

------------------------------------------------------------------------

# 46. Emergency / Conflicting Changes

If an agent discovers:

-   Unexpected modifications
-   Conflicting migrations
-   Broken builds
-   Unknown branches
-   Uncommitted work
-   Conflicting architecture
-   Potential data loss

STOP before performing destructive operations.

Record the issue in:

``` text
CONTEXT.md
```

Then determine the safest resolution.

------------------------------------------------------------------------

# 47. Context Update Template

After a major task, update `CONTEXT.md` using this pattern:

``` md
## Current Status

<one or two sentences>

## Completed Work

- <completed item>
- <completed item>

## Work In Progress

- <current item>

## Next Tasks

1. <next task>
2. <next task>

## Recent Decisions

- <decision and reason>

## Architecture Changes

- <change or "None">

## Database Changes

- <migration/change or "None">

## AI / RAG Changes

- <change or "None">

## UI / UX Changes

- <change or "None">

## Git / Branch Status

- Branch: `<branch>`
- Latest relevant commit: `<commit>`

## Known Issues

- <issue or "None">

## Blockers

- <blocker or "None">

## Last Updated

<YYYY-MM-DD>
```

------------------------------------------------------------------------

# 48. Rule for AI-Generated Changes

An AI agent must not make broad unrelated changes while implementing a
task.

If the task is:

> Implement assessment scoring.

Do not simultaneously:

-   Redesign the entire dashboard.
-   Replace the database library.
-   Refactor unrelated components.
-   Change authentication.
-   Rename unrelated files.

Keep the change focused.

If an unrelated issue is discovered, record it in `CONTEXT.md` or create
a separate task.

------------------------------------------------------------------------

# 49. Rule for Uncertainty

When uncertain about a high-impact decision:

``` text
Do not guess.
Do not silently choose.
Do not hide the uncertainty.
```

Instead:

1.  Inspect existing code/documentation.
2.  Determine whether the decision is already established.
3.  If not, present the options and trade-offs.
4.  Make the decision explicit.
5.  Record it in `CONTEXT.md`.

------------------------------------------------------------------------

# 50. Final Operating Principle

GyanMarg is developed as a **single evolving system**, even when many
people and AI agents work on it.

The repository must therefore remain understandable without relying on:

-   One person's memory.
-   One AI conversation.
-   One development environment.
-   One coding tool.

The permanent continuity chain is:

``` text
RULES.md
   ↓
CONTEXT.md
   ↓
PRD.md
   ↓
DESIGN.md
   ↓
ARCHITECTURE.md
   ↓
CODE
   ↓
TESTS
   ↓
GIT HISTORY
```

And after every meaningful change:

``` text
CODE
 ↓
TEST
 ↓
UPDATE CONTEXT
 ↓
COMMIT
```

> **If the next developer or AI agent cannot understand the current
> state of GyanMarg from the repository, the project documentation is
> incomplete.**
