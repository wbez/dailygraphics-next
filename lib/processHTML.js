var fs = require("fs").promises;
var path = require("path");

var compile = require("./template");
var filters = require("./templateFilters");

var process = async function(file, data = {}, options = {}) {
  var dir = options.cwd || path.dirname(file);

  var t = Object.assign(
    {
      include: async function(file, d = data) {
        var f = path.join(dir, file);
        return process(f, d);
      },
      includeStatic: async function(file) {
        var f = path.join(dir, file);
        return fs.readFile(f, "utf-8");
      },
      process
    },
    filters
  );

  var source = await fs.readFile(file, "utf-8");
  var sourceURL = path.basename(file);
  var template = compile(source, { sourceURL });
  var d = Object.assign({}, data, { t });
  var rendered = await template(d);
  return rendered;
};

module.exports = process;
