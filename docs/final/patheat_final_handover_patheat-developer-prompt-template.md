# PathEat Prompting Template for Developers

**INSTRUCTIONS FOR PATH EAT DEVELOPERS (Layhok, Smey, Seavpav):**
1. Whenever you start a new chat with an AI assistant, upload or attach the `patheat-ai-master-guidelines.md` file first.
2. Tell the AI: *"Read the attached guidelines. I will prompt you using those rules."*
3. Copy the template below, fill in your specific details inside the brackets `[...]`, and send it to the AI.
***

### ✂️ --- COPY FROM HERE DOWN --- ✂️

**Subject:** PathEat Feature Generation Execution

**My Role/Owner:** [Your Name, e.g., Leng Layhok (User Domain)]
**Target Page / API Endpoint:** [e.g., UserSearchPage.jsx OR POST /api/vendor/menu]
**Target RBAC Role:** [e.g., CONSUMER, VENDOR, GLOBAL_ADMIN]

**Feature Requirements / What I need you to build:**
[Describe exactly what you want the AI to do here. Example: "I need to build the frontend component for the User Search Page. It needs a search bar, filter chips for food categories, and a list that maps over a dummy array of vendors."]

**Context & Current Code State:**
[Paste your current folder tree, or the specific files you want the AI to modify here. If you are starting fresh, write: "Start from scratch using the global architecture."]

**EXECUTION CHECKPOINTS (Follow these steps strictly):**

1. **Architecture Check:** Briefly state which files you are going to create or modify and confirm they align with the master guidelines.
2. **JSDoc Verification:** Confirm what data types you are utilizing from `src/shared/types/` (or define new ones if they don't exist).
3. **Code Generation:** Output the clean, fully-functioning code blocks/ code files/ zip folder of the new version of the project.
4. **Post-Generation Manifest:** List the exact paths of the files modified, any new routes registered, and any interactive UI buttons you connected.

### ✂️ --- END COPY --- ✂️