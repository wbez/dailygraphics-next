var path = require("path");
var readJSON = require("../../lib/readJSON");

module.exports = async function(request, response) {
  var { app, user } = request;
  var config = app.get("config");
  var { getSheet } = app.get("google").sheets;

  var { slug } = request.params;
  var manifestPath = path.join(config.root, slug, "manifest.json");
  var manifest;
  manifest = await readJSON(manifestPath) || {};
  var { sheet } = manifest;

  var embedPath = path.join(config.templateRoot, "embed.html");
  var copyeditPath = path.join(config.templateRoot, "copyedit.html");
  var directLinkPath = path.join(config.templateRoot, "link.html");

  var data = { embedPath, copyeditPath, directLinkPath, slug, sheet, config, deployed: false };

  if (sheet) {
    data.COPY = await getSheet(sheet, { force: !config.argv.forceSheetCache });
  };

  response.render("parentPage.html", data);

}