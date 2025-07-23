# Sync Workspace

Sync is a modern, collaborative workspace management platform built with Next.js and Appwrite. It enables teams and individuals to organize their work into workspaces, projects, and tasks, with real-time collaboration, role-based access, and multiple task views (table, kanban, calendar).

## Live Demo

Check out the live app here: [https://sync-theta-five.vercel.app/sign-in](https://sync-theta-five.vercel.app/sign-in)

## Features

- **Authentication**: Secure sign up, login, and logout with email/password and OAuth (Google, GitHub).
- **Workspace Management**: Create, edit, and join workspaces. Invite others via unique codes.
- **Project Management**: Organize workspaces into projects, each with its own details and image.
- **Task Management**: Create, assign, and track tasks with statuses (Backlog, Todo, In Progress, In Review, Done), due dates, and descriptions.
- **Multiple Task Views**: Switch between table, kanban board, and calendar views for tasks.
- **Collaboration**: Add members to workspaces with roles (Admin, Member).
- **Analytics**: View analytics for workspaces and projects.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/API**: [Appwrite](https://appwrite.io/) (via node-appwrite), [Hono](https://hono.dev/) for API routing
- **State/Data**: [React Query](https://tanstack.com/query/latest)
- **Forms/Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **UI Components**: Radix UI, Lucide Icons, custom components

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env.local` and fill in your Appwrite credentials (database, project, bucket IDs, etc.).

3. **Run the development server:**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication

- Sign up or log in with email/password or OAuth (Google, GitHub).
- Session is managed via secure cookies.

### Workspaces

- Create a workspace (optionally upload an image).
- Join existing workspaces via invite code.
- Switch between workspaces using the sidebar.

### Projects

- Create projects within a workspace (optionally upload an image).
- Edit or delete projects as needed.

### Tasks

- Create tasks within projects, assign to members, set due dates and descriptions.
- Change task status (Backlog, Todo, In Progress, In Review, Done).
- View tasks as a table, kanban board, or calendar.

### Members

- Invite members to a workspace.
- Assign roles (Admin, Member).

## Folder Structure

- `src/app/` — Next.js app directory (routing, layouts, pages)
- `src/features/` — Main business logic (auth, workspaces, projects, tasks, members)
- `src/components/` — Shared UI components
- `src/lib/` — Utilities and API clients
- `public/` — Static assets (logo, images)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE) (add a LICENSE file if you want to specify this)
