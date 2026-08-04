const fs = require('fs');
const path = require('path');

const servappsDir = path.join(__dirname, '..', 'servapps');
const outputDir = path.join(__dirname, '..'); 

const apps = [];

const folders = fs.readdirSync(servappsDir).filter(f => {
  return fs.statSync(path.join(servappsDir, f)).isDirectory();
});

for (const folder of folders) {
  const descPath = path.join(servappsDir, folder, 'description.json');
  const composePath = path.join(servappsDir, folder, 'cosmos-compose.json');

  if (!fs.existsSync(descPath) || !fs.existsSync(composePath)) {
    console.warn(`Skipping ${folder}: missing description.json or cosmos-compose.json`);
    continue;
  }

  const description = JSON.parse(fs.readFileSync(descPath, 'utf8'));
  const compose = fs.readFileSync(composePath, 'utf8');

  // Check for icon
  let icon = description.icon || '';
  const iconPath = path.join(servappsDir, folder, 'icon.png');
  if (fs.existsSync(iconPath)) {
    icon = `servapps/${folder}/icon.png`;
  }

  let parsedCompose = null;
  try {
    parsedCompose = JSON.parse(compose);
  } catch (e) {
    // Some compose files have Whiskers {if} tags which makes them invalid JSON
    console.warn(`Note: Could not parse ${folder}/cosmos-compose.json as strict JSON due to templating.`);
  }

  apps.push({
    name: description.name,
    description: description.description,
    longDescription: description.longDescription || '',
    tags: description.tags || [],
    repository: description.repository || '',
    image: description.image || '',
    supported_architectures: description.supported_architectures || ['amd64', 'arm64'],
    icon: icon,
    compose: composePath.replace(/\\/g, '/').replace(/.*servapps\//, 'servapps/'),
    config: parsedCompose
  });

  console.log(`✅ Added: ${description.name}`);
}

// Write servapps.json
fs.writeFileSync(
  path.join(outputDir, 'servapps.json'),
  JSON.stringify(apps, null, 2),
  'utf8'
);

console.log(`\n🎉 Generated servapps.json with ${apps.length} apps`);
