import {
  Circle,
  Line,
  Node,
  Rect,
  Txt,
  makeScene2D,
} from '@motion-canvas/2d';
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

import {PngPreview} from '../components/PngPreview';

const COLORS = {
  background: '#21232E',
  card: '#3A3E52',
  panel: '#4A5066',
  border: '#69708D',
  text: '#F4F6FA',
  textMuted: '#C4CBDA',
  accent: '#8C7CFF',
  blue: '#75B8EC',
  green: '#70B879',
  yellow: '#F3C24F',
  orange: '#F09A57',
  purple: '#A996FF',
  shadow: 'rgba(0,0,0,0.24)',
};

const CHUNKS = [
  {name: 'IHDR', color: COLORS.blue, x: -600, y: -250},
  {name: 'tEXt', color: COLORS.orange, x: 0, y: -250},
  {name: 'IDAT', color: COLORS.green, x: 600, y: -250},
  {name: 'gAMA', color: COLORS.purple, x: -600, y: 250},
  {name: 'IDAT', color: COLORS.green, x: 0, y: 250},
  {name: 'IEND', color: COLORS.yellow, x: 600, y: 250},
] as const;

function FileShape() {
  return (
    <Node>
      <Line
        points={[
          [-90, -112],
          [38, -112],
          [90, -60],
          [90, 112],
          [-90, 112],
        ]}
        closed
        fill={COLORS.card}
        stroke={COLORS.border}
        lineWidth={5}
        radius={15}
        shadowColor={COLORS.shadow}
        shadowBlur={22}
        shadowOffsetY={10}
      />
      <Line
        points={[[38, -112], [38, -60], [90, -60]]}
        stroke={COLORS.border}
        lineWidth={5}
      />
      <Line
        points={[[38, -112], [90, -60]]}
        stroke={COLORS.border}
        lineWidth={5}
      />
    </Node>
  );
}

function ChunkCard({
  name,
  color,
  width = 430,
  height = 210,
}: {
  name: string;
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <Rect
      width={width}
      height={height}
      radius={46}
      fill={COLORS.card}
      stroke={COLORS.border}
      lineWidth={5}
      shadowColor={COLORS.shadow}
      shadowBlur={22}
      shadowOffsetY={10}
    >
      <Rect
        width={138}
        height={38}
        radius={16}
        x={-100}
        y={-52}
        fill={color}
      />
      <Txt
        text={name}
        x={-100}
        y={-52}
        fill={COLORS.background}
        fontFamily={'monospace'}
        fontWeight={700}
        fontSize={29}
      />

      {/* Every chunk starts with the same neutral contents. */}
      <Rect
        width={230}
        height={20}
        radius={10}
        y={16}
        fill={'rgba(255,255,255,0.12)'}
      />
      <Rect
        width={150}
        height={14}
        radius={7}
        y={54}
        fill={'rgba(255,255,255,0.08)'}
      />
    </Rect>
  );
}

function ImageDataChunkCard() {
  return (
    <Rect
      width={390}
      height={190}
      radius={44}
      fill={COLORS.card}
      stroke={COLORS.border}
      lineWidth={5}
      shadowColor={COLORS.shadow}
      shadowBlur={22}
      shadowOffsetY={10}
    >
      <Rect
        width={128}
        height={36}
        radius={15}
        x={-88}
        y={-46}
        fill={COLORS.green}
      />
      <Txt
        text={'IDAT'}
        x={-88}
        y={-46}
        fill={COLORS.background}
        fontFamily={'monospace'}
        fontWeight={700}
        fontSize={28}
      />

      {/* The image-data chunks visibly contain little pixel payloads. */}
      {[
        {x: -46, y: 28, fill: COLORS.blue},
        {x: -14, y: 28, fill: COLORS.green},
        {x: 18, y: 28, fill: COLORS.yellow},
        {x: -30, y: 60, fill: COLORS.orange},
        {x: 2, y: 60, fill: COLORS.purple},
      ].map((cell, index) => (
        <Rect
          key={`idat-payload-${index}`}
          x={cell.x}
          y={cell.y}
          width={24}
          height={24}
          radius={6}
          fill={cell.fill}
        />
      ))}
    </Rect>
  );
}

function TagIcon() {
  return (
    <Node>
      <Line
        points={[
          [-62, -30],
          [30, -30],
          [62, 0],
          [30, 30],
          [-62, 30],
        ]}
        closed
        fill={COLORS.blue}
        stroke={COLORS.blue}
        lineWidth={4}
        radius={14}
      />
      <Circle width={16} height={16} x={26} fill={COLORS.background} />
      <Txt
        text={'A'}
        x={-12}
        y={1}
        fill={COLORS.background}
        fontFamily={'Arial'}
        fontWeight={900}
        fontSize={36}
      />
    </Node>
  );
}

function PayloadIcon() {
  return (
    <Node>
      {[
        {x: -48, y: -28, fill: COLORS.blue},
        {x: -10, y: -28, fill: COLORS.green},
        {x: 28, y: -28, fill: COLORS.orange},
        {x: -29, y: 10, fill: COLORS.purple},
        {x: 9, y: 10, fill: COLORS.yellow},
        {x: 47, y: 10, fill: COLORS.green},
      ].map((cell, index) => (
        <Rect
          key={`payload-icon-${index}`}
          x={cell.x}
          y={cell.y}
          width={28}
          height={28}
          radius={7}
          fill={cell.fill}
        />
      ))}
    </Node>
  );
}

function ShieldCheckIcon() {
  return (
    <Node>
      <Line
        points={[
          [0, -58],
          [46, -34],
          [38, 18],
          [0, 58],
          [-38, 18],
          [-46, -34],
        ]}
        closed
        fill={'rgba(243,194,79,0.20)'}
        stroke={COLORS.yellow}
        lineWidth={6}
        radius={12}
      />
      <Line
        points={[[-18, 2], [-4, 18], [24, -16]]}
        stroke={COLORS.yellow}
        lineWidth={10}
        lineCap={'round'}
        lineJoin={'round'}
      />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const startFile = createRef<Node>();

  const chunkStage = createRef<Node>();
  const chunkRefs = Array.from({length: CHUNKS.length}, () => createRef<Node>());

  // The first IDAT chunk becomes the expanded chunk later.
  const focusChunk = chunkRefs[2];
  const focusShell = createRef<Rect>();
  const focusHeader = createRef<Node>();
  const focusNeutralBody = createRef<Node>();
  const typePart = createRef<Node>();
  const dataPart = createRef<Node>();
  const checkPart = createRef<Node>();

  const imageStage = createRef<Node>();
  const imageChunkA = createRef<Node>();
  const imageChunkB = createRef<Node>();
  const imageCard = createRef<Node>();
  const pngPreview = createRef<Node>();

  const PIXEL_COLS = 14;
  const PIXEL_ROWS = 10;
  const PIXEL_COUNT = PIXEL_COLS * PIXEL_ROWS;
  const pixelRefs = Array.from({length: PIXEL_COUNT}, () => createRef<Rect>());

  // Placeholder metadata section restored with the same timing as the earlier version.
  const metadataStage = createRef<Node>();
  const metadataChipRefs = Array.from({length: 4}, () => createRef<Node>());
  const metaChunkA = createRef<Node>();
  const metaChunkB = createRef<Node>();

  view.add(
    <Rect width={'100%'} height={'100%'} fill={COLORS.background} zIndex={-100} />,
  );

  view.add(
    <Node>
      {/* Exact handoff frame from Scene 5. */}
      <Node ref={startFile} x={0} y={0} opacity={1} scale={1.20} zIndex={20}>
        <FileShape />
        {[
          '#75b8ec',
          COLORS.accent,
          '#70b879',
          '#a996ff',
          '#f3c24f',
          '#735ee7',
        ].map((color, index) => (
          <Rect
            key={`fusion-${index}`}
            width={105 - (index % 3) * 12}
            height={13}
            radius={7}
            y={-32 + index * 20}
            fill={color}
          />
        ))}
      </Node>

      {/* Six consistent, larger named PNG chunks. */}
      <Node ref={chunkStage} opacity={0}>
        {CHUNKS.map((chunk, index) => (
          <Node
            ref={chunkRefs[index]}
            key={`chunk-${chunk.name}-${index}`}
            x={0}
            y={0}
            opacity={0}
            scale={0.32}
            zIndex={index === 2 ? 8 : 1}
          >
            {index === 2 ? (
              <Rect
                ref={focusShell}
                width={430}
                height={210}
                radius={46}
                fill={COLORS.card}
                stroke={COLORS.border}
                lineWidth={5}
                shadowColor={COLORS.shadow}
                shadowBlur={22}
                shadowOffsetY={10}
              >
                <Node ref={focusHeader}>
                  <Rect
                    width={138}
                    height={38}
                    radius={16}
                    x={-100}
                    y={-52}
                    fill={chunk.color}
                  />
                  <Txt
                    text={chunk.name}
                    x={-100}
                    y={-52}
                    fill={COLORS.background}
                    fontFamily={'monospace'}
                    fontWeight={700}
                    fontSize={29}
                  />
                </Node>

                <Node ref={focusNeutralBody}>
                  <Rect
                    width={230}
                    height={20}
                    radius={10}
                    y={16}
                    fill={'rgba(255,255,255,0.12)'}
                  />
                  <Rect
                    width={150}
                    height={14}
                    radius={7}
                    y={54}
                    fill={'rgba(255,255,255,0.08)'}
                  />
                </Node>

                <Node ref={typePart} x={-420} opacity={0} scale={0.70}>
                  <Rect
                    width={330}
                    height={300}
                    radius={42}
                    fill={'rgba(117,184,236,0.10)'}
                    stroke={COLORS.blue}
                    lineWidth={5}
                  />
                  <Node y={-38}>
                    <TagIcon />
                  </Node>
                  <Txt
                    text={'type'}
                    y={102}
                    fill={COLORS.text}
                    fontFamily={'Arial'}
                    fontWeight={700}
                    fontSize={40}
                  />
                </Node>

                <Node ref={dataPart} x={0} opacity={0} scale={0.70}>
                  <Rect
                    width={330}
                    height={300}
                    radius={42}
                    fill={'rgba(112,184,121,0.10)'}
                    stroke={COLORS.green}
                    lineWidth={5}
                  />
                  <Node y={-38}>
                    <PayloadIcon />
                  </Node>
                  <Txt
                    text={'data'}
                    y={102}
                    fill={COLORS.text}
                    fontFamily={'Arial'}
                    fontWeight={700}
                    fontSize={40}
                  />
                </Node>

                <Node ref={checkPart} x={420} opacity={0} scale={0.70}>
                  <Rect
                    width={330}
                    height={300}
                    radius={42}
                    fill={'rgba(243,194,79,0.10)'}
                    stroke={COLORS.yellow}
                    lineWidth={5}
                  />
                  <Node y={-34}>
                    <ShieldCheckIcon />
                  </Node>
                  <Txt
                    text={'check'}
                    y={102}
                    fill={COLORS.text}
                    fontFamily={'Arial'}
                    fontWeight={700}
                    fontSize={40}
                  />
                </Node>
              </Rect>
            ) : (
              <ChunkCard name={chunk.name} color={chunk.color} />
            )}
          </Node>
        ))}
      </Node>

      {/* Image-data example. */}
      <Node ref={imageStage} opacity={0}>
        <Node ref={imageChunkA} x={-620} y={-200} opacity={0} scale={0.82}>
          <ImageDataChunkCard />
        </Node>
        <Node ref={imageChunkB} x={-620} y={200} opacity={0} scale={0.82}>
          <ImageDataChunkCard />
        </Node>

        <Node ref={imageCard} x={360} y={0} opacity={0} scale={0.82}>
          {/* A real image-viewer style window, matching the visual language of the earlier windows. */}
          <Rect
            width={800}
            height={620}
            radius={34}
            fill={COLORS.card}
            stroke={COLORS.border}
            lineWidth={5}
            shadowColor={COLORS.shadow}
            shadowBlur={28}
            shadowOffsetY={12}
            clip
          >
            <Rect
              width={800}
              height={64}
              y={-278}
              fill={'#2C2F3B'}
            />
            <Circle width={17} height={17} x={-350} y={-278} fill={'#ff5f57'} />
            <Circle width={17} height={17} x={-318} y={-278} fill={'#febc2e'} />
            <Circle width={17} height={17} x={-286} y={-278} fill={'#28c840'} />
            <Txt
              text={'image.png'}
              y={-278}
              fill={COLORS.textMuted}
              fontFamily={'monospace'}
              fontSize={24}
            />

            <Rect
              width={650}
              height={430}
              y={30}
              radius={28}
              fill={COLORS.background}
              stroke={COLORS.panel}
              lineWidth={3}
            />

            {/* Same visual footprint as the completed 14x10 pixel grid. */}
            <Node ref={pngPreview} y={30} opacity={0} scale={3.65}>
              <PngPreview />
            </Node>
          </Rect>
        </Node>

        {Array.from({length: PIXEL_COUNT}, (_, index) => {
          const sourceTop = index % 2 === 0;
          const sourceX = -520 + (index % 5) * 22;
          const sourceY =
            (sourceTop ? -200 : 200) + (((index * 3) % 7) - 3) * 18;

          return (
            <Rect
              ref={pixelRefs[index]}
              key={`pixel-${index}`}
              x={sourceX}
              y={sourceY}
              width={30}
              height={30}
              radius={6}
              fill={[
                COLORS.blue,
                COLORS.green,
                COLORS.yellow,
                COLORS.purple,
                COLORS.green,
                COLORS.orange,
              ][index % 6]}
              opacity={0}
              scale={0.55}
            />
          );
        })}
      </Node>

      {/* Placeholder metadata section, deliberately left in the older form for now. */}
      <Node ref={metadataStage} opacity={0}>
        <Node ref={metaChunkA} x={-430} y={-95} opacity={0} scale={0.84}>
          <ChunkCard name={'tEXt'} color={COLORS.orange} width={230} height={116} />
        </Node>

        <Node ref={metaChunkB} x={-430} y={145} opacity={0} scale={0.84}>
          <ChunkCard name={'gAMA'} color={COLORS.purple} width={230} height={116} />
        </Node>

        {[
          {text: 'author', x: -20, y: -165, color: COLORS.orange},
          {text: 'comment', x: 190, y: -110, color: COLORS.purple},
          {text: 'gamma', x: -10, y: 55, color: COLORS.orange},
          {text: 'palette', x: 215, y: 115, color: COLORS.purple},
        ].map((chip, index) => (
          <Node
            ref={metadataChipRefs[index]}
            key={`meta-${chip.text}`}
            x={chip.x}
            y={chip.y}
            opacity={0}
            scale={0.72}
          >
            <Rect
              width={190}
              height={76}
              radius={28}
              fill={COLORS.card}
              stroke={chip.color}
              lineWidth={4}
              shadowColor={COLORS.shadow}
              shadowBlur={18}
              shadowOffsetY={8}
            />
            <Circle width={18} height={18} x={-62} fill={chip.color} />
            <Txt
              text={chip.text}
              x={18}
              fill={COLORS.text}
              fontFamily={'Arial'}
              fontWeight={700}
              fontSize={26}
            />
          </Node>
        ))}

        <Node x={370} y={10}>
          <Rect
            width={420}
            height={340}
            radius={38}
            fill={COLORS.card}
            stroke={COLORS.border}
            lineWidth={5}
            shadowColor={COLORS.shadow}
            shadowBlur={26}
            shadowOffsetY={10}
          />
          <Node scale={1.7}>
            <PngPreview />
          </Node>
        </Node>
      </Node>
    </Node>,
  );

  // 0.00–0.80 — exact handoff from Scene 5.
  yield* waitFor(0.80);

  // The file visibly breaks apart into six matching, named chunks.
  yield* all(
    sequence(
      0.07,
      ...chunkRefs.map((ref, index) =>
        all(
          ref().opacity(1, 0.22, easeOutCubic),
          ref().scale(1, 0.54, easeOutCubic),
          ref().position([CHUNKS[index].x, CHUNKS[index].y], 0.72, easeInOutCubic),
        ),
      ),
    ),
    chunkStage().opacity(1, 0.18, easeOutCubic),
    chain(
      waitFor(0.20),
      startFile().opacity(0, 0.60, easeInCubic),
    ),
    startFile().scale(0.48, 0.82, easeInCubic),
  );
  yield* waitFor(1.20);

  // Choose the IDAT chunk and bring the same object to the centre.
  yield* all(
    ...chunkRefs.map((ref, index) =>
      index === 2
        ? all(
            ref().position([0, 0], 0.62, easeInOutCubic),
            ref().scale(1.02, 0.62, easeOutCubic),
          )
        : all(
            ref().opacity(0, 0.30, easeInCubic),
            ref().scale(0.70, 0.34, easeInCubic),
          ),
    ),
  );
  yield* waitFor(0.28);

  // Physically expand the selected chunk into type/data/check.
  yield* all(
    focusShell().width(1420, 0.74, easeInOutCubic),
    focusShell().height(470, 0.74, easeInOutCubic),
    focusShell().radius(56, 0.74, easeInOutCubic),

    // Hide the complete old chunk contents so no stray "IDAT" remains.
    focusHeader().opacity(0, 0.24, easeInCubic),
    focusNeutralBody().opacity(0, 0.24, easeInCubic),

    chain(
      waitFor(0.28),
      sequence(
        0.10,
        all(
          typePart().opacity(1, 0.22, easeOutCubic),
          typePart().scale(1, 0.34, easeOutCubic),
        ),
        all(
          dataPart().opacity(1, 0.22, easeOutCubic),
          dataPart().scale(1, 0.34, easeOutCubic),
        ),
        all(
          checkPart().opacity(1, 0.22, easeOutCubic),
          checkPart().scale(1, 0.34, easeOutCubic),
        ),
      ),
    ),
  );
  yield* waitFor(0.80);

  // Make the three ideas land with the exact same small expansion.
  yield* chain(
    typePart().scale(1.08, 0.28, easeOutCubic),
    typePart().scale(1, 0.20, easeInOutCubic),
  );
  yield* waitFor(0.46);

  yield* chain(
    dataPart().scale(1.08, 0.28, easeOutCubic),
    dataPart().scale(1, 0.20, easeInOutCubic),
  );
  yield* waitFor(0.54);

  yield* chain(
    checkPart().scale(1.08, 0.28, easeOutCubic),
    checkPart().scale(1, 0.20, easeInOutCubic),
  );

  // Extra hold preserves the scene's existing overall timing.
  yield* waitFor(1.48);

  // Switch to the image-data example.
  yield* all(
    focusChunk().opacity(0, 0.34, easeInCubic),
    focusChunk().scale(0.76, 0.42, easeInCubic),
    imageStage().opacity(1, 0.26, easeOutCubic),
    imageChunkA().opacity(1, 0.30, easeOutCubic),
    imageChunkA().scale(1, 0.44, easeOutCubic),
    imageChunkB().opacity(1, 0.30, easeOutCubic),
    imageChunkB().scale(1, 0.44, easeOutCubic),
    imageCard().opacity(1, 0.34, easeOutCubic),
    imageCard().scale(1, 0.52, easeOutCubic),
  );
  yield* waitFor(0.46);

  // Pixels stream from the IDAT chunks and fill a complete grid.
  yield* sequence(
    0.00894,
    ...pixelRefs.map((ref, index) => {
      const col = index % PIXEL_COLS;
      const row = Math.floor(index / PIXEL_COLS);

      // 14x10, 30px cells on a 34px pitch = ~472x336,
      // matching the displayed PngPreview's footprint.
      const targetX = 139 + col * 34;
      const targetY = -123 + row * 34;

      return chain(
        ref().opacity(1, 0.08, easeOutCubic),
        all(
          ref().position([targetX, targetY], 0.62, easeInOutCubic),
          ref().scale(1, 0.62, easeOutCubic),
        ),
      );
    }),
  );

  yield* waitFor(0.28);

  // The finished grid dissolves into the actual PngPreview used elsewhere.
  yield* all(
    ...pixelRefs.map(ref => ref().opacity(0, 0.48, easeInCubic)),
    pngPreview().opacity(1, 0.54, easeOutCubic),
  );
  yield* waitFor(0.68);

  // ---------------------------------------------------------------------------
  // Metadata placeholder restored at the same length/timing as the earlier
  // version. We'll redesign the visuals in the next pass.
  // ---------------------------------------------------------------------------

  yield* all(
    imageChunkA().opacity(0, 0.30, easeInCubic),
    imageChunkB().opacity(0, 0.30, easeInCubic),
    imageStage().opacity(0, 0.36, easeInCubic),
    metadataStage().opacity(1, 0.30, easeOutCubic),
    metaChunkA().opacity(1, 0.30, easeOutCubic),
    metaChunkA().scale(1, 0.42, easeOutCubic),
    metaChunkB().opacity(1, 0.30, easeOutCubic),
    metaChunkB().scale(1, 0.42, easeOutCubic),
  );
  yield* waitFor(0.52);

  yield* sequence(
    0.14,
    ...metadataChipRefs.map(ref =>
      all(
        ref().opacity(1, 0.24, easeOutCubic),
        ref().scale(1, 0.36, easeOutCubic),
      ),
    ),
  );
  yield* waitFor(2.22);

  yield* all(
    metaChunkA().opacity(0.20, 0.45, easeInCubic),
    metaChunkB().opacity(0.20, 0.45, easeInCubic),
    sequence(
      0.08,
      ...metadataChipRefs.map((ref, index) =>
        all(
          ref().position.y(
            ref().position.y() - 110 - index * 12,
            0.72,
            easeInCubic,
          ),
          ref().opacity(0, 0.56, easeInCubic),
          ref().scale(0.82, 0.56, easeInCubic),
        ),
      ),
    ),
  );
  yield* waitFor(1.55);

  yield* waitFor(1.80);
});
