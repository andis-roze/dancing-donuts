#!/bin/bash

git checkout gh-pages
git rebase webgl-ng
yarn dist:dev
cp ./dist/* ./
git add .
git commit --amend
git please
git checkout webgl-ng
