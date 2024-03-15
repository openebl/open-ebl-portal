# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## Quick start for local development

#### Prerequisite

```shell
brew install poppler # for processing pdf files
npx tsup src/daemons/doc-ai-daemon.ts # build mocked doc AI service
node dist/doc-ai-daemon.cjs # run mocked doc AI service
```

[Optional] If you haven't installed postgresql yet
```shell
brew install postgresql
brew services start postgresql # by default, run PostgreSQL service in localhost:5432
```

Create new empty database
```shell
createuser [username] --createdb -P # create new db user with createdb permission
createdb [database_name] -O [username]
```

#### ENV Files

Reference: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#default-environment-variables

Create a new .env file and follow .env.example schema. The file will store sensitive information and should be listed in .gitignore

In the .env file

* DATABASE_URL: sets your [username], [password] and [database_name]

* NEXTAUTH_SECRET: use `openssl rand -base64 32` to generate openssl random string. It will be used to hash tokens, sign/encrypt cookies and generate cryptographic keys.

* S3_BUCKET: bluex-ebl-static-files-dev

* EMAIL_SERVER / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY: login to AWS EKS `devbxebl` pod and `cat /vault/secrets/config`

* BU_SERVER_API_KEY: ask Wesley to provide bu server api key

#### Database

Init database with seed data

Edit the prisma/seed.ts and add your email, it will be used to register your email to local database later

```shell
npm run migrate-dev # sync database schema
npm run db:seed # fill seed data to database
```

[Optional] DB GUI

You can download [TablePlus](https://tableplus.com/) to visualize and manipulate database more easily

#### Next.js

```shell
npm ci
npm run dev
```

#### Local development consideration

If your local development environment cannot access directly to DocuSum service, you will need to create a tunnel over Kubectl. Here is an example:

```
kubectl -n devbxebl port-forward svc/devbxebl-portals-docu-sum 5000:5000
```

then you can set `DOCU_SUM_ADDR` to `localhost:5000`
