#!/usr/bin/env node

/**
 * Directory Tree - CodeMaster Angular
 * Run: node show-structure.js
 */

const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = [
  'node_modules',
  '.angular',
  'dist',
  '.git',
  '.vscode'
];

const IGNORED_FILES = [
  '.DS_Store',
  'Thumbs.db',
  '*.log'
];

function isIgnored(name, isDir) {
  if (IGNORED_DIRS.includes(name)) return true;
  if (IGNORED_FILES.includes(name)) return true;
  return false;
}

function getFileSize(bytes) {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + sizes[i];
}

function getFileIcon(filename) {
  const ext = path.extname(filename).toLowerCase();
  const icons = {
    '.ts': '📜',
    '.html': '🔗',
    '.css': '🎨',
    '.json': '⚙️',
    '.js': '⚙️',
    '.md': '📖',
    '.txt': '📝',
    '.sh': '🔧',
    '.bat': '🔧'
  };
  return icons[ext] || '📄';
}

function printTree(dir, prefix = '', isRoot = true) {
  if (isIgnored(path.basename(dir), true)) return;

  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch (e) {
    return;
  }

  files = files.filter(f => !isIgnored(f, false));
  files.sort((a, b) => {
    const aDir = fs.statSync(path.join(dir, a)).isDirectory();
    const bDir = fs.statSync(path.join(dir, b)).isDirectory();
    if (aDir && !bDir) return -1;
    if (!aDir && bDir) return 1;
    return a.localeCompare(b);
  });

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();
    const isLast = index === files.length - 1;

    const connector = isLast ? '└── ' : '├── ';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');

    if (isDir) {
      console.log(`${prefix}${connector}📁 ${file}/`);
      printTree(filePath, nextPrefix, false);
    } else {
      const icon = getFileIcon(file);
      const size = getFileSize(stat.size);
      console.log(`${prefix}${connector}${icon} ${file} (${size})`);
    }
  });
}

console.log('\n🏗️  CodeMaster Angular - Project Structure\n');
console.log('app_angular/');
printTree('.');
console.log('\n✅ Structure displayed successfully!\n');
