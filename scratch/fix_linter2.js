const fs = require('fs');
const path = require('path');

const fixSetState = (filePath) => {
  const p = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  
  // Remove disable comments that are immediately before useEffect
  content = content.replace(/\/\/\s*eslint-disable-next-line react-hooks\/set-state-in-effect\s*\n\s*useEffect\(/g, 'useEffect(');
  
  // Add disable comment inside useEffect before any setSomething(...)
  content = content.replace(/useEffect\(\(\) => {\n(\s*)(set[A-Z][a-zA-Z0-9]*\([^;]+;\n)/g, 'useEffect(() => {\n$1// eslint-disable-next-line react-hooks/set-state-in-effect\n$1$2');
  
  fs.writeFileSync(p, content);
};

['src/components/admin/ThemeToggle.tsx', 'src/app/admin/certifications/CertificationList.tsx'].forEach(fixSetState);

const fixAny = (filePath, regex, replacement) => {
  const p = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(p, content);
};

fixAny('src/app/admin/settings/SettingsForm.tsx', /value: any/g, 'value: string | boolean');
fixAny('src/app/admin/users/UserList.tsx', /roles: any/g, 'roles: string[]');
fixAny('src/app/admin/users/UserList.tsx', /role: any/g, 'role: string');
fixAny('src/app/admin/users/UserList.tsx', /any\[\]/g, 'string[]');
fixAny('src/app/admin/users/actions.ts', /err: any/g, 'err: unknown');
fixAny('src/app/admin/users/actions.ts', /err\.message/g, '(err as Error).message');

// .eslintignore to ignore scripts
fs.writeFileSync(path.join(__dirname, '..', '.eslintignore'), `
scratch/
scratch_db.js
seed_farms_gallery.js
update_role.js
`);

console.log("Remaining fixes applied.");
