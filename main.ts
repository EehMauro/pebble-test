import fs from 'fs';
import { Parser, AstCompiler, defaultUplcVersion } from '@harmoniclabs/pebble';

async function main() {
  const result = fs.readFileSync('main.pebble', 'utf8');
  const [source, diagnostics] = Parser.parseFile('main.pebble', result);

  // console.log('-- SOURCE --');
  // console.log(source);

  // console.log('-- DIAGNOSTIS --');
  // console.log(diagnostics);

  // console.log('-- COMPILER --');
  
  const compiler = new AstCompiler(
    {
      root: '.',
      entry: 'main.pebble',
      outDir: 'dist',
      targetUplcVersion: defaultUplcVersion,
      removeTraces: false,
      delayHoists: false,
      uplcOptimizations: {},
      addMarker: false,
    },
    {
      stdout: process.stdout,
      stderr: process.stderr,
      readFile: (filename: string, baseDir: string) => fs.readFileSync(`${baseDir}/${filename}`, 'utf8'),
      writeFile: (filename: string, contents: Uint8Array | string, baseDir: string) => fs.writeFileSync(`${baseDir}/${filename}`, contents),
      exsistSync: (filename: string) => fs.existsSync(filename),
      listFiles: (dirname: string, baseDir: string) => fs.readdirSync(`${baseDir}/${dirname}`),
      reportDiagnostic: () => {},
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