# run-behind

Run one command interactively in the foreground, while other commands run in the background.

Use cases:
- Running linting and typechecking while writing commit messages, instead of after or before like with git hooks
- Probably others, but commmits is the reason I wrote this for

![Demo video](https://user-images.githubusercontent.com/10573690/136843956-7cd736d9-e14d-41e3-a534-b06d99533a11.gif)

## Installation

```sh
yarn add run-behind --dev
# or
npm install run-behind --save-dev
```

## Usage

```sh
yarn run-behind <foreground-command> <background-command-1> <background-command-2> ... <background-command-n>
```

### Example: shared with your team in package.json

```json
...
  scripts: {
    "lint": "eslint src --ext .js,.ts --cache",
    "typecheck": "tsc --noEmit --incremental",
    "commit": "run-behind git-cz 'yarn lint' 'yarn typecheck'"
  }
...
```

### Example: just for you

Install globally:
```sh
npm install -g run-behind
```

Add an alias to `~/.zshrc` or equivalent for easy usage
```sh
alias gc=run-behind git-cz 'yarn lint --quiet' 'yarn typecheck --pretty'
```

## Tips

If you want to get back to your terminal without waiting for the tasks to end, just hit ctrl-c.

Things will be commmited even if the background command fail. It's not a bug, it's a feature. You can use `git commit --amend` if it turns out something failed.

Setting up caching for the commands will make the experience a lot better:

- `eslint`: just add `--cache` to the command
- `tsc`: use `--incremental`
- `jest`: usually caching is set up by default, you can add `--onlyChanged` to only run relevant tests
