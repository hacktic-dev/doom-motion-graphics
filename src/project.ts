import {makeProject} from '@motion-canvas/core';

import fileBytesAndPrograms from './scenes/01-file-bytes-and-programs?scene';
import reconstructingPngData from './scenes/02-reconstructing-png-data?scene';
import rawBytesAsText from './scenes/03-raw-bytes-as-text?scene';
import polyglotFileInterpretations from './scenes/04-polyglot-file-interpretations?scene';

export default makeProject({
  scenes: [
    fileBytesAndPrograms,
    reconstructingPngData,
    rawBytesAsText,
    polyglotFileInterpretations,
  ],
});
