# PathEat Global Style & Tailwind Integration Guide v3.0
## Complete Design System Schema Built Directly on Top of Uploaded style.css Core

This design manual extends your custom token file (`style.css`) into an automated, multi-role theme configuration engine. It bridges raw CSS properties with Tailwind CSS utility workflows, adding light/dark token counters, multilingual font configurations (English/Khmer), UI state tokens, scrollbar optimizations, and custom layout primitives.

---

## 1. Directory Blueprint Placement
The core styling assets must live in these specific directory slots to ensure clean global accessibility without creating file dependencies:

```text
src/
├── shared/
│   ├── styles/
│   │   ├── style.css           # Central configuration hub for all style parameters
│   │   └── components.css      # Abstract layout primitives (Zebra lists, map cards)
```

---

## 2. Expanded Production Stylesheet File Configurations

### 2.1 Complete Core Stylesheet (`src/shared/styles/style.css`)
This file wraps your variables into an asset that handles dark-mode inversions and structural typography resets for English and Khmer text characters.

```css
/* src/shared/styles/style.css */

/* Core multi-script font delivery from CDN */
@import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  /* Typography Configuration Stack (English + Khmer layout harmony) */
  --font-global: 'Plus Jakarta Sans', 'Kantumruy Pro', system-ui, sans-serif;

  /* Your exact baseline colors injected below */
  --color-primary: #22C55E;
  --color-primary-dark: #006E2F;
  --color-primary-darker: #004B1E;

  --color-secondary: #0F172A;

  --color-accent: #005AC2;
  --color-accent-dark: #003D88;
  --color-accent-light: #82ABFF;

  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-purple: #9333EA;

  --color-background: #F8F9FF;
  --color-surface: #FFFFFF;
  --color-surface-alt: #E5EEFF;

  --color-border: #BCCBB9;

  --color-text-primary: #0F172A;
  --color-text-secondary: #3F465C;
  --color-text-muted: #5C647A;
  --color-text-light: #BEC6E0;

  /* UI Focus and State System Additions */
  --color-focus-ring: rgba(34, 197, 94, 0.4);
  --radius-card: 12px;
  --radius-button: 8px;
}

/* Production-Ready Dark Mode Counterpart Map */
.dark {
  /* Green identity keys adapted for dark background compliance */
  --color-primary: #4ADE80;
  --color-primary-dark: #22C55E;
  --color-primary-darker: #166534;

  --color-secondary: #F8F9FF;

  /* Accent blue keys shifted to prevent screen glare */
  --color-accent: #3B82F6;
  --color-accent-dark: #1D4ED8;
  --color-accent-light: #1E3A8A;

  --color-warning: #FBBF24;
  --color-danger: #F87171;
  --color-purple: #C084FC;

  /* Ambient dark background surfaces grid */
  --color-background: #0B0F19; /* Pure deep charcoal navy */
  --color-surface: #131C2E;    /* Elevated inner panel layer */
  --color-surface-alt: #1E293B;/* Alternating list / accent track block */

  /* Dark boundary borders */
  --color-border: #2E3A4E;

  /* Complete text contrast inversions */
  --color-text-primary: #F8F9FC;
  --color-text-secondary: #CBD5E1;
  --color-text-muted: #94A3B8;
  --color-text-light: #475569;

  --color-focus-ring: rgba(74, 222, 128, 0.4);
}

/* Core infrastructure layers hook */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: var(--font-global);
    background-color: var(--color-background);
    color: var(--color-text-primary);
    -webkit-font-smoothing: antialiased;
    /* dynamic structural switching properties hook */
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  /* Interactive Form Inputs Focus Outlines Reset */
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-focus-ring);
  }

  /* Optimized platform global custom scrollbars design */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-background);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-text-light);
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-muted);
  }
}
```

### 2.2 Reusable Visual Primitives Sub-file (`src/shared/styles/components.css`)
This file defines complex, repetitive visual elements so that your developers don't have to duplicate lengthy Tailwind utility chains across their components.

```css
/* src/shared/styles/components.css */

@layer components {
  /* High-density dashboard container layout */
  .patheat-dashboard-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  /* Interactive route search list items selector */
  .patheat-list-row {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.15s ease;
  }
  
  /* Automated zebra-striping layout for high density lists */
  .patheat-zebra-table tbody tr:nth-child(even) {
    background-color: var(--color-surface-alt);
    opacity: 0.45;
  }
  .patheat-zebra-table tbody tr:nth-child(odd) {
    background-color: var(--color-surface);
  }

  /* Map canvas bounding panel overlay standard */
  .patheat-map-overlay {
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
  }
  .dark .patheat-map-overlay {
    background-color: rgba(19, 28, 46, 0.9);
  }
  
  /* Form actions interactive standard buttons */
  .btn-patheat-primary {
    background-color: var(--color-primary);
    color: #ffffff;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-button);
    transition: opacity 0.15s ease;
  }
  .btn-patheat-primary:hover {
    opacity: 0.92;
  }
}
```

---

## 3. Configuration Mapping Schema (`tailwind.config.js`)
To expose your entire custom token collection to Tailwind's autocomplete and inline utility engine, update your master configuration file to load your custom variables.

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // strict class-based setup targeting parent root node tracking hot-swaps
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Direct absolute conversion of your file structure variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          darker: 'var(--color-primary-darker)',
        },
        secondary: 'var(--color-secondary)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          light: 'var(--color-accent-light)',
        },
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        purple: 'var(--color-purple)',
        
        // Extended ambient layer abstractions definitions
        appBg: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
        },
        appBorder: 'var(--color-border)',
        
        // High fidelity typographic variables mappings
        textMain: 'var(--color-text-primary)',
        textSub: 'var(--color-text-secondary)',
        textMuted: 'var(--color-text-muted)',
        textLight: 'var(--color-text-light)',
      },
      fontFamily: {
        // Registers custom multi-script typography configuration font stack
        sans: ['var(--font-global)', 'sans-serif'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-button)',
      }
    },
  },
  plugins: [],
}
```

---

## 4. Root Bootstrap Initialization Ordering
To ensure global styles compile before individual components load, configure your imports exactly as shown inside `src/main.jsx`:

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/* ELEVATED INITIALIZATION IMPORTS CASCADE
  Stylesheets are loaded first so global variables register before components mount.
*/
import './shared/styles/style.css'
import './shared/styles/components.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## 5. Clean Code Generation Blueprint

When writing or generating component code (such as `UserSearchPage.jsx` or `VendorMenuTable.jsx`), avoid hardcoded hexadecimal string properties or arbitrary values. Use your mapped tokens instead:

* **Container Wrapping Example**:
  ```jsx
  // use the extended semantic color utility hooks directly
  <div className="bg-surface border border-appBorder rounded-card p-5">
    <h1 className="text-textMain text-xl font-bold">Phnom Penh Commuter Route</h1>
    <p className="text-textSub text-sm">Select filter chips to map food options...</p>
  </div>
  ```

* **Interactive Control Grid Tagging Example**:
  ```jsx
  // buttons automatically track your brand identity configurations smoothly
  <button className="bg-primary text-white font-medium rounded-btn px-4 py-2 hover:opacity-90">
    Confirm Coordinates Pin
  </button>
  ```