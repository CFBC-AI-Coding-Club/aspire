FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bunx prisma generate
EXPOSE 5491
CMD ["bun", "run", "src/index.ts"]
