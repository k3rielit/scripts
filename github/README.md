# GitHub
### How to use:
- Copy the [entire script](https://github.com/k3rielit/scripts/raw/main/github/lists.js)
- Go to any [GitHub](https://github.com) page
- Paste it into the console
- Change the `uid` (first line) to a GitHub account name
- Press `Enter`
### How to search if a list includes an item ([idea](https://github.com/orgs/community/discussions/28515))
- Run the script as written above
- Run the `isItemOnList(item, list)` command in the console
  - Case sensitive, expects the list's id (for ex. `asd-asd`, not `asD/* ASD`)
  - `item` works with the URL and the title too
- If it's on the list, it returns `true`, otherwise `false`