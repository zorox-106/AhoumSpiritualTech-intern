# Prompt Log

This project was built with the assistance of **Antigravity**, an advanced AI coding assistant. The AI was utilized to accelerate development, troubleshoot errors, design the architecture, and refine the code base.

Below is a log of the key prompts used during the development process.

## Prompt 1
**Prompt:**
`so do it as it is what said in this screenshots`

**Purpose:**
To kickstart the initial development based on design mockups and assignment requirements provided via screenshots.

**Outcome:**
The AI generated the foundational architecture, initialized the React frontend and Django backend, and set up Docker orchestration.

## Prompt 2
**Prompt:**
`how to run and what to do step wise`

**Purpose:**
To request a clear, step-by-step guide on how to start the development environment locally.

**Outcome:**
Provided exact terminal commands to clone the repo, set up environment variables, run docker-compose, and apply database migrations.

## Prompt 3
**Prompt:**
`ye aara bs ab and github ka htade auth and ye seassion firse nhi dikh rhe ab isko thik kr and photos jo seasson me aa rhi h vo htade`

**Purpose:**
To refine the UI and fix bugs: remove GitHub authentication, fix the session listing bug, and remove photos from sessions.

**Outcome:**
Disabled GitHub Auth in the UI, fixed CORS & DB issues causing sessions not to load, and removed the `image_url` field from the codebase.

## Prompt 4
**Prompt:**
`kuch bhi push nhi kia tune and same hi error aara h thoda chota bta dega mujhe tu?`

**Purpose:**
To report that a Firebase error persisted because changes were not pushed, and to request a brief explanation in Hinglish.

**Outcome:**
Force-pushed the Firebase environment variable fix to the GitHub repository and provided a concise explanation of the issue.

## Prompt 5
**Prompt:**
`or api kha milengi ye sb firebase ka`

**Purpose:**
To find out where to locate the required Firebase configuration keys for the frontend setup.

**Outcome:**
Provided step-by-step instructions on navigating the Firebase console to find the web app config snippet.

## Prompt 6
**Prompt:**
`dalni ase h apiKey ya jo tune btaya vse`

**Purpose:**
To clarify the exact naming convention for environment variables in Vercel for Vite.

**Outcome:**
Explained the `VITE_` prefix requirement and provided an exact mapping table for the environment variables to be pasted into Vercel.

## Prompt 7
**Prompt:**
`dekh ab sb thik h bss Available Sessions 0 dikha rha h and jo likha h login pe usko htade "Real OAuth active..."`

**Purpose:**
To troubleshoot the empty session catalog issue and remove a specific informational text block from the login UI.

**Outcome:**
Investigated a 500 error on the backend caused by a missing serializer field, removed the requested UI text, and pushed the fixes.

## Prompt 8
**Prompt:**
`remove this and delete unwanted files do not change the code or anything which cause me again a loss of time`

**Purpose:**
To clean up the repository by removing unneeded boilerplate files and strictly avoid introducing new bugs.

**Outcome:**
Safely deleted untracked Vite/Tailwind configuration files that were no longer necessary and pushed the clean state to production.

## Prompt 9
**Prompt:**
`.env example ye file jaroori h? and readme ko shi krde chota and meaningfull and not look like a ai`

**Purpose:**
To question the necessity of the `.env.example` file and request a more concise, human-readable README.

**Outcome:**
Deleted the unnecessary `.env.example` file and completely rewrote `README.md` to be a minimal, professional developer guide without AI-like fluff.

## Prompt 10
**Prompt:**
`Create a professional PROMPT_LOG.md file for my GitHub repository. Requirements: ...`

**Purpose:**
To generate documentation logging the AI interactions and prompts used during the project's development.

**Outcome:**
Created a properly formatted `PROMPT_LOG.md` file with placeholders, later populated with the actual prompt history.
