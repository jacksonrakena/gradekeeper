# Gradekeeper

Try it now: [gradekeeper.xyz](https://app.gradekeeper.xyz)
|API|Client|
|--|--|
|[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/1fqvl.svg)](https://uptime.betterstack.com/?utm_source=status_badge)|[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/faze.svg)](https://uptime.betterstack.com/?utm_source=status_badge)|

Gradekeeper is an free, open-source Rust + React web app that simplifies grade tracking and projections for university students across the globe.

This repository holds the TypeScript/React based client. For the Rust/Axum-based API server, see [jacksonrakena/gradekeeper-server](https://github.com/jacksonrakena/gradekeeper-server).

### Running a developer environment

You'll need Node 16 and NPM/Yarn installed. This guide will use NPM.
You'll also need a Rust compiler that supports the 2021 edition.

#### Server
First, clone [jacksonrakena/gradekeeper-server](https://github.com/jacksonrakena/gradekeeper-server).
1. Configure the parameters:

You'll need to copy `.env.template` to `.env` and fill out the fields.

| Field name                             | Description                                                                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| DATABASE_URL                           | A Postgres connection string.                                         |
| JWT_SECRET                        | A random string of any length, used to encrypt JWTs.                                                                            |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Your Google credentials for login. You can get these from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| PERMITTED_REDIRECT_URLS | A list of comma-separated permitted URLs. For example, the production server uses `https://app.gradekeeper.xyz`. For development, set this to something like `http://localhost:5173`.

2. Run the API server in release mode.

```bash
cargo run --release
```

#### Client
First, clone [jacksonrakena/gradekeeper](https://github.com/jacksonrakena/gradekeeper).

1. Install dependencies:
```
npm i
```

2. Configure the client:
  
Create a file called `.env.local` and fill in values as per the below table:
  
| Field name        | Description                                                                                          |
| ----------------- | -----------------------------------------------------------------------------------------------------|
| VITE_API_BASE_URL | The base url of the API server. For development, set this to something like `http://localhost:3000`. |
  

3. Start the development server:
```
npm run dev
```

4. Visit the development server on the address that Vite generates.

### Screenshots

Home page:  
<img src="https://user-images.githubusercontent.com/44521335/173555388-a4636179-98e2-458b-83c0-6bd5762e820a.jpg" width="400" />
![image](https://user-images.githubusercontent.com/44521335/173555755-fd49ea1b-b182-44c4-a423-7d573516acba.png)

### Copyright

Gradekeeper is copyright &copy; 2022&mdash;2024 Jackson Rakena.
