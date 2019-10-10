var chalk = require("chalk");
var minimist = require("minimist");
var path = require("path");

var configuration = require("../lib/configuration");

var help = function() {
  console.log(`
Commands available from the command line:
  - ${chalk.blue("create TYPE SLUG [SHEET]")} - create a graphic named SLUG from the template TYPE. SHEET is optional.
  - ${chalk.blue("copy ORIGINAL SLUG")} - copy ORIGINAL into a new graphic named SLUG, with a new backing sheet
  - ${chalk.blue("deploy SLUGS")} - deploy the chosen graphics to S3
  - ${chalk.blue("copyedit SLUGS")} - display the copy edit e-mail for the chosen SLUGS
  - ${chalk.blue("help")} - you're looking at it
  `);
};

var commands = {
  help,
  create: require("./create"),
  deploy: require("./deploy"),
  copy: require("./copy"),
  copyedit: require("./copyedit")
};

var run = async function() {
  var argv = minimist(process.argv);
  var [node, here, script = "help", ...positional] = argv._;

  var config = await configuration.load("config.json");

  var command = commands[script];
  command(config, argv, positional);
};

run();
