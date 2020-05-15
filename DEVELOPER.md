# Building and Testing RDS-JS-Examples

This document describes how to set up your development environment to build and test RDS-JS-Examples.
It also explains the basic mechanics of using `git`, `node`, and `npm`.

* [Prerequisite Software](#prerequisite-software)
* [Getting the Sources](#getting-the-sources)
* [Installing NPM Modules](#installing-npm-modules)
* [Building](#building)
* [Running Tests Locally](#running-tests-locally)
* [Formatting your Source Code](#formatting-your-source-code)
* [Linting/verifying your Source Code](#lintingverifying-your-source-code)

See the [contribution guidelines](./CONTRIBUTING.md)
if you'd like to contribute to RDS-JS-Examples.

## Prerequisite Software

Before you can build and test RDS-JS-Examples, you must install and configure the
following products on your development machine:

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing
  Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Node.js](http://nodejs.org), (version specified in the engines field of [`package.json`](../package.json)) which is used to run a development web server,
  run tests, and generate distributable files.

## Getting the Sources

Fork and clone the RDS-JS-Examples repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [RDS-JS-Examples
   repository](https://github.com/mtna/rds-js-examples).
3. Clone your fork of the RDS-JS-Examples repository and define an `upstream` remote pointing back to
   the RDS-JS-Examples repository that you forked in the first place.

```shell
# Clone your GitHub repository:
git clone git@github.com:<github username>/rds-js-examples.git

# Go to the RDS-JS-Examples directory:
cd rds-js-examples

# Add the main RDS-JS-Examples repository as an upstream remote to your repository:
git remote add upstream https://github.com/mtna/rds-js-examples.git
```

## Installing NPM Modules

Next, install the JavaScript modules needed to build and test RDS-JS-Examples:

```shell
# Install RDS-JS-Examples project dependencies (package.json)
npm install
```

## Building

To build RDS-JS-Examples run:

```shell
npm run build
```

* Results are put in the `dist/` folder.

## Running Tests Locally

Jest is used as the primary tool for testing RDS-JS-Examples.

You should execute all test suites before submitting a PR to GitHub:
- `npm run test`

All the tests are executed on our Continuous Integration infrastructure. PRs can only be
merged if the code is formatted properly and all tests are passing.

## Formatting your source code

RDS-JS-Examples uses [prettier](https://prettier.io/) to format the source code.
If the source code is not properly formatted, the CI will fail and the PR cannot be merged.

You can automatically format your code by running:
- `npm run precommit`
- This will also happen automatically if you commit via `npm run commit`

A better way is to set up your IDE to format the changed file on each file save.

## Linting/verifying your Source Code

You can check that your code is properly formatted and adheres to coding style by running:

``` shell
$ npm run lint
```
