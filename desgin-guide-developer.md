You are an expert Frontend Engineer and UI/UX Architect specializing in building clean, enterprise-grade admin systems using React, Tailwind CSS, and Shadcn UI. 

Your task is to build a pixel-perfect, highly operational responsive admin dashboard with a multi-role layout. Follow the strict structural layouts, interaction specifications, and dynamic form behaviors outlined below from start to finish.

## CONTEXT & THEME CONFIGURATION
- Platform Style: Clean, high-density, accessible layout.
color and style follows the current design and color.
---

## DEVELOPER PORTAL SCRIPTING & RECOVERY COMPONENT

Implement a secondary layout system structured into a separate four-tab sub-panel mapping workspace environments specifically for Developer tasks.

### Tab 1: Backup Operations Track
- Top Controls: An input search bar to search historical backups by profile name keyword, and a secondary action button labeled [+ Create New Backup].
- Primary Data Grid: A row tracker logging Backup Profile Name, Method type, Scope targeting properties, and Interval Schedules. Includes inline actions for read-only metadata "View Properties" popups and profile "Delete" functions.
- Dynamic Backup Creator Modal Flow: Clicking the creation layout button launches a workflow modal with the following strict cascading visibility rules based on the user's selector input choices:
  - Option 1: "Entire Database" chosen -> Render a target dropdown selector choosing live system database schemas. Saving outputs an automatic local filesystem download of an executable SQL Script file (.sql).
  - Option 2: "Specific Tables" chosen -> Render a multi-select combobox component to checkmark several specific database tables. Saving outputs an automatic local download of an executable SQL Script file (.sql).
  - Option 3: "Specific Rows" chosen -> Step A: Render a single dropdown selection mapping to target database tables. Step B: Render a custom conditional SQL text-area entry field with a placeholder reading WHERE / HAVING / GROUP BY / ORDER BY criteria.... 
    *ENGINEERING RULE:* Do not let developers write the whole script. The underlying framework code must automatically prepend SELECT * FROM [Selected_Table] behind the text input window. 
    *OUTPUT ARCHITECTURE:* Executing this data run automatically extracts datasets into a raw CSV file including header column entries downloading instantly onto the local machine.
- Progress Tracking & Scheduling Rules: Do not store text-area text parameters in internal persistent command logs. Upon local file extraction completion, inject the activity name straight into a built-in platform execution ledger display underneath the main screen control headers. Allow assigning automation routines mapped via numeric input strings to dropdown units (Hours, Days, Months).

### Tab 2: Recovery Operations Track
- Main Layout: A text filtering search bar to parse previous data restorations, a secondary trigger button labeled [+ Initiate Recovery], and a dedicated runtime activity grid logging structural database actions underneath.
- Dynamic Validation Ingestion Modal:
  - Provide a primary radio choice selector group targeting: Full DB Dump, Selected Tables, or Row Level CSV.
  - Provide a drag-and-drop file upload target handling system validation:
    - If Full DB Dump or Selected Tables is active: Only accept structural .sql documents. Parse code formatting behind the scenes; if structural validation detects a file structural mismatch (e.g., uploading row data blocks inside a database schema target), block execution controls and flag validation error screens. Provide global Success validation alert bars upon successful completions.
    - If Row Level CSV is active: Render a cascading dependent workflow component. Show a single selector dropdown reading Select Target Database. Selecting a database value must instantly render and populate a secondary dependent text list reading Select Target Table. Restrict upload target arrays exclusively to .csv formats. Execute dataset insertion and trigger explicit interface validation victory messages upon complete execution runs.

### Tab 3 & Tab 4: User & Vendor Admin Mirror Layouts
- Tab 3 (User Management): Mirror the UX patterns, data tables, style design variables, and layout ergonomics used across standard platform global system administration panels.
- Tab 4 (Vendor Management): Replicate the exact design layouts, table patterns, validation modals, and cascading multi-tab sub-page logic profiles built inside Phase 1 of this prompt document.

---

## INTERACTIVE SIMULATION EXPECTATIONS
1. All modal triggers, tab toggles, and multi-view layouts (such as List/Map and dynamic selection dropdown visibility) must be fully responsive, click-functional, and showcase interactive states.
2. Ensure clear visual component separation boundaries using dividers, structured tables, and bold typographic hierarchies. Provide all code fragments complete from start to finish.



keep design simple and easily accessible. apply logic on top of what desribe to build a working side. 
ensuring routing all works and no dead button.