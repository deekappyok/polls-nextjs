# Polls (v2 - nextjs)

A simple, fast, and secure polling app built with **Next.js**, **Prisma**, and **PostgreSQL**. Create polls, vote, and view results—all while leveraging **Cloudflare** for security and performance.

## Features

- **Create Polls**: Easily create polls with a question and multiple options.
- **Vote**: Users can cast a vote and see results instantly.
- **Cloudflare Security**: Handles the real IP addresses even when behind Cloudflare.
- **Prevent Double Voting**: Users can vote only once per poll.

## Tech Stack

- **Next.js** (Frontend + API)
- **Prisma ORM** (Database interaction)
- **PostgreSQL** (Database)
- **Cloudflare** (Proxy & security)

## Quick Start

1. **Clone the repo**:
    ```bash
    git clone https://github.com/deekappyok/polls-nextjs.git
    cd polling-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up your environment**:
    - Create a `.env` file with the following:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/polling_db"
    ```

4. **Run migrations**:
    ```bash
    npx prisma migrate dev
    ```

5. **Start the app**:
    ```bash
    npm run dev
    ```

Your app will be live at `http://localhost:3000`.

---

## Cloudflare Integration

Cloudflare proxies your requests, and we use the `CF-Connecting-IP` header to capture the real IP address of users, ensuring privacy and security.

---

## Deployment

1. Deploy the app to **Vercel** or any cloud platform that supports Next.js.
2. Set the `DATABASE_URL` and any other necessary environment variables.

---

## Contributing

Feel free to fork and submit PRs to improve the app! Contributions are welcome.

## License

MIT License.
