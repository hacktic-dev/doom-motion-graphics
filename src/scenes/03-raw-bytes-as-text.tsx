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


const COLORS = {
  background: '#21232E',
  card: '#343746',
  panel: '#2B2E3B',
  panelDeep: '#242733',
  windowShell: '#2C2F3B',
  titlebar: '#1B1D26',
  border: '#50566A',
  borderStrong: '#646B82',
  text: '#F4F6FA',
  textMuted: '#AEB5C6',
  mutedBar: '#697187',
  accent: '#8C7CFF',
  accentGlow: 'rgba(140,124,255,0.24)',
  shadow: 'rgba(0,0,0,0.38)',
  shadowSoft: 'rgba(0,0,0,0.28)',
  code: '#D8DCE7',
  checkerA: '#343746',
  checkerB: '#242733',
  redFill: '#533238',
  redText: '#FF7777',
  greenFill: '#2E4438',
  greenText: '#78D996',
  blueFill: '#2D4054',
  blueText: '#72B8FF',
};

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

const channelFills = [
  COLORS.redFill,
  COLORS.greenFill,
  COLORS.blueFill,
];

const channelTextColors = [
  COLORS.redText,
  COLORS.greenText,
  COLORS.blueText,
];

const rgbGroupStarts = [
  0, 3, 6, 9, 12,
  16, 19, 22, 25, 28,
];

const combinedPixelColors = rgbGroupStarts.map(start =>
  `#${rawBytes.slice(start, start + 3).join('')}`,
);

const selectedSquares = Array.from(
  {length: 32},
  (_, index) => 64 + index,
);

const continuationLines = [
  '....sRGB....gAMA....cHRM....',
  '....IDATxœíÝwÜFõÿ÷ß{æÞ....',
  '·÷·²IÎ$K’¬ØŽ¥ø¿ê....IEND®B`‚',
];

const continuationCharacters = continuationLines.flatMap(
  (line, row) =>
    Array.from(line).map((character, column) => ({
      character,
      column,
      row,
    })),
);

export default makeScene2D(function* (view) {
  const checkerRefs = Array.from(
    {length: 160},
    () => createRef<Rect>(),
  );

  const byteTextRefs = rawBytes.map(
    () => createRef<Txt>(),
  );

  const previewGlyphRefs = textCharacters.map(
    () => createRef<Txt>(),
  );

  const glyphRefs = textCharacters.map(
    () => createRef<Txt>(),
  );

  const continuationCharacterRefs =
    continuationCharacters.map(
      () => createRef<Txt>(),
    );

  const transparentCircle = createRef<Circle>();
  const editorWindow = createRef<Node>();

  const ending = createRef<Node>();

  const endingPairRefs = rawBytes
    .slice(0, 4)
    .map(() => createRef<Node>());

  const endingByteRefs = rawBytes
    .slice(0, 4)
    .map(() => createRef<Txt>());

  const endingGlyphRefs = textCharacters
    .slice(0, 4)
    .map(() => createRef<Txt>());

  const combinedPixelRefs = combinedPixelColors.map(
    () => createRef<Rect>(),
  );

  const byteRefs = selectedSquares.map(
    index => checkerRefs[index],
  );

  const collapsingRefs = checkerRefs.filter(
    (_, index) => !selectedSquares.includes(index),
  );

  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={COLORS.background}
      zIndex={-100}
    />,
  );

  view.add(
    <Node scale={1.25}>
      {/* Opening checkerboard state. */}
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
            fill={
              (column + row) % 2 === 0
                ? COLORS.checkerA
                : COLORS.checkerB
            }
          >
            {byteIndex >= 0 ? (
              <>
                <Txt
                  ref={byteTextRefs[byteIndex]}
                  text={rawBytes[byteIndex]}
                  fill={COLORS.text}
                  fontSize={28}
                  fontFamily={'monospace'}
                  fontWeight={700}
                  opacity={0}
                />

                <Txt
                  ref={previewGlyphRefs[byteIndex]}
                  text={''}
                  fill={COLORS.text}
                  fontSize={30}
                  fontFamily={'monospace'}
                  fontWeight={700}
                  opacity={0}
                />
              </>
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
        fill={COLORS.blueText}
        opacity={0.48}
        scale={1.5}
        zIndex={2}
      />

      {/* RGB trios combine into coloured pixels. */}
      {combinedPixelColors.map((color, index) => {
        const row = Math.floor(index / 5);
        const group = index % 5;

        return (
          <Rect
            ref={combinedPixelRefs[index]}
            key={`pixel-${index}`}
            x={(group * 3 + 1 - 7.5) * 90}
            y={row === 0 ? -170 : 170}
            width={190}
            height={82}
            radius={16}
            fill={color}
            stroke={COLORS.borderStrong}
            lineWidth={5}
            opacity={0}
            scale={0.2}
            zIndex={4}
          />
        );
      })}

      {/* Text editor. */}
      <Node
        ref={editorWindow}
        y={130}
        opacity={0}
        scale={0.86}
      >
        <Rect
          width={1050}
          height={520}
          radius={18}
          fill={COLORS.windowShell}
          shadowColor={COLORS.shadow}
          shadowBlur={24}
          shadowOffsetY={11}
          clip
        >
          <Rect
            width={1050}
            height={52}
            y={-234}
            fill={COLORS.titlebar}
          />

          <Rect
            width={1010}
            height={430}
            y={27}
            radius={12}
            fill={COLORS.panelDeep}
            stroke={COLORS.border}
            lineWidth={2}
          />

          <Circle
            width={15}
            height={15}
            x={-495}
            y={-234}
            fill={'#ff5f57'}
          />

          <Circle
            width={15}
            height={15}
            x={-469}
            y={-234}
            fill={'#febc2e'}
          />

          <Circle
            width={15}
            height={15}
            x={-443}
            y={-234}
            fill={'#28c840'}
          />

          <Txt
            text={'image.png — Text Editor'}
            x={-303}
            y={-234}
            width={245}
            fontSize={27}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={COLORS.text}
            textAlign={'left'}
          />

          {continuationCharacters.map(
            ({character, column, row}, index) => (
              <Txt
                ref={continuationCharacterRefs[index]}
                key={`${index}`}
                text={character}
                x={-449.5 + column * 29}
                y={-106 + row * 49}
                fontSize={32}
                fontFamily={'monospace'}
                fontWeight={700}
                fill={COLORS.code}
                opacity={0}
                scale={[0, 1]}
              />
            ),
          )}
        </Rect>

        {/* Draw the outline last so the clipped title bar cannot obscure the top edge. */}
        <Rect
          width={1050}
          height={520}
          radius={18}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.borderStrong}
          lineWidth={3}
        />
      </Node>

      {/* Characters that move from the bytes into the editor. */}
      {glyphRefs.map((ref, index) => (
        <Txt
          ref={ref}
          key={`${index}`}
          text={textCharacters[index]}
          x={(index % 16 - 7.5) * 90}
          y={
            -300 +
            Math.floor(index / 16) * 82
          }
          fontSize={32}
          fontFamily={'monospace'}
          fontWeight={700}
          fill={COLORS.code}
          opacity={0}
          scale={[0, 1]}
          zIndex={3}
        />
      ))}

      {/* Final four-byte close-up. */}
      <Node
        ref={ending}
        opacity={0}
        zIndex={5}
      >
        {rawBytes.slice(0, 4).map(
          (byte, index) => (
            <Node
              ref={endingPairRefs[index]}
              key={`${byte}-${index}`}
              x={(index - 1.5) * 270}
              scale={0.8}
            >
              <Rect
                width={205}
                height={170}
                radius={24}
                fill={COLORS.card}
                stroke={COLORS.borderStrong}
                lineWidth={5}
              >
                <Txt
                  ref={endingByteRefs[index]}
                  text={byte}
                  fill={COLORS.text}
                  fontSize={66}
                  fontFamily={'monospace'}
                  fontWeight={700}
                />

                <Txt
                  ref={endingGlyphRefs[index]}
                  text={textCharacters[index]}
                  fill={COLORS.text}
                  fontSize={72}
                  fontFamily={'monospace'}
                  fontWeight={700}
                  scale={[0, 1]}
                  opacity={0}
                />
              </Rect>
            </Node>
          ),
        )}
      </Node>
    </Node>,
  );

  function* flipByteIntoEditor(index: number) {
    const tile = byteRefs[index]();
    const glyph = glyphRefs[index]();

    const targetX =
      (index - 15.5) * 29;

    yield* tile.scale(
      [0, 1],
      0.12,
      easeInCubic,
    );

    tile.opacity(0);
    glyph.opacity(1);

    yield* all(
      glyph.scale(
        [1, 1],
        0.12,
        easeOutCubic,
      ),

      glyph.position(
        [targetX, -25],
        0.42,
        easeInOutCubic,
      ),
    );
  }

  function* flipTileTo(
    index: number,
    mode: 'color' | 'bytes',
  ) {
    const tile = byteRefs[index]();
    const byteText = byteTextRefs[index]();
    const preview = previewGlyphRefs[index]();

    /*
     * Each tile itself takes 0.28 seconds to flip.
     * Together with the column stagger this creates a clear
     * left-to-right wave.
     */
    yield* tile.scale(
      [0, 1],
      0.14,
      easeInCubic,
    );

    if (mode === 'bytes') {
      tile.fill(COLORS.card);
      tile.stroke(COLORS.borderStrong);

      byteText.opacity(1);
      preview.opacity(0);
    }

    if (mode === 'color') {
      byteText.opacity(0);
      preview.opacity(1);

      const column = index % 16;

      if (column === 15) {
        tile.fill(COLORS.panel);
        tile.stroke(COLORS.border);

        preview.text('…');
        preview.fill(COLORS.textMuted);
        preview.fontSize(28);
      } else {
        const channel = column % 3;

        tile.fill(channelFills[channel]);
        tile.stroke(channelTextColors[channel]);

        preview.text(
          `${['R', 'G', 'B'][channel]}${rawBytes[index]}`,
        );

        preview.fill(
          channelTextColors[channel],
        );

        preview.fontSize(18);
      }
    }

    yield* tile.scale(
      [1, 1],
      0.14,
      easeOutCubic,
    );
  }

  function* flipGridTo(
    mode: 'color' | 'bytes',
  ) {
    yield* sequence(
      /*
       * 55 ms between columns makes the change visibly
       * travel across the grid instead of happening almost at once.
       */
      0.055,

      ...Array.from(
        {length: 16},
        (_, column) =>
          all(
            flipTileTo(column, mode),
            flipTileTo(
              column + 16,
              mode,
            ),
          ),
      ),
    );
  }

  /*
   * ---------------------------------------------------------
   * 1. CHECKERBOARD → RAW BYTES
   * ---------------------------------------------------------
   *
   * Approximately 0.00s → 1.07s
   */

  yield* all(
    transparentCircle().opacity(
      0,
      0.36,
      easeOutCubic,
    ),

    transparentCircle().scale(
      0.25,
      0.40,
      easeInCubic,
    ),

    sequence(
      0.004,

      ...collapsingRefs.map(ref =>
        all(
          ref().opacity(
            0,
            0.26,
            easeOutCubic,
          ),

          ref().scale(
            0.12,
            0.26,
            easeInCubic,
          ),
        ),
      ),
    ),

    sequence(
      0.012,

      ...byteRefs.map((ref, index) =>
        all(
          ref().x(
            (index % 16 - 7.5) * 90,
            0.70,
            easeInOutCubic,
          ),

          ref().y(
            (
              Math.floor(index / 16) -
              0.5
            ) * 82,
            0.70,
            easeInOutCubic,
          ),

          ref().width(
            80,
            0.70,
            easeInOutCubic,
          ),

          ref().height(
            64,
            0.70,
            easeInOutCubic,
          ),

          ref().radius(
            8,
            0.70,
            easeInOutCubic,
          ),

          ref().fill(
            COLORS.card,
            0.70,
            easeInOutCubic,
          ),

          ref().stroke(
            COLORS.borderStrong,
            0.70,
            easeInOutCubic,
          ),

          ref().lineWidth(
            3,
            0.70,
            easeInOutCubic,
          ),

          chain(
            waitFor(0.36),

            byteTextRefs[index]().opacity(
              1,
              0.20,
              easeOutCubic,
            ),
          ),
        ),
      ),
    ),
  );

  /*
   * Give the raw bytes a small moment to register.
   *
   * ~1.07s → 1.27s
   */
  yield* waitFor(0.20);

  /*
   * ---------------------------------------------------------
   * 2. RAW BYTES → COLOUR
   * ---------------------------------------------------------
   *
   * ~1.27s → 2.38s
   */

  yield* flipGridTo('color');

  /*
   * Bring the combined RGB pixels up on top.
   *
   * ~2.38s → 2.68s
   */
  yield* all(
    ...combinedPixelRefs.map(ref =>
      all(
        ref().opacity(
          1,
          0.24,
          easeOutCubic,
        ),

        ref().scale(
          1,
          0.30,
          easeOutCubic,
        ),
      ),
    ),
  );

  /*
   * Hold the finished colour interpretation.
   *
   * ~2.68s → 3.63s
   */
  yield* waitFor(0.95);

  /*
   * ---------------------------------------------------------
   * 3. COLOUR → RAW BYTES
   * ---------------------------------------------------------
   *
   * ~3.63s → 4.73s
   *
   * The early "text interpretation" pass is intentionally
   * completely skipped.
   */

  yield* all(
    ...combinedPixelRefs.map(ref =>
      all(
        ref().opacity(
          0,
          0.20,
          easeInCubic,
        ),

        ref().scale(
          0.3,
          0.22,
          easeInCubic,
        ),
      ),
    ),

    flipGridTo('bytes'),
  );

  /*
   * Small beat on the restored raw-byte view.
   *
   * ~4.73s → 4.98s
   */
  yield* waitFor(0.25);

  /*
   * ---------------------------------------------------------
   * 4. TEXT EDITOR BEGINS APPEARING
   * ---------------------------------------------------------
   *
   * Starts at approximately 4.98 seconds.
   */

  yield* all(
    editorWindow().opacity(
      1,
      0.50,
      easeOutCubic,
    ),

    editorWindow().scale(
      1,
      0.60,
      easeOutCubic,
    ),

    ...byteRefs.map((ref, index) =>
      ref().y(
        -300 +
          Math.floor(index / 16) * 82,
        0.65,
        easeInOutCubic,
      ),
    ),
  );

  /*
   * Let the new composition settle briefly before
   * we start translating bytes into characters.
   */
  yield* waitFor(0.22);

  /*
   * ---------------------------------------------------------
   * 5. BYTES → CHARACTERS INSIDE THE EDITOR
   * ---------------------------------------------------------
   *
   * This is now the only text-interpretation demonstration,
   * so it has more room to breathe.
   */

  const BYTE_STAGGER = 0.03;

  yield* all(
    sequence(
      BYTE_STAGGER,

      ...byteRefs.map(
        (_, index) =>
          flipByteIntoEditor(index),
      ),
    ),

    chain(
      waitFor(
        BYTE_STAGGER *
          byteRefs.length,
      ),

      sequence(
        0.018,

        ...continuationCharacterRefs.map(
          ref =>
            all(
              ref().opacity(
                1,
                0.10,
                easeOutCubic,
              ),

              ref().scale(
                [1, 1],
                0.15,
                easeOutCubic,
              ),
            ),
        ),
      ),
    ),
  );

  /*
   * Hold on the finished garbage-text result.
   */
  yield* waitFor(1.10);

  /*
   * ---------------------------------------------------------
   * 6. EDITOR → FOUR-BYTE CLOSE-UP
   * ---------------------------------------------------------
   */

  yield* all(
    editorWindow().y(
      700,
      0.62,
      easeInCubic,
    ),

    editorWindow().opacity(
      0,
      0.52,
      easeInCubic,
    ),

    ...glyphRefs.map(ref =>
      ref().opacity(
        0,
        0.46,
        easeInCubic,
      ),
    ),

    ending().opacity(
      1,
      0.48,
      easeOutCubic,
    ),

    ...endingPairRefs.map(ref =>
      ref().scale(
        1,
        0.62,
        easeOutCubic,
      ),
    ),
  );

  /*
   * ---------------------------------------------------------
   * 7. HEX BYTES → TEXT CHARACTERS
   * ---------------------------------------------------------
   */

  yield* sequence(
    0.65,

    ...endingPairRefs.map(
      (ref, index) =>
        chain(
          ref().scale(
            [0, 1],
            0.20,
            easeInCubic,
          ),

          all(
            endingByteRefs[index]().opacity(
              0,
              0,
            ),

            endingGlyphRefs[index]().opacity(
              1,
              0,
            ),

            endingGlyphRefs[index]().scale(
              [1, 1],
              0,
            ),

            ref().scale(
              [1, 1],
              0.20,
              easeOutCubic,
            ),
          ),
        ),
    ),
  );

  /*
   * Final breathing room.
   */
  yield* waitFor(0.65);
});