# Basil

A modern solidarity purchase groups web app

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Frabari_spg&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Frabari_spg)

> PoliTO SoftEng II 2021, team P11 project

## Prerequisites

In order to run this project you'll need a recent version of [Node](https://nodejs.org) and [npm](https://npmjs.org)
(preferably node@^14 and npm@^7).

## Project structure

This project is structured as a npm workspaces monorepo. The two main packages are `frontend/` and `backend/`.
Find more package-specific information in the child READMEs.

In order to run a subpackage script either do it from the subfolder or using the `-w` flag:

```shell
npm run -w frontend start # From root

cd frontend # From the frontend/ folder
npm run start
```

## Global scripts

- `start`: starts the frontend and the backend development servers in parallel
- `start:dev`: starts the frontend and the backend development servers in parallel (in watch mode)
- `test`: executes all the available tests

## Contributing guidelines

- The use of [Conventional Commits](https://www.conventionalcommits.org/) is enforced through git hooks.
- [git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) is appreciated.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
