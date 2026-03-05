# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=80

# Build artifact is prepared by "npm run build:artifact" into ./dist.
COPY dist/ ./

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/login || exit 1

CMD ["node", "server.js"]
