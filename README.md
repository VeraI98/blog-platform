# 📝 Realworld Blog

A responsive blogging application for publishing articles, sharing ideas, and discovering other authors.

Built with **React, React Router, and React Hook Form**, using the **Habsida RealWorld API**.

[🌐 Live Demo](https://blog-platform-navy-ten.vercel.app/) · [💻 GitHub](https://github.com/VeraI98/blog-platform)

---

## ✨ Features

### Articles

- Browse articles with pagination.
- Filter the feed by tags.
- Read articles formatted with Markdown.
- Create, edit, and delete your own articles.
- Add and remove article tags.
- Confirm article deletion in a keyboard-accessible dialog.

### Accounts

- Sign up, sign in, and log out.
- Edit your username, email, bio, avatar URL, and password.
- View author profiles and their published articles.
- Follow and unfollow authors.
- Add articles to favorites and browse an author's favorited articles.

### User Experience

- Responsive layout and navigation.
- Client-side form validation.
- Loading, empty, and error states.
- Retry failed article requests.
- Feedback for failed favorite, follow, and delete actions.
- Pending states to prevent repeated submissions.

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| UI | React 18 · CSS |
| Language | JavaScript · JSX |
| Build Tool | Vite 5 |
| Routing | React Router 6 |
| Forms | React Hook Form |
| Markdown | React Markdown · remark-gfm |
| State | React Hooks · Context API |
| API | Fetch API · Habsida RealWorld REST API |
| Code Quality | ESLint · Prettier · Husky · lint-staged |
| Testing | Node.js Test Runner |
| Hosting | Vercel |

## 💡 Implementation Highlights

- **Authentication context** shares the current user across the application.
- **Token-authenticated requests** load personalized article and favorite states.
- **Protected routes** require authentication for publishing and account settings.
- **Author checks** prevent the editing interface from opening another user's article.
- **Reusable article form** handles both creation and editing.
- **Optimistic updates** provide immediate feedback for favorites and subscriptions, with rollback on failure.
- **Reusable fetching hook** manages loading, errors, retries, and ignores results from outdated requests.
- **Error normalization** converts network failures into visible form messages.
- **Vercel rewrites** support direct access to client-side routes.

## 🚀 Getting Started

### Requirements

- Node.js 20 or newer.
- npm.
- Access to the Habsida RealWorld API.

### Installation

```bash
git clone https://github.com/VeraI98/blog-platform.git
cd blog-platform
npm ci
```

### Development

```bash
npm run dev
```

Open the local address printed in the terminal, usually:

**[http://localhost:5173](http://localhost:5173)**

### Production Preview

```bash
npm run build
npm run preview
```

## 📋 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check JavaScript and JSX with ESLint |
| `npm run format` | Format source files with Prettier |
| `npm test` | Run API and error-handling regression tests |

## 📁 Project Structure

| Path | Responsibility |
| :--- | :--- |
| `src/App.jsx` | Application routes and shared layout |
| `src/pages/` | Feed, article, profile, authentication, and settings pages |
| `src/components/` | Navigation, article previews, forms, pagination, and dialogs |
| `src/context/AuthContext.jsx` | Authentication state and local persistence |
| `src/hooks/useFetch.js` | Fetching state, retries, and stale-result handling |
| `src/utils/api.js` | API requests and authentication headers |
| `src/utils/errors.js` | Form error normalization |
| `src/index.css` | Application styles and responsive layouts |
| `tests/api.test.mjs` | API and error-handling regression tests |
| `vercel.json` | Client-side routing configuration for Vercel |

## 🔌 API Integration

The frontend connects to:

```text
https://realworld.habsida.net/api
```

The API provides authentication, articles, profiles, tags, favorites, and author subscriptions.

Authenticated requests use the token returned by the API:

```http
Authorization: Token <user-token>
```

No separate API key or `.env` file is required for the current configuration.

> This repository contains the frontend application. The backend is provided by Habsida and is maintained separately.

## ✅ Validation

- Production build completed successfully.
- ESLint completed without errors; prop-validation warnings remain.
- Six automated tests cover:
  - Authentication headers and pagination.
  - Public requests without a token.
  - Profile-name encoding.
  - HTTP failures without validation details.
  - Network error messages.
  - Favorite and unfavorite request methods.

Tests use mocked API responses and do not create accounts or modify published articles.

## ☁️ Deployment

Import the repository into **Vercel** with these settings:

| Setting | Value |
| :--- | :--- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

The included `vercel.json` routes application URLs to `index.html`, allowing React Router to handle paths such as `/sign-in` and `/articles/:slug`.

## 📝 Notes

- Authentication is stored in the current browser's local storage when available.
- If local storage is blocked, authentication remains in memory until the page is refreshed.
- An expired or rejected token may require signing in again.
- Client-side route and author checks support the interface; API authorization must be enforced by the backend.
- Availability of online features depends on the external API.

---

## 👩‍💻 Author

**Vera Ilyasova** · [VeraI98](https://github.com/VeraI98)

Created as a frontend learning project and refined for a developer portfolio.