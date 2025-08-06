
call npm run build ^
&& call npm version patch -m "Release v%%s" ^
&& git push origin VUE3_Branch --follow-tags ^
&& call npm publish --access public