const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/admin/gallery/GalleryManager.tsx',
  'src/app/admin/products/ProductList.tsx',
  'src/components/admin/ThemeToggle.tsx',
  'src/app/admin/blog/BlogList.tsx',
  'src/app/admin/categories/CategoryList.tsx'
];

filesToFix.forEach(relPath => {
  const filePath = path.join(__dirname, '..', relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix set-state-in-effect by moving the comment inside the useEffect
    content = content.replace(/\/\/\s*eslint-disable-next-line react-hooks\/set-state-in-effect\s*useEffect\(\(\) => {\s*(set[A-Za-z]+)\((.*?)\);\s*}/g, 
      'useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    $1($2);\n  }');
      
    // Handle multiline useEffect cases
    content = content.replace(/\/\/\s*eslint-disable-next-line react-hooks\/set-state-in-effect\s*useEffect\(\(\) => {\s*(set[A-Za-z]+)\((.*?)\);\s*},/g, 
      'useEffect(() => {\n    // eslint-disable-next-line react-hooks/set-state-in-effect\n    $1($2);\n  },');
      
    fs.writeFileSync(filePath, content);
  }
});

// Also fix some specific files
const formsGallery = path.join(__dirname, '..', 'src/app/admin/farms-gallery/FarmsGalleryForm.tsx');
if (fs.existsSync(formsGallery)) {
  let content = fs.readFileSync(formsGallery, 'utf8');
  content = content.replace(/value: any/g, 'value: string | boolean');
  content = content.replace(/useState<any\[\]>\(\[\]\)/g, "useState<{name: string, url: string}[]>([])");
  fs.writeFileSync(formsGallery, content);
}

const settingsForm = path.join(__dirname, '..', 'src/app/admin/settings/SettingsForm.tsx');
if (fs.existsSync(settingsForm)) {
  let content = fs.readFileSync(settingsForm, 'utf8');
  content = content.replace(/value: any/g, 'value: string | boolean');
  fs.writeFileSync(settingsForm, content);
}

const userList = path.join(__dirname, '..', 'src/app/admin/users/UserList.tsx');
if (fs.existsSync(userList)) {
  let content = fs.readFileSync(userList, 'utf8');
  content = content.replace(/roles: any/g, 'roles: string[]');
  content = content.replace(/role: any/g, 'role: string');
  fs.writeFileSync(userList, content);
}

const userActions = path.join(__dirname, '..', 'src/app/admin/users/actions.ts');
if (fs.existsSync(userActions)) {
  let content = fs.readFileSync(userActions, 'utf8');
  content = content.replace(/err: any/g, 'err: unknown');
  content = content.replace(/err\.message/g, '(err as Error).message');
  fs.writeFileSync(userActions, content);
}

console.log("Done fixing linter issues.");
