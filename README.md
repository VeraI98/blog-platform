# Realworld Blog — Parts 1 & 2

Blog platform built with React Hooks + React Router v6.

## ⚡ Quick Start

```bash
# 1. Install ALL dependencies (including react-hook-form)
npm install

# 2. Init Husky git hooks (only once)
npm run prepare

# 3. Start dev server → http://localhost:5173
npm run dev
```

> ⚠️ **Important**: always run `npm install` first — `react-hook-form` is required for auth forms.

## Pages

| Route | Description |
|---|---|
| `/` or `/articles` | Article list with pagination and tag filter |
| `/articles/:slug` | Single article (Markdown rendered) |
| `/sign-in` | Login form |
| `/sign-up` | Registration form |
| `/settings` | Edit profile (requires login) |
| `/profile/:username` | User profile page |

## Features — Part 2

- **Sign In / Sign Up** — forms with client-side validation via `react-hook-form`
- **Validation rules**:
  - Email: required + valid format
  - Username (register): 3–20 chars
  - Password (register): 6–40 chars
  - Confirm password must match
  - Personal data checkbox required
  - Settings: username required, email valid, new password 6–40 chars, avatar must be valid URL
- **Server errors** — displayed above form, fields highlighted in red
- **Persistent auth** — user stays logged in after page reload (localStorage)
- **Logout** — available in Settings page and Navbar
- **Navbar** — shows Sign In/Sign Up for guests, shows avatar + username + New Post + Settings for logged-in users

## API

Base URL: `https://realworld.habsida.net/api`

- `POST /users/login` — Sign in
- `POST /users` — Register
- `PUT /user` — Update profile (requires token)
- `GET /profiles/:username` — Get profile
- `GET /articles?author=:username` — User's articles
