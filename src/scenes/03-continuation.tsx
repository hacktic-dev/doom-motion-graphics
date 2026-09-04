import {Circle, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';

const rawBytes = [
  '89', '50', '4E', '47', '0D', '0A', '1A', '0A',
  '00', '00', '00', '0D', '49', '48', '44', '52',
  '00', '00', '00', '20', '00', '00', '00', '20',
  '08', '06', '00', '00', '00', '73', '7A', '7A',
];
const textCharacters = [
  '‰', 'P', 'N', 'G', '·', '·', '·', '·',
  '·', '·', '·', '·', 'I', 'H', 'D', 'R',
  '·', '·', '·', ' ', '·', '·', '·', ' ',
  '·', '·', '·', '·', '·', 's', 'z', 'z',
];
const selectedSquares = Array.from({length: 32}, (_, index) => 64 + index);
const continuationLines = [
  '....sRGB....gAMA....cHRM....',
  '....IDATxœíÝwÜFõÿ÷ß{æÞ....',
  '·÷·²IÎ$K’¬ØŽ¥ø¿ê....IEND®B`‚',
];
const continuationCharacters = continuationLines.flatMap((line, row) =>
  Array.from(line).map((character, column) => ({character, column, row})),
);

export default makeScene2D(function* (view) {
  const checkerRefs = Array.from({length: 160}, () => createRef<Rect>());
  const byteTextRefs = rawBytes.map(() => createRef<Txt>());
  const glyphRefs = textCharacters.map(() => createRef<Txt>());
  const continuationCharacterRefs = continuationCharacters.map(() => createRef<Txt>());
  const transparentCircle = createRef<Circle>();
  const editorWindow = createRef<Node>();

  const byteRefs = selectedSquares.map(index => checkerRefs[index]);
  const collapsingRefs = checkerRefs.filter((_, index) => !selectedSquares.includes(index));

  view.add(
    <Node scale={1.25}>
      {/* Exact opening state inherited from Scene 2. */}
      {checkerRefs.map((ref, index) => {
        const column = index % 16;
        const row = Math.floor(index / 16);
        const byteIndex = selectedSquares.indexOf(index);

        return (
          <Rect
            ref={ref}
            key={`${index}`}
            x={(column - 7.5) * 100}
            y={(row - 4.5) * 100}
            width={100}
            height={100}
            fill={(column + row) % 2 === 0 ? '#d8d8d8' : '#ffffff'}
          >
            {byteIndex >= 0 ? (
              <Txt
                ref={byteTextRefs[byteIndex]}
                text={rawBytes[byteIndex]}
                fill={'#2b2b2b'}
                fontSize={28}
                fontFamily={'monospace'}
                fontWeight={700}
                opacity={0}
              />
            ) : null}
          </Rect>
        );
      })}

      <Circle
        ref={transparentCircle}
        x={0}
        y={40}
        width={280}
        height={280}
        fill={'#42a5f5'}
        opacity={0.48}
        scale={1.5}
        zIndex={2}
      />

      {/* Fake text editor, matching the established visual style. */}
      <Node ref={editorWindow} y={130} opacity={0} scale={0.86}>
        <Rect
          width={1050}
          height={520}
          radius={18}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.22)'}
          shadowBlur={24}
          shadowOffsetY={11}
          clip
        >
          <Rect width={1050} height={52} y={-234} fill={'#2f3238'} />
          <Circle width={15} height={15} x={-495} y={-234} fill={'#ff5f57'} />
          <Circle width={15} height={15} x={-469} y={-234} fill={'#febc2e'} />
          <Circle width={15} height={15} x={-443} y={-234} fill={'#28c840'} />
          <Txt
            text={'Text Editor'}
            x={-303}
            y={-234}
            width={245}
            fontSize={27}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
            textAlign={'left'}
          />
          {continuationCharacters.map(({character, column, row}, index) => (
            <Txt
              ref={continuationCharacterRefs[index]}
              key={`${index}`}
              text={character}
              x={-449.5 + column * 29}
              y={-106 + row * 49}
              fontSize={32}
              fontFamily={'monospace'}
              fontWeight={700}
              fill={'#222222'}
              opacity={0}
              scale={[0, 1]}
            />
          ))}
        </Rect>
      </Node>

      {/* Character forms that peel away from the byte tiles. */}
      {glyphRefs.map((ref, index) => (
        <Txt
          ref={ref}
          key={`${index}`}
          text={textCharacters[index]}
          x={(index % 16 - 7.5) * 90}
          y={-300 + Math.floor(index / 16) * 82}
          fontSize={32}
          fontFamily={'monospace'}
          fontWeight={700}
          fill={'#222222'}
          opacity={0}
          scale={[0, 1]}
          zIndex={3}
        />
      ))}
    </Node>,
  );

  function* flipByteIntoEditor(index: number) {
    const tile = byteRefs[index]();
    const glyph = glyphRefs[index]();
    const targetX = (index - 15.5) * 29;

    yield* tile.scale([0, 1], 0.09, easeInCubic);
    tile.opacity(0);
    glyph.opacity(1);

    yield* all(
      glyph.scale([1, 1], 0.09, easeOutCubic),
      glyph.position([targetX, -25], 0.38, easeInOutCubic),
    );
  }

  // Collapse the checkerboard cells individually while preserving 32 cells.
  yield* all(
    transparentCircle().opacity(0, 0.28, easeOutCubic),
    transparentCircle().scale(0.25, 0.32, easeInCubic),
    sequence(
      0.0035,
      ...collapsingRefs.map(ref => all(
        ref().opacity(0, 0.22, easeOutCubic),
        ref().scale(0.12, 0.22, easeInCubic),
      )),
    ),
    sequence(
      0.015,
      ...byteRefs.map((ref, index) => all(
        ref().x((index % 16 - 7.5) * 90, 0.60, easeInOutCubic),
        ref().y(-300 + Math.floor(index / 16) * 82, 0.60, easeInOutCubic),
        ref().width(80, 0.60, easeInOutCubic),
        ref().height(64, 0.60, easeInOutCubic),
        ref().radius(8, 0.60, easeInOutCubic),
        ref().fill('#eeeeee', 0.60, easeInOutCubic),
        ref().stroke('#bdbdbd', 0.60, easeInOutCubic),
        ref().lineWidth(3, 0.60, easeInOutCubic),
        chain(waitFor(0.31), byteTextRefs[index]().opacity(1, 0.20, easeOutCubic)),
      )),
    ),
  );

  yield* waitFor(0.28);

  // The wrong application opens around the same underlying bytes.
  yield* all(
    editorWindow().opacity(1, 0.30, easeOutCubic),
    editorWindow().scale(1, 0.42, easeOutCubic),
  );

  const BYTE_STAGGER = 0.025;

  // Keep the boundary continuous: the first generated character starts one
  // stagger interval after the final byte-derived character starts flipping.
  yield* all(
    sequence(
      BYTE_STAGGER,
      ...byteRefs.map((_, index) => flipByteIntoEditor(index)),
    ),
    chain(
      waitFor(BYTE_STAGGER * byteRefs.length),
      sequence(
        0.015,
        ...continuationCharacterRefs.map(ref => all(
          ref().opacity(1, 0.08, easeOutCubic),
          ref().scale([1, 1], 0.12, easeOutCubic),
        )),
      ),
    ),
  );

  // Hold on the apparently nonsensical text.
  yield* waitFor(1.0);
});
