#!/bin/bash

git checkout gh-pages
git rebase master
yarn dist:dev
cp ./dist/* ./
git add .
git commit --amend
git please
git checkout master
