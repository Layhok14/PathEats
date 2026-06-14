# PathEat Project Setup & Dependency Guide
## Standardizing the Clone-and-Run Workflow

To ensure every teammate can clone the repo and get running immediately, we must utilize standard Node.js ecosystem files.

### 1. Dependency Management (`package.json`)
Just like `requirements.txt` or `pyproject.toml`, Node.js uses `package.json`.

* **How to initialize**: `npm init -y` (done once).
* **How to install a package**: `npm install <package-name>` (this automatically updates `package.json`).
* **How a teammate sets up after cloning**:
    1.  `git clone <repo-url>`
    2.  `cd patheat`
    3.  `npm install` (This command reads `package.json` and downloads every necessary library automatically).

### 2. Environment Variables (`.env`)
You have secrets (Database URLs, JWT Secrets) that should NEVER be committed to Git.

* **Setup**: Create a `.env` file in the root directory.
* **Example**:
    ```text
    DATABASE_URL=postgres://user:password@localhost:5432/patheat
    JWT_SECRET=your_super_secret_key
    VITE_MAP_API_KEY=your_openfreemap_key
    ```
* **Git Guard**: Ensure `.env` is listed in your `.gitignore` file so it is never shared.

### 3. Essential Packages to Pre-Install
Teammates should immediately run this command after cloning:

```bash
# Frontend
npm install axios react-router-dom lucide-react clsx tailwind-merge

# Backend
npm install express pg cors dotenv jsonwebtoken bcryptjs
```