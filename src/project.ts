import {makeProject} from '@motion-canvas/core';

import whatIsAFileFormat from './scenes/00-what-is-a-file-format?scene';
import fileBytesAndPrograms from './scenes/01-file-bytes-and-programs?scene';
import reconstructingPngData from './scenes/02-reconstructing-png-data?scene';
import rawBytesAsText from './scenes/03-raw-bytes-as-text?scene';
import polyglotFileInterpretations from './scenes/04-polyglot-file-interpretations?scene';
import htmlDoomAndPng from './scenes/05-html-doom-and-png?scene';
import pngChunks from './scenes/06-png-chunks?scene';
import pngMetadata from './scenes/07-png-metadata?scene';
import pngVsHtml from './scenes/08-png-vs-html?scene';
import browserReinterpretsBytes from './scenes/09-browser-reinterprets-bytes?scene';

export default makeProject({
  scenes: [
    whatIsAFileFormat,
    fileBytesAndPrograms,
    reconstructingPngData,
    rawBytesAsText,
    polyglotFileInterpretations,
    htmlDoomAndPng,
    pngChunks,
    pngMetadata,
    pngVsHtml,
    browserReinterpretsBytes,
  ],
});
