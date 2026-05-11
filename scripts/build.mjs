import { rm } from 'node:fs/promises';

import { rollup } from 'rollup';

import configs from '../rollup.config.mjs';

const run = async () => {
  await rm('dist', { recursive: true, force: true });

  for (const config of configs) {
    const { output, ...inputOptions } = config;
    const bundle = await rollup(inputOptions);

    try {
      const outputs = Array.isArray(output) ? output : [output];

      for (const outputOptions of outputs) {
        await bundle.write(outputOptions);
      }
    } finally {
      await bundle.close();
    }
  }
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
