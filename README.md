
# How to run

Delivered `docker-compose` setup is designed for developer.

1. build docker images
- `./bin/assignment-dew build`

2. start application
- `./bin/assignment-dew serve`

App will be available at http://localhost:3000/,
with swagger UI at http://localhost:3000/api-ui

# Libraries / Tools

This assignment is based on express + express-openapi.

For management of DB changes I'm using https://sqitch.org with
git support added in `assignment-dew`, typical usage:
`assignment-dew revert-to --fork-point`

# Linter

Personally I'm not using such  tools.

In long time they tends to harm maintainability of code, though
many objections may be mitigated by using `eslint-plugin-diff`.

I used opportunity to play with it here.

# Naming

I'm usually quite terrible introducting names ...

# Tests

I didn't manage to save time to write automated tests also for
express operations.

