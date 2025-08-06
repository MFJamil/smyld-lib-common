npm run build
git push origin VUE3_Branch
npm version patch -m "Release v%s"
git push origin VUE3_Branch --follow-tags
npm publish --access public