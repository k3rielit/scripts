# Hippity hoppity the answers are now my property
Autofills Flippity Scavenger Hunt answers. The funny version let's you send emails with noreply@flippity.net, where the textbox group is the email composer. Click the submit button to send it (it has a 1 minute delay).
### Manual use:
Paste this script into the browser's console:
```js
for(let i in data) document.getElementById('a'+i).value=data[i][2]
```
### Tampermonkey:
1. Install the Tampermonkey extension. ([Link](https://www.tampermonkey.net))
2. Install: [```normal```](https://github.com/k3rielit/scripts/raw/main/flippity/flippity-tamperm.user.js) [```funny```](https://github.com/k3rielit/scripts/raw/main/flippity/ultimity-tamperm.user.js)
### ❗ Important:
 - The script can become outdated if Flippity updates their code. Please leave an issue if that happens, I'll try to fix it. (Last tested: 2021.10.21.)
 - To test it: [flippity demo](https://www.flippity.net/sh.php?k=1ubDVulJpW7B2NDDuHMA1CtBwRxGiehQQZzeJpExdcwQ)