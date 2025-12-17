FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
ENV JWT_SECRET=Wh/Mmlg+xTbSsW11m7v7rSEesn69GrMOP7kLerxdJ00=
ENV NEXTAUTH_SECRET=8KLp9QxTvB2mN6wS4fD3hJ7rL5jM8kP1xC9zA0bE4c=
ENV DATABASE_URL=postgresql://postgres:password@db:5432/fixia
ENV NEXT_PUBLIC_APP_URL=https://fixia.app
ENV RESEND_API_KEY=re_SmYmMSFS_JGXSrxyhM58yWfAFVhMXgu81
ENV MP_ACCESS_TOKEN=APP_USR-956733169080479-070920-866ae729476004c75f35987fd053b08c-169925973
ENV MERCADOPAGO_WEBHOOK_SECRET=f90de58e8c4bb951d37e12fc49c9027ec0c584d23a6c7a2e749c8766ce895eb4
ENV CLOUDINARY_API_KEY=265223179544254
ENV CLOUDINARY_API_SECRET=Cdi9wGiVeXc5abmcQdJ9_bFsbYM
ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dgoc9tfoz
ENV CRON_SECRET=fixia-subscription-cron-job-2025-secure-secret-key
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
