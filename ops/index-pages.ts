import glob from 'fast-glob';
import { resolvePwd } from '@ops/utils/dirs/pwd';
import { parse, resolve } from 'path';
import { writeFile } from 'fs/promises';
import { TError } from '@brysonandrew/config-types/dom';
import { kebabToPascal } from '@brysonandrew/utils-format';

const WORKSHOP_ROOT = 'src/pages/_dev';
const WORKSHOP_GLOB = resolve(WORKSHOP_ROOT, '**');
const WORKSHOP_INDEX = resolve(WORKSHOP_ROOT, 'index.ts');

const DEPTH = 1;

(async () => {
  try {
    const cwd = resolvePwd();
    const paths = await glob([WORKSHOP_GLOB], {
      deep: DEPTH,
      onlyDirectories: true,
      cwd,
    });

    const file = paths.reduce((a: string, path) => {
      const { base } = parse(path);
      const name = kebabToPascal(base);
      a = `${a}export { ${name} } from './${base}';\n`;
      return a;
    }, '');

    await writeFile(WORKSHOP_INDEX, file);
  } catch (error: TError) {
    throw new Error(error);
  }
})();
