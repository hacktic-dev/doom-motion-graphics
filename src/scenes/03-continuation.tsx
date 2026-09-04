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

const rawBytes = ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'];
const textCharacters = ['‰', 'P', 'N', 'G', '·', '·', '·', '·'];
const selectedSquares = [84, 85, 86, 87, 88, 89, 90, 91];

export default makeScene2D(function* (view) {
  const checkerRefs = Array.from({length: 160}, () => createRef<Rect>());
  const byteTextRefs = rawBytes.map(() => createRef<Txt>());
  const glyphRefs = textCharacters.map(() => createRef<Txt>());
  const transparentCircle = createRef<Circle>();
  const editorWindow = createRef<Node>();
  const editorText = createRef<Txt>();

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
                fontSize={46}
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
          <Txt
            ref={editorText}
            text={''}
            x={0}
            y={-55}
            width={930}
            fontSize={35}
            lineHeight={49}
            fontFamily={'monospace'}
            fill={'#222222'}
            textAlign={'left'}
          />
        </Rect>
      </Node>

      {/* Character forms that peel away from the byte tiles. */}
      {glyphRefs.map((ref, index) => (
        <Txt
          ref={ref}
          key={`${index}`}
          text={textCharacters[index]}
          x={(index - 3.5) * 155}
          y={-270}
          fontSize={52}
          fontFamily={'monospace'}
          fontWeight={700}
          fill={'#222222'}
          opacity={0}
          zIndex={3}
        />
      ))}
    </Node>,
  );

  // Collapse the checkerboard cells individually while preserving eight cells.
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
      0.035,
      ...byteRefs.map((ref, index) => all(
        ref().x((index - 3.5) * 155, 0.60, easeInOutCubic),
        ref().y(-270, 0.60, easeInOutCubic),
        ref().width(125, 0.60, easeInOutCubic),
        ref().height(100, 0.60, easeInOutCubic),
        ref().radius(12, 0.60, easeInOutCubic),
        ref().fill('#eeeeee', 0.60, easeInOutCubic),
        ref().stroke('#bdbdbd', 0.60, easeInOutCubic),
        ref().lineWidth(4, 0.60, easeInOutCubic),
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

  // Byte tiles give way to character forms that fall into the editor.
  yield* all(
    sequence(
      0.065,
      ...byteRefs.map((ref, index) => all(
        ref().opacity(0, 0.13, easeOutCubic),
        ref().scale(0.72, 0.13, easeInCubic),
        glyphRefs[index]().opacity(1, 0.10, easeOutCubic),
        glyphRefs[index]().position([(index - 3.5) * 72, -35], 0.46, easeInOutCubic),
        chain(waitFor(0.30), glyphRefs[index]().opacity(0, 0.16, easeOutCubic)),
      )),
    ),
    editorText().text(
      '‰PNG....IHDR...........sRGB....gAMA....\n' +
      '....IDATxœíÝwÜFõÿ÷ß{æÞ....\n' +
      '·÷·²IÎ$K’¬ØŽ¥ø¿ê....\n' +
      '...IEND®B`‚',
      1.15,
      easeInOutCubic,
    ),
  );

  // Hold on the apparently nonsensical text.
  yield* waitFor(1.0);
});
