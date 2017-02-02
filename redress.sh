#!/bin/sh

if [ -z "$1" ]; then
  echo "$0 something"
  exit
fi

sed -i '' -e "s/template/fcrdns/g" README.md

sed -i '' \
    -e "s/template/${1}/g" \
    -e "s/template\.ini/$1.ini/" \
    test/index.js

sed -i '' -e "s/template/${1}/g" package.json
sed -i '' \
    -e "s/_template/_${1}/g" \
    -e "s/template\.ini/$1.ini/" \
    index.js

git add package.json README.md index.js test/index.js 
git commit -m "renamed template to $1"
npm run lint && npm test || exit 1
rm redress.sh

echo "success!"
echo ""
echo "Next Steps: update package.json and force push this onto your repo:"
echo ""
echo "    \$EDITOR package.json"
echo "    git push --set-upstream origin master -f"
echo ""
