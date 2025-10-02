import fs from 'fs';
import { Parser, Compiler, defaultUplcVersion } from '@harmoniclabs/pebble';

// import Parser from 'tree-sitter';
// const Pebble = require('tree-sitter-pebble');

// const parser = new Parser();
// parser.setLanguage(Pebble);

const FILE = 'examples/test.pebble';

async function main() {
  const result = fs.readFileSync(FILE, 'utf8');
  
  // const tree = parser.parse(result);
  
  // console.log('-- TREE --');
  // console.log(tree.rootNode);
  // console.log(tree.rootNode.children);

  const [source, diagnostics] = Parser.parseFile(FILE, result);
  
  // console.log('-- SOURCE --');
  // console.log(source);

  // console.log('-- DIAGNOSTIS --');
  // console.log(diagnostics);

  // console.log('-- COMPILER --');
  const compiler = new Compiler(
    {
      stdout: process.stdout,
      stderr: process.stderr,
      readFile: (filename: string, baseDir: string) => fs.readFileSync(`${baseDir}/${filename}`, 'utf8'),
      writeFile: (filename: string, contents: Uint8Array | string, baseDir: string) => fs.writeFileSync(`${baseDir}/${filename}`, contents),
      exsistSync: (filename: string) => fs.existsSync(filename),
      listFiles: (dirname: string, baseDir: string) => fs.readdirSync(`${baseDir}/${dirname}`),
      reportDiagnostic: () => {},
    },
    {
      root: '.',
      entry: FILE,
      outDir: 'dist',
      targetUplcVersion: defaultUplcVersion,
      removeTraces: false,
      delayHoists: false,
      uplcOptimizations: {},
      addMarker: false,
    },
    diagnostics
  );

  const program = await compiler.compile();

  console.log(program);
}

main().catch((error) => {
  console.error('ERROR');
  console.dir(error, { depth: null });
  process.exit(1);
});