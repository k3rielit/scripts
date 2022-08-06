# GitHub
### How to use:
- Copy the [entire script](https://github.com/k3rielit/scripts/raw/main/github/lists.js)
- Go to any [GitHub](https://github.com) page
- Paste it into the console
- Change the `uid` (first line) to a GitHub account name
- Press `Enter`
### Console commands (params are case sensitive):
- `starred`: displays the starred, but not listed items
- `lists`: displays the account's lists with their items
- `isItemOnList(item,list)`: returns `true` if the repo is on the list, otherwise `false`
- `IsItemUnlisted(item)`: returns `true` if the repo isn't on any lists, otherwise `false`
- `IsItemListed(item)`: returns `true` if the repo is on any lists, otherwise `false`
- `ItemsOnList(list)`: returns all the items on the list
- `ItemsNotOnList(list)`: returns all of the items that aren't on the list
  - The `item` param can be the full repo URL, or the name only
### How to search if a list includes an item ([idea](https://github.com/orgs/community/discussions/28515))
- Run the script as written above
- Run the `isItemOnList(item,list)` command in the console
  - Case sensitive, expects the list's id (for ex. `asd-asd`, not `asD/* ASD`)
- If it's on the list, it returns `true`, otherwise `false`
### How to disable the output
- Delete the contents of the `finalize()` function.
