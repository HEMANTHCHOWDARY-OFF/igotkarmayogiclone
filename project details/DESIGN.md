# DESIGN.md

# GyanMarg --- Design System & UX Specification

**Version:** 1.0\
**Status:** Proposed\
**Product:** GyanMarg\
**Platform:** AI-Powered Competency Intelligence & Personalized Learning
Platform\
**Design Direction:** Government-grade trust + modern technology +
Indian visual identity

------------------------------------------------------------------------

## 1. Design Vision

GyanMarg should feel like a **credible national skill-development
platform**, not a generic EdTech product or an AI chatbot wrapped in a
dashboard.

The visual experience must communicate:

-   Trust
-   Competence
-   Accessibility
-   Progress
-   Inclusion
-   Institutional credibility
-   Modern technology
-   Indian identity

The interface should balance **government/public-sector seriousness**
with the clarity and polish expected from a modern digital product.

### Core UX Principle

> **Every screen should help the learner understand where they are, what
> they need to improve, and what they should do next.**

------------------------------------------------------------------------

# 2. Brand Identity

## 2.1 Product Name

**GyanMarg**

Meaning:

-   **Gyan** --- knowledge
-   **Marg** --- path

The name represents a guided path from knowledge to competency and
ultimately to role readiness.

## 2.2 Brand Personality

GyanMarg should be:

-   Professional
-   Trustworthy
-   Intelligent
-   Encouraging
-   Inclusive
-   Clear
-   Purpose-driven
-   Government-ready

Avoid making the product feel:

-   Childish
-   Overly playful
-   Startup-hyped
-   Crypto-like
-   Excessively futuristic
-   Like a generic AI wrapper

------------------------------------------------------------------------

# 3. Visual Language

The primary visual language combines:

### Indian Institutional

-   Deep green
-   Saffron/gold accents
-   Warm ivory/cream backgrounds
-   Subtle Indian-inspired geometric details

### Modern Technology

-   Clean cards
-   Strong typography
-   Structured data visualization
-   Soft borders
-   Controlled use of gradients
-   Minimal shadows
-   Clear information hierarchy

### Human Learning

-   Friendly illustrations
-   Human-centered imagery
-   Progress indicators
-   Encouraging microcopy
-   Clear next actions

------------------------------------------------------------------------

# 4. Color System

## 4.1 Primary Brand Accent

**Saffron Gold**

``` text
#C88719
```

Use for:

-   Primary CTAs
-   Important highlights
-   Active states
-   Progress emphasis
-   Achievement indicators
-   Selected navigation items
-   Important data points

Do not use it for large text blocks or excessive backgrounds.

------------------------------------------------------------------------

## 4.2 Primary Structural Color

**Deep Institutional Green**

``` text
#123C2B
```

Use for:

-   Header
-   Navigation
-   Major headings
-   Primary dark surfaces
-   Brand elements
-   High-importance status elements

------------------------------------------------------------------------

## 4.3 Supporting Colors

### Warm Ivory

``` text
#F5F0E3
```

Use as the main page background for public-facing and marketing screens.

### Soft White

``` text
#FFFDF8
```

Use for:

-   Cards
-   Content panels
-   Forms
-   Learning surfaces

### Deep Text

``` text
#1B241F
```

Use for primary text.

### Secondary Text

``` text
#68736C
```

Use for supporting descriptions and metadata.

### Border

``` text
#DCD7CA
```

Use for subtle separators and card borders.

### Success

``` text
#2F7D52
```

### Warning

``` text
#B7791F
```

### Error

``` text
#B84040
```

### Informational

``` text
#386B82
```

------------------------------------------------------------------------

# 5. Color Usage Ratio

Recommended approximate distribution:

``` text
Warm Ivory / White      60–70%
Deep Green              15–20%
Neutral surfaces        10–15%
Saffron Gold             5–10%
Status colors             <5%
```

Saffron should be an **accent**, not the dominant page color.

The design should remain professional even when all decorative elements
are removed.

------------------------------------------------------------------------

# 6. Typography

## Primary Typeface

Use a highly readable modern sans-serif.

Recommended:

``` text
Inter
```

Fallback:

``` text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

For Hindi/Indian-language content, use a font stack with strong Indic
support, such as:

``` text
Noto Sans Devanagari
Noto Sans
system-ui
sans-serif
```

The product must not depend on decorative fonts.

------------------------------------------------------------------------

# 7. Type Scale

## Display

``` text
48–64px
Line height: 1.05–1.15
Weight: 700
```

Use for major landing-page statements.

## H1

``` text
36–48px
Weight: 700
```

## H2

``` text
28–36px
Weight: 700
```

## H3

``` text
20–24px
Weight: 650–700
```

## Body

``` text
16px
Line height: 1.5–1.7
Weight: 400
```

## Small

``` text
13–14px
Line height: 1.4–1.5
```

Avoid excessive font-size variation.

------------------------------------------------------------------------

# 8. Layout System

Use a consistent responsive grid.

## Desktop

``` text
Max content width: 1280px
Side padding: 32–48px
Grid gap: 24px
```

## Tablet

``` text
Side padding: 24px
Grid gap: 20px
```

## Mobile

``` text
Side padding: 16px
Grid gap: 16px
```

The interface must never feel cramped.

------------------------------------------------------------------------

# 9. Spacing System

Use a 4px base spacing unit.

``` text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
96px
```

Prefer consistent spacing tokens rather than arbitrary values.

------------------------------------------------------------------------

# 10. Border Radius

Use restrained rounding.

``` text
Small controls: 8px
Inputs: 10px
Cards: 14–16px
Large panels: 20px
Pills: 999px
```

Avoid excessive rounded containers that make the application look
playful.

------------------------------------------------------------------------

# 11. Shadows

Use subtle elevation.

Preferred:

``` text
0 2px 8px rgba(18, 60, 43, 0.06)
```

For elevated surfaces:

``` text
0 8px 24px rgba(18, 60, 43, 0.08)
```

Avoid strong floating shadows.

------------------------------------------------------------------------

# 12. Public Website

The landing page should immediately communicate:

> **Diagnose skill gaps. Master core competencies. Build your path to
> role readiness.**

## Hero Structure

``` text
┌────────────────────────────────────────────────────────────┐
│ LOGO   Student Portal   Admin Portal   Language   Sign In  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  AI-POWERED COMPETENCY INTELLIGENCE PLATFORM               │
│                                                            │
│  Diagnose Skill Gaps.                                      │
│  Master Core Competencies.                                 │
│  For Every Learner.                                        │
│                                                            │
│  Short product explanation                                 │
│                                                            │
│  [ Start Assessment ]   [ Explore Platform ]               │
│                                                            │
│                              Human learning illustration    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

The hero should not contain too many buttons.

Primary CTA:

**Start Free Assessment**

Secondary CTA:

**Explore Platform**

------------------------------------------------------------------------

# 13. Landing Page Sections

Recommended sequence:

1.  Hero
2.  How GyanMarg Works
3.  Competency Intelligence
4.  Skill Gap Analysis
5.  Personalized Learning
6.  AI Learning Assistant
7.  Continuous Reassessment
8.  Role Readiness
9.  Certificates & Achievements
10. Institutional Intelligence
11. Trust / methodology
12. Final CTA
13. Footer

------------------------------------------------------------------------

# 14. Core Product Flow

The product's central visual narrative should always be:

``` text
ASSESS
   ↓
DIAGNOSE
   ↓
PERSONALIZE
   ↓
LEARN
   ↓
PRACTICE
   ↓
REASSESS
   ↓
IMPROVE
   ↓
ROLE READY
```

This flow should appear in onboarding, dashboard explanations, marketing
pages, and the SIH presentation.

------------------------------------------------------------------------

# 15. Student Portal

The student portal is the primary application.

## Navigation

Desktop sidebar:

``` text
GyanMarg

Overview
My Learning
Assessments
Competencies
Skill Gaps
AI Assistant
Practice
Progress
Achievements
Certificates

────────────

Target Role
Profile
Settings
```

Mobile:

-   Bottom navigation for the most important actions.
-   Drawer for secondary navigation.

------------------------------------------------------------------------

# 16. Student Dashboard

The dashboard should answer five questions immediately:

1.  What is my target role?
2.  How ready am I?
3.  What are my biggest skill gaps?
4.  What am I learning now?
5.  What should I do next?

## Dashboard Layout

``` text
┌─────────────────────────────────────────────────────────┐
│ Good morning, Learner                                   │
│ Target Role: Data Analyst                               │
├─────────────────────────┬───────────────────────────────┤
│ Role Readiness          │ Overall Competency             │
│                         │                               │
│       73%               │       68%                    │
│   ↑ +12%                │   ↑ +8%                      │
├─────────────────────────┴───────────────────────────────┤
│                                                         │
│ Your Priority Skill Gaps                                │
│                                                         │
│ Statistics       █████░░░░░ 48%                         │
│ Visualization    ████░░░░░ 39%                         │
│ Python           ██████░░░░ 61%                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ Continue Learning                                       │
│ Statistics Fundamentals                                 │
│ [ Continue ]                                            │
├─────────────────────────────────────────────────────────┤
│ Recommended Next Action                                 │
│ Complete Probability Practice                            │
│ [ Start Practice ]                                      │
└─────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 17. Competency Dashboard

Competency should be visualized as measurable capability rather than
course completion.

## Skill Card

``` text
SQL

Current: 78%
Required: 80%

████████████████░░

Status: Near Target

[ View Evidence ]
```

Each competency can show:

-   Current proficiency
-   Required proficiency
-   Gap
-   Trend
-   Assessment confidence
-   Evidence count
-   Last assessed date

------------------------------------------------------------------------

# 18. Competency Matrix

Use a matrix for role readiness.

``` text
                    Required   Current   Gap       Status

SQL                   80%        78%       2%      Near Target
Python                85%        61%      24%      Developing
Statistics            80%        46%      34%      Critical
Visualization         75%        39%      36%      Critical
```

Status should use both:

-   Text
-   Icon
-   Color

Never rely on color alone.

------------------------------------------------------------------------

# 19. Skill Gap Experience

The skill-gap page is one of the most important screens.

It should make gaps actionable.

Example:

``` text
STATISTICS

Required proficiency       80%
Current proficiency        46%
Gap                        34%

Why this matters
Statistics is a high-priority competency for your target role.

Recommended path

1. Probability Fundamentals
2. Descriptive Statistics
3. Applied Statistics
4. Practice Assessment

Estimated effort: 6 hours

[ Start Learning ]
```

Avoid simply displaying charts without an action.

------------------------------------------------------------------------

# 20. Assessment UX

Assessment screens should feel focused and distraction-free.

## Layout

``` text
┌───────────────────────────────────────────────┐
│ Statistics Assessment             4 / 20     │
│ ████████░░░░░░░░░░░░                        │
├───────────────────────────────────────────────┤
│                                               │
│ Which measure best represents...?             │
│                                               │
│ ○ Option A                                    │
│ ○ Option B                                    │
│ ○ Option C                                    │
│ ○ Option D                                    │
│                                               │
├───────────────────────────────────────────────┤
│ [ Previous ]                    [ Next ]      │
└───────────────────────────────────────────────┘
```

Requirements:

-   Clear progress
-   Keyboard accessibility
-   Save/recovery where appropriate
-   No unnecessary animation
-   Clear submission state
-   Explain results after completion

------------------------------------------------------------------------

# 21. Assessment Results

Results should focus on competencies.

``` text
Assessment Complete

Overall: 72%

Competencies

SQL                  84%   Strong
Statistics            61%   Developing
Visualization         48%   Needs Improvement

Your next priority:
Statistics

[ View Skill Gaps ]
[ Continue Learning ]
```

Avoid making the score itself the only meaningful output.

------------------------------------------------------------------------

# 22. Learning Experience

Learning screens should prioritize focus.

## Layout

``` text
┌────────────────────────────────────────────────────┐
│ Statistics Fundamentals                            │
│ Competency: Statistics                             │
├────────────────────────────────────────────────────┤
│                                                    │
│ Lesson content                                     │
│                                                    │
│ Explanation                                        │
│ Examples                                           │
│ Interactive element                                │
│                                                    │
├───────────────────────────────┬────────────────────┤
│ Previous                      │ AI Assistant       │
│                               │ Ask a question...  │
│                               │                    │
│                       [ Next Lesson ]              │
└───────────────────────────────┴────────────────────┘
```

------------------------------------------------------------------------

# 23. AI Assistant UX

The AI assistant should feel like a **learning companion**, not a
generic ChatGPT clone.

## Assistant Context

Display context:

``` text
Learning:
Statistics Fundamentals

Your competency:
46%

Current topic:
Probability
```

This makes the AI visibly personalized.

## Suggested Prompts

``` text
Explain this simply
Give me an example
Give me a hint
Quiz me
What should I revise?
Why is this important?
```

------------------------------------------------------------------------

# 24. RAG Source Display

When the AI answer uses platform knowledge, show a compact source area:

``` text
Sources

▣ Statistics Fundamentals
▣ Probability Module
▣ Approved Reference Material
```

Allow users to inspect source information.

The interface should communicate:

> **This answer is grounded in approved learning content.**

------------------------------------------------------------------------

# 25. AI Interaction Rules

The AI interface should:

-   Encourage learning rather than simply giving answers.
-   Provide hints before solutions where appropriate.
-   Adapt explanations to competency level.
-   Connect explanations to current learning objectives.
-   Cite retrieved sources when available.
-   Explain uncertainty when retrieval is insufficient.

Avoid:

-   Giant chat bubbles
-   Excessive gradients
-   Floating AI mascots
-   Neon colors
-   Generic "Ask AI anything" messaging

------------------------------------------------------------------------

# 26. Practice UX

Practice should connect directly to competency gaps.

Example:

``` text
Practice Recommendation

Statistics
Focus: Probability

Difficulty: Intermediate
Questions: 10
Estimated time: 12 min

Why this practice?
Your latest assessment shows a gap in probability.

[ Start Practice ]
```

------------------------------------------------------------------------

# 27. Progress Experience

Show progress across time.

## Competency Growth

``` text
Statistics

Before learning       46%
After practice        58%
Latest assessment     69%

Improvement: +23%
```

Use line charts where historical progression matters.

------------------------------------------------------------------------

# 28. Role Readiness Screen

This should be a flagship screen.

``` text
DATA ANALYST
Role Readiness

        73%

██████████████░░░░░░

Strong Competencies
✓ SQL
✓ Excel

Developing
△ Python

Priority Gaps
! Statistics
! Visualization

To reach readiness:
Complete 3 recommended learning activities.

[ View Personalized Path ]
```

The readiness score must always be explainable.

------------------------------------------------------------------------

# 29. Certificates

Certificate pages should feel official and restrained.

Visual characteristics:

-   Ivory background
-   Deep green typography
-   Saffron border/accent
-   GyanMarg identity
-   Verification information
-   QR code in future versions

Avoid excessive decorative graphics.

------------------------------------------------------------------------

# 30. Achievements

Use achievements sparingly.

Examples:

``` text
✓ SQL Competency Achieved
✓ Statistics Improvement +20%
✓ Assessment Milestone
✓ Role Readiness Milestone
```

Achievements should reward meaningful competency development, not
trivial clicks.

------------------------------------------------------------------------

# 31. Admin Portal

The admin interface should prioritize information density and
operational clarity.

## Navigation

``` text
Overview
Users
Roles
Competencies
Assessments
Questions
Learning Resources
Knowledge Base
Certificates
Analytics
Audit Logs
Settings
```

------------------------------------------------------------------------

# 32. Admin Dashboard

Show:

-   Total learners
-   Active learners
-   Assessments completed
-   Average competency
-   Major skill gaps
-   Role readiness
-   Learning outcomes

Example:

``` text
Platform Overview

25,430 Learners
64% Average Competency
8,420 Assessments
73% Average Learning Path Completion

Top Skill Gaps

1. Data Visualization
2. Statistics
3. Cloud Fundamentals
4. Python
```

------------------------------------------------------------------------

# 33. Institutional Analytics

Institution-level analytics should use aggregated information.

Potential views:

-   Competency distribution
-   Skill-gap heatmap
-   Role-readiness distribution
-   Learning outcomes
-   Domain comparison
-   Trend analysis

Avoid exposing individual learner information unless explicitly
authorized.

------------------------------------------------------------------------

# 34. Components

Build reusable components rather than page-specific UI.

## Core

-   Button
-   Input
-   Select
-   Checkbox
-   Radio
-   Badge
-   Tooltip
-   Dialog
-   Drawer
-   Tabs
-   Dropdown
-   Toast

## Product

-   CompetencyCard
-   SkillGapCard
-   ReadinessScore
-   ProgressRing
-   CompetencyMatrix
-   AssessmentQuestion
-   AssessmentProgress
-   LearningResourceCard
-   LearningPath
-   RecommendationCard
-   SourceCitation
-   AIMessage
-   AchievementCard
-   CertificateCard

## Analytics

-   MetricCard
-   LineChart
-   BarChart
-   SkillHeatmap
-   ProgressChart

------------------------------------------------------------------------

# 35. Button Hierarchy

## Primary

Saffron filled button.

Examples:

``` text
Start Assessment
Continue Learning
Start Practice
```

## Secondary

Deep green outline or neutral filled button.

Examples:

``` text
View Details
Explore
Review
```

## Tertiary

Text button.

Examples:

``` text
Learn More
View Evidence
Skip
```

Avoid multiple competing primary buttons.

------------------------------------------------------------------------

# 36. Iconography

Use a consistent icon system such as Lucide.

Icons should:

-   Clarify meaning
-   Support scanning
-   Never replace important text
-   Maintain consistent stroke weight

Avoid mixing multiple icon styles.

------------------------------------------------------------------------

# 37. Illustrations

Illustrations should be:

-   Human-centered
-   Inclusive
-   Minimal
-   Professional
-   Slightly editorial
-   Consistent in style

Preferred subjects:

-   Learners studying
-   Mentors
-   Assessment
-   Skill development
-   Collaboration
-   Digital learning

Avoid overly cartoonish mascots.

------------------------------------------------------------------------

# 38. Indian Visual Identity

Use Indian identity subtly.

Good uses:

-   Saffron accent
-   Deep green
-   Warm ivory
-   Subtle geometric motifs
-   Multilingual support
-   Inclusive Indian learner illustrations

Avoid:

-   Excessive national symbols
-   Overusing flags
-   Decorative government seals without authorization
-   Making every screen look ceremonial

GyanMarg should feel Indian without becoming visually cluttered.

------------------------------------------------------------------------

# 39. Motion & Animation

Animation should communicate state, not decoration.

Use:

-   Smooth page transitions
-   Progress animations
-   Skeleton loading
-   Subtle hover states
-   Assessment feedback
-   Chart transitions

Avoid:

-   Constant floating animations
-   Excessive parallax
-   Large entrance animations
-   Distracting background motion

Recommended duration:

``` text
Fast: 120–180ms
Normal: 200–300ms
Complex: 300–450ms
```

Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# 40. Accessibility

Target WCAG 2.2 AA principles.

Requirements:

-   Keyboard navigation
-   Visible focus states
-   Semantic HTML
-   Screen-reader labels
-   Adequate contrast
-   Accessible forms
-   Error messages
-   No color-only communication
-   Reduced-motion support
-   Responsive text

Assessment functionality must be fully keyboard accessible.

------------------------------------------------------------------------

# 41. Responsive Design

## Desktop

Primary experience:

-   Sidebar
-   Multi-column dashboards
-   Data-rich tables
-   Expanded AI assistant

## Tablet

-   Collapsible sidebar
-   Two-column layouts where appropriate
-   Simplified tables

## Mobile

-   Bottom navigation
-   Single-column content
-   Stacked cards
-   Horizontal scrolling only when necessary
-   Full-width primary CTA

The mobile experience must remain fully functional, not simply
compressed.

------------------------------------------------------------------------

# 42. Dark Mode

Dark mode should preserve the brand identity.

Do not simply invert colors.

Use:

``` text
Dark Background: #0E1712
Dark Surface:    #15231B
Deep Green:      #1B4D38
Gold Accent:     #D69A2D
Light Text:      #F5F0E3
Muted Text:      #A8B1AA
Border:          #2B3A31
```

Gold should remain controlled to avoid eye strain.

------------------------------------------------------------------------

# 43. Empty States

Empty states should explain what happens next.

Bad:

> No data.

Good:

> **Your competency profile is ready to build.**\
> Complete your baseline assessment to discover your strengths and skill
> gaps.

CTA:

**Start Assessment**

------------------------------------------------------------------------

# 44. Loading States

Use skeletons for:

-   Dashboard cards
-   Tables
-   Learning content
-   AI responses

For AI:

``` text
Finding relevant learning material...
```

Then:

``` text
Generating explanation...
```

Avoid fake progress percentages for unpredictable operations.

------------------------------------------------------------------------

# 45. Error States

Errors should be actionable.

Example:

> **We couldn't load your competency profile.**\
> Your progress is safe. Try again in a moment.

Actions:

``` text
[ Try Again ]
```

Never expose raw backend errors to learners.

------------------------------------------------------------------------

# 46. Content Tone

GyanMarg should use clear, respectful language.

Prefer:

> Your biggest current skill gap is Statistics.

Instead of:

> You are weak in Statistics.

Prefer:

> Recommended next step

Instead of:

> Fix your weakness

Prefer:

> You improved by 18% since your baseline assessment.

Instead of:

> You scored poorly previously.

The tone should be encouraging without becoming childish.

------------------------------------------------------------------------

# 47. Data Visualization

Charts should answer questions.

Use:

### Line chart

For competency improvement over time.

### Bar chart

For comparing competencies.

### Progress bar

For current vs required proficiency.

### Heatmap

For institutional skill-gap analysis.

### Donut / radial

Use sparingly for a single readiness metric.

Avoid dashboards filled with decorative charts.

------------------------------------------------------------------------

# 48. Design Tokens

Implementation should expose design tokens.

Example:

``` css
--color-brand-green: #123C2B;
--color-brand-gold: #C88719;
--color-background: #F5F0E3;
--color-surface: #FFFDF8;
--color-text: #1B241F;
--color-text-muted: #68736C;
--color-border: #DCD7CA;

--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

------------------------------------------------------------------------

# 49. UX Principles

## Principle 1 --- Action over Information

Every major insight should have a next action.

## Principle 2 --- Show Why

Recommendations must explain why they were made.

## Principle 3 --- Competency over Completion

A completed course is not equivalent to demonstrated skill.

## Principle 4 --- Progressive Disclosure

Show the most important information first and details when requested.

## Principle 5 --- Evidence Builds Trust

Show assessment evidence and source context where appropriate.

## Principle 6 --- Minimize Cognitive Load

Do not overwhelm learners with analytics.

## Principle 7 --- Human First

AI should support the learner, not dominate the interface.

## Principle 8 --- Government Ready

The product should remain credible and usable in institutional
environments.

------------------------------------------------------------------------

# 50. Design Anti-Patterns

Do NOT:

-   Turn every screen into a dashboard.
-   Use gradients everywhere.
-   Put an AI chatbot button on every component.
-   Overuse glassmorphism.
-   Use neon colors.
-   Use excessive rounded cards.
-   Display meaningless gamification.
-   Hide important information behind AI.
-   Make competency scores look scientifically precise when they are
    estimates.
-   Use decorative government imagery without authorization.
-   Create excessive animation.
-   Make the interface look like a children's learning app.

------------------------------------------------------------------------

# 51. Design-to-Development Mapping

The design system should map cleanly to implementation.

``` text
Design Tokens
      ↓
Tailwind Theme
      ↓
shadcn/ui Base Components
      ↓
GyanMarg Product Components
      ↓
Page Templates
      ↓
Student Portal
Admin Portal
Public Website
```

The component library should be built before creating dozens of
individual pages.

------------------------------------------------------------------------

# 52. Recommended UI Technology

``` text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
Recharts
```

The design system should be implemented using reusable components and
shared tokens.

------------------------------------------------------------------------

# 53. Final Design Direction

GyanMarg should look like:

> **A trusted national learning intelligence platform with the polish of
> a modern technology product.**

The visual hierarchy should be:

``` text
TRUST
  ↓
CLARITY
  ↓
COMPETENCY
  ↓
PROGRESS
  ↓
ACTION
```

The learner should never leave a major screen wondering:

> "What am I supposed to do now?"

The answer should always be visually obvious.

------------------------------------------------------------------------

# 54. Signature GyanMarg Experience

The most distinctive screens should be:

1.  **Competency Profile**
2.  **Skill Gap Matrix**
3.  **Personalized Learning Path**
4.  **AI Learning Assistant with Sources**
5.  **Competency Growth Timeline**
6.  **Role Readiness Dashboard**

These screens should receive the highest design attention because they
communicate what differentiates GyanMarg from a conventional LMS.

------------------------------------------------------------------------

# 55. Design Success Criteria

The design is successful when:

-   A first-time learner understands the product within seconds.
-   A learner can identify their largest skill gap immediately.
-   The next recommended action is obvious.
-   Assessment results explain competency rather than just scores.
-   AI feels integrated into learning rather than bolted on.
-   RAG sources are visible and understandable.
-   Role readiness is explainable.
-   Administrators can interpret institutional analytics quickly.
-   The interface remains professional across desktop and mobile.
-   The product feels distinctly GyanMarg rather than like a template.

------------------------------------------------------------------------

# 56. One-Line Design Definition

> **GyanMarg is a calm, credible, Indian-inspired competency
> intelligence platform where every piece of design turns skill-gap
> insight into a clear next step.**
