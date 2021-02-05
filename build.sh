#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

rm -rf dist 
echo "清除舊的 dist"

echo "開始 build"
yarn build
echo "build 結束"

rm dist/service-worker.js
echo "刪除 service-wroker.js(禁止緩存)"