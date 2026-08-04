const fs = require('fs');
const path = require('path');
const configFile = require('../config.json');

let servappsJSON = [];

let repoURL = configFile.pageUrl;
let servappsFolder = configFile.servappsFolder;
let rootDir = path.join(__dirname, '..');

// list all directories in the directory servapps and compile them in servapps.json
const servappsPath = path.join(rootDir, servappsFolder);
const servapps = fs.readdirSync(servappsPath).filter(file => fs.lstatSync(path.join(servappsPath, file)).isDirectory());

for (const file of servapps) {
  const servapp = require(path.join(servappsPath, file, 'description.json'));
  servapp.id = file;
  servapp.screenshots = [];
  servapp.artefacts = {};

  // list all screenshots in the directory servapps/${file}/screenshots
  const screenshotsPath = path.join(servappsPath, file, 'screenshots');
  if (fs.existsSync(screenshotsPath)) {
    const screenshots = fs.readdirSync(screenshotsPath);
    for (const screenshot of screenshots) {
      servapp.screenshots.push(`${repoURL}/${servappsFolder}/${file}/screenshots/${screenshot}`);
    }
  }

  const artefactsPath = path.join(servappsPath, file, 'artefacts');
  if (fs.existsSync(artefactsPath)) {
    const artefacts = fs.readdirSync(artefactsPath);
    for (const artefact of artefacts) {
      servapp.artefacts[artefact] = (`${repoURL}/${servappsFolder}/${file}/artefacts/${artefact}`);
    }
  }

  let composeFileName = "cosmos-compose.json";
  if (!fs.existsSync(path.join(servappsPath, file, composeFileName))) {
    composeFileName = "docker-compose.yml";
  }
  if (!fs.existsSync(path.join(servappsPath, file, composeFileName))) {
    console.error(`No compose file found for ${file}`);
    continue;
  }

  // Check if icon.png or icon.svg exists locally, else fallback to external icon URL from description if present
  const localIconPngPath = path.join(servappsPath, file, 'icon.png');
  const localIconSvgPath = path.join(servappsPath, file, 'icon.svg');
  const version = Date.now();
  if (fs.existsSync(localIconPngPath)) {
    servapp.icon = `${repoURL}/${servappsFolder}/${file}/icon.png?v=${version}`;
  } else if (fs.existsSync(localIconSvgPath)) {
    servapp.icon = `${repoURL}/${servappsFolder}/${file}/icon.svg?v=${version}`;
  }

  servapp.compose = `${repoURL}/${servappsFolder}/${file}/${composeFileName}`;

  servappsJSON.push(servapp);
  console.log(`✅ Added: ${servapp.name}`);
}

let apps = {
  "source": configFile.marketIndexUrl,
  "showcase": servappsJSON.slice(0, 3), // Just showcase the first 3 for the example
  "all": servappsJSON
};

fs.writeFileSync(path.join(rootDir, 'servapps.json'), JSON.stringify(servappsJSON, null, 2));
fs.writeFileSync(path.join(rootDir, 'index.json'), JSON.stringify(apps, null, 2));

console.log(`\n🎉 Generated servapps.json and index.json with ${servappsJSON.length} apps`);
