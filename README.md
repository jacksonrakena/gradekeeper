# Gradekeeper

Try it now: [gradekeeper.xyz](https://app.gradekeeper.xyz)

Gradekeeper is an free, open-source Next.js web app that simplifies grade tracking and projections for university students across the globe.

### Running a developer environment

You'll need Node 16 and NPM/Yarn installed. This guide will use NPM.

1. Install the dependencies:

```bash
npm i
npx prisma generate
```

2. Configure your development keys.

You'll need to copy `.env.local.template` to `.env.local` and fill out the fields.

| Field name                             | Description                                                                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| DATABASE_URL                           | A MySQL/Prisma-compatible connection string. You can use a local instance or a PlanetScale one.                                          |
| NEXTAUTH_SECRET                        | A random string of any length, used to encrypt NextAuth JWTs.                                                                            |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Your Google credentials for login. You can get these from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |

Optionally, you can set `NEXTAUTH_URL` used for redirects, but when using the development server, NextAuth will automatically figure this out.

3. Run the development server.

```bash
npm run dev
```

4. Visit your instance on `http://localhost:3000/`

### Screenshots

Home page:  
<img src="https://user-images.githubusercontent.com/44521335/173555388-a4636179-98e2-458b-83c0-6bd5762e820a.jpg" width="400" />
![image](https://user-images.githubusercontent.com/44521335/173555755-fd49ea1b-b182-44c4-a423-7d573516acba.png)

### Copyright

Gradekeeper is copyright &copy; 2022 Jackson Rakena.
