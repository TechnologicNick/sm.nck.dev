# Web projects related to Scrap Mechanic
This repository contains all projects hosted on [sm.nck.dev](https://sm.nck.dev).

## Projects
* Save Editor - Modify save files

## Deployment
The deployment is fully automated :). Creating a GitHub release triggers a GitHub Actions [workflow](.github/workflows/deploy.yml). This workflow builds a Docker image for `linux/amd64` and `linux/arm64`, which is then [pushed](https://github.com/TechnologicNick/sm.nck.dev/pkgs/container/sm-nck-dev) to the GitHub Container registry (GHCR). Following a successful workflow run, a webhook sends a POST request to my server, which downs the Docker Compose service, pulls the updated image, and starts the service again.
