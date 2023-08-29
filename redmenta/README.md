# RDMT

tesco radio - ez a dolog jo dolog

Creates an overlay with the BearerToken, UserId, and UserType values that ship with the document itself as body attributes (`data-rdmt`, `data-rdmt-id`, `data-rdmt-type`), then get loaded into memory, and removed from the attribute list using javascript.

## Install

1. Install the Tampermonkey extension. ([Link](https://www.tampermonkey.net))
2. [Install](https://github.com/k3rielit/scripts/raw/main/redmenta/rdmt.user.js)

## Todo

- Clear the stored token once the user logged out, or changed accounts
- Define API routes
- Intercept API calls ([XHR](https://stackoverflow.com/questions/629671/how-can-i-intercept-xmlhttprequests-from-a-greasemonkey-script), [fetch](https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript))

## Changelog

### Version 1.1 `2023.08.29.`

- Waits for the body to be in the DOM (for too early injections)
- Stores the last known token in the userscript storage (for too late injections)
- Added a `sleep` and a `waitForElement` function to mitigate too early injections
- Added a `stringToElement` function that uses templates to turn a string into a Node
