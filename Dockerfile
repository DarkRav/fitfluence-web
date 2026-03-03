# syntax=docker/dockerfile:1.7

FROM alpine:3.21 AS artifact

ARG BUILD_DIR
WORKDIR /workspace

# The build artifact must already exist in the build context.
COPY . .

RUN set -eux; \
    selected_dir="${BUILD_DIR:-}"; \
    selected_dir="${selected_dir%/}"; \
    if [ -z "$selected_dir" ]; then \
      if [ -d dist ]; then \
        selected_dir="dist"; \
      elif [ -d build ]; then \
        selected_dir="build"; \
      else \
        echo "ERROR: No build artifact found. Expected ./dist or ./build, or pass --build-arg BUILD_DIR=<dir>." >&2; \
        exit 1; \
      fi; \
    fi; \
    if [ ! -d "$selected_dir" ]; then \
      echo "ERROR: BUILD_DIR '$selected_dir' does not exist in the build context." >&2; \
      exit 1; \
    fi; \
    mkdir -p /artifact; \
    cp -a "$selected_dir"/. /artifact/

FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=artifact /artifact/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
