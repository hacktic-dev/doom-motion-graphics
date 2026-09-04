import {makeProject} from '@motion-canvas/core';

import pngToBytes from './scenes/01-png-to-bytes?scene';
import continuation from './scenes/02-continuation?scene';
import nextSection from './scenes/03-continuation?scene';
import polyglot from './scenes/04-continuation?scene';

export default makeProject({
  scenes: [pngToBytes, continuation, nextSection, polyglot],
});
