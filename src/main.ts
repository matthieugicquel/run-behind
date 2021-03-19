import type { ExecaReturnValue } from "execa";
import execa from "execa";
import { bold, gray, green, red } from "kleur/colors";
import ora from "ora";

process.title = "run-behind";

(async (): Promise<void> => {
  try {
    const [_, __, fg_command, ...bg_commands] = process.argv;
    if (["-h", "--help"].includes(fg_command) || !fg_command) {
      show_help();
      process.exit(0);
    }
    await run_behind(fg_command, bg_commands);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

async function run_behind(fg_command: string, bg_commands: string[]) {
  let running_bg_commands = bg_commands.map((command) => {
    return { command, promise: exec_and_store_output(command) };
  });

  await exec_and_show(fg_command);

  while (running_bg_commands.length) {
    const spinner = ora(
      running_bg_commands.length === 1
        ? `Running ${gray(running_bg_commands[0].command)}`
        : `Running ${bold(running_bg_commands.length)} tasks`
    ).start();

    const {
      command: done_command,
      output,
      is_success,
    } = await Promise.race(running_bg_commands.map(({ promise }) => promise));

    is_success ? spinner.succeed(gray(done_command)) : spinner.fail(bold(red(done_command)));
    if (output.length) console.log(output); // condition to avoid empty lines on success

    running_bg_commands = running_bg_commands.filter(({ command }) => command !== done_command);
  }
}

async function exec_and_show(command: string): Promise<ExecaReturnValue> {
  return execa(command, { stdio: "inherit", shell: true, reject: false });
}

interface BgCommandResult {
  command: string;
  output: string;
  is_success: boolean;
}

async function exec_and_store_output(command: string): Promise<BgCommandResult> {
  const result = await execa(pretty_please(command), {
    all: true,
    reject: false,
    shell: true,
    preferLocal: true,
  });
  return { command, output: result.all ?? `Error runninng ${command}`, is_success: result.exitCode === 0 };
}

function pretty_please(command: string): string {
  const replaced = command.replace("yarn", "yarn --silent").replace("npm run", "npm run --silent");
  return `FORCE_COLOR=1 ${replaced}`;
}

function show_help() {
  // prettier-ignore
  console.log(`${green("Usage")}: run-behind '${gray("<foreground-command>")}' '${gray("<background-command-1>")}' '${gray("<background-command-2>")}' ... '${gray("<background-command-n>")}'`);
}
