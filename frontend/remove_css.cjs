const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/index.css', 'utf8');

const startIndex = content.indexOf('/* Membership premium card overrides */');
if (startIndex !== -1) {
  // we just delete from startIndex to the end of the file since it seems these overrides are at the end!
  content = content.substring(0, startIndex);
  fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/index.css', content);
  console.log("Successfully truncated index.css!");
} else {
  console.log("Could not find start index.");
}
