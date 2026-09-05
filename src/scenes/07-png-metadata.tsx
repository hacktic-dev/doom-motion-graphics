// Scene 7 — metadata flip-photo v2

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
  createRef,
  easeInCubic,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';

const COLORS = {
  background: '#21232E',
  card: '#3A3E52',
  titlebar: '#1B1D26',
  borderStrong: '#646B82',
  titleText: '#C4CBDA',
  shadow: 'rgba(0,0,0,0.24)',

  paper: '#F4EEE4',
  paperDark: '#E8DCCB',
  paperSlip: '#FBF7F0',
  paperLine: '#D3C2AA',
  ink: '#5A4B3F',
  inkSoft: '#7B6B5D',
  tape: '#E6D4A6',

  accent: '#8C7CFF',
  purple: '#A996FF',
};

const IMAGE_VIEW_WIDTH = 720;
const IMAGE_VIEW_HEIGHT = 480;
const IMAGE_WINDOW_WIDTH = 800;
const IMAGE_WINDOW_HEIGHT = 620;
const TITLEBAR_HEIGHT = 58;
const TITLEBAR_Y =
  -IMAGE_WINDOW_HEIGHT / 2 + TITLEBAR_HEIGHT / 2;

const PHOTO_FINAL_SCALE = 1.04 * 1.2;

const LANDSCAPE_BASE_SIZE = 720;
const LANDSCAPE_UNIFORM_SCALE =
  IMAGE_VIEW_HEIGHT / LANDSCAPE_BASE_SIZE;
const LANDSCAPE_X_SCALE =
  IMAGE_VIEW_WIDTH / IMAGE_VIEW_HEIGHT;
const LANDSCAPE_X_INVERSE =
  1 / LANDSCAPE_X_SCALE;

const landscapeTreePositions = [
  [-304, 148],
  [-252, 128],
  [-195, 161],
  [-142, 145],
  [155, 148],
  [212, 124],
  [270, 156],
  [318, 132],
] as const;

function Scene4Landscape() {
  return (
    <Node scale={LANDSCAPE_UNIFORM_SCALE}>
      <Node scale={[LANDSCAPE_X_SCALE, 1]}>
        <Rect
          width={720}
          height={720}
          fill={'#dceefa'}
        />

        <Node
          x={238}
          y={-235}
          scale={[LANDSCAPE_X_INVERSE, 1]}
        >
          <Circle
            width={92}
            height={92}
            fill={'#f2ca59'}
          />
        </Node>

        <Node
          x={-205}
          y={-220}
          scale={[LANDSCAPE_X_INVERSE, 1]}
        >
          <Circle
            width={58}
            height={38}
            x={-30}
            fill={'#ffffff'}
          />
          <Circle
            width={72}
            height={54}
            x={5}
            y={-7}
            fill={'#ffffff'}
          />
          <Circle
            width={50}
            height={34}
            x={42}
            y={3}
            fill={'#ffffff'}
          />
          <Rect
            width={115}
            height={25}
            y={8}
            radius={13}
            fill={'#ffffff'}
          />
        </Node>

        <Node
          x={125}
          y={-175}
          scale={[LANDSCAPE_X_INVERSE, 1]}
        >
          <Circle
            width={44}
            height={30}
            x={-22}
            fill={'#ffffff'}
          />
          <Circle
            width={58}
            height={44}
            x={8}
            y={-6}
            fill={'#ffffff'}
          />
          <Circle
            width={40}
            height={28}
            x={37}
            y={3}
            fill={'#ffffff'}
          />
          <Rect
            width={92}
            height={21}
            y={7}
            radius={11}
            fill={'#ffffff'}
          />
        </Node>

        <Line
          points={[
            [-360, 108],
            [-310, 58],
            [-266, 88],
            [-205, 14],
            [-145, 83],
            [-90, 38],
            [-30, 102],
            [35, 51],
            [96, 100],
            [161, 18],
            [224, 91],
            [280, 48],
            [330, 95],
            [360, 70],
            [360, 144],
            [-360, 144],
          ]}
          closed
          fill={'#7f9fc2'}
        />

        <Line
          points={[
            [-360, 150],
            [-300, 91],
            [-250, 132],
            [-185, 54],
            [-118, 137],
            [-48, 74],
            [16, 145],
            [87, 79],
            [148, 136],
            [218, 65],
            [282, 140],
            [330, 105],
            [360, 127],
            [360, 179],
            [-360, 179],
          ]}
          closed
          fill={'#456f98'}
        />

        <Rect
          width={720}
          height={250}
          y={235}
          fill={'#72b7da'}
        />

        <Line
          points={[
            [-360, 131],
            [-292, 117],
            [-225, 126],
            [-162, 149],
            [-100, 182],
            [-42, 226],
            [-92, 360],
            [-360, 360],
          ]}
          closed
          fill={'#5d8d5a'}
        />

        <Line
          points={[
            [360, 127],
            [296, 113],
            [231, 125],
            [174, 151],
            [111, 185],
            [44, 225],
            [95, 360],
            [360, 360],
          ]}
          closed
          fill={'#608f5c'}
        />

        {landscapeTreePositions.map(([x, y], index) => (
          <Node
            key={`viewer-tree-${index}`}
            x={x}
            y={y}
            scale={[LANDSCAPE_X_INVERSE, 1]}
          >
            <Rect
              width={9}
              height={34}
              y={19}
              fill={'#65503e'}
            />

            <Line
              points={[
                [0, -52],
                [29, 12],
                [-29, 12],
              ]}
              closed
              fill={
                index % 2 === 0
                  ? '#2d6857'
                  : '#34735e'
              }
            />

            <Line
              points={[
                [0, -23],
                [35, 36],
                [-35, 36],
              ]}
              closed
              fill={
                index % 2 === 0
                  ? '#285f50'
                  : '#306a58'
              }
            />
          </Node>
        ))}
      </Node>
    </Node>
  );
}

function HtmlStrip({
  width,
  color,
}: {
  width: number;
  color: string;
}) {
  return (
    <Rect
      width={width}
      height={28}
      radius={14}
      fill={color}
      shadowColor={'rgba(0,0,0,0.18)'}
      shadowBlur={10}
      shadowOffsetY={4}
      opacity={0.92}
    >
      <Rect
        x={-width / 2 + 24}
        width={20}
        height={9}
        radius={4.5}
        fill={'rgba(255,255,255,0.18)'}
      />
      <Rect
        x={-width / 2 + 52}
        width={50}
        height={9}
        radius={4.5}
        fill={'rgba(255,255,255,0.12)'}
      />
      <Rect
        x={-width / 2 + 112}
        width={38}
        height={9}
        radius={4.5}
        fill={'rgba(255,255,255,0.12)'}
      />
    </Rect>
  );
}

function MetadataSlip({
  width,
  text,
  x = 0,
  y = 0,
  rotation = 0,
}: {
  width: number;
  text: string;
  x?: number;
  y?: number;
  rotation?: number;
}) {
  return (
    <Node x={x} y={y} rotation={rotation}>
      <Rect
        width={width}
        height={72}
        radius={16}
        fill={COLORS.paperSlip}
        stroke={COLORS.paperLine}
        lineWidth={2}
      />

      <Txt
        text={text}
        fill={COLORS.ink}
        fontFamily={'Segoe Print'}
        fontSize={24}
        fontWeight={400}
      />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const viewer = createRef<Node>();

  const photo = createRef<Node>();
  const photoFront = createRef<Node>();
  const photoBack = createRef<Node>();

  const photoImage = createRef<Rect>();
  const photoFrame = createRef<Rect>();

  const noteTag = createRef<Node>();
  const noteAuthor = createRef<Node>();
  const noteComment = createRef<Node>();
  const noteSoftware = createRef<Node>();

  const hiddenArea = createRef<Rect>();
  const tapeLeft = createRef<Rect>();
  const tapeRight = createRef<Rect>();

  const stripA = createRef<Node>();
  const stripB = createRef<Node>();
  const stripC = createRef<Node>();
  const stripD = createRef<Node>();

  view.add(
    <Rect
      width={'100%'}
      height={'100%'}
      fill={COLORS.background}
      zIndex={-100}
    />,
  );

  view.add(
    <Node>
      {/* Exact final frame of Scene 6. */}
      <Node
        ref={viewer}
        x={360}
        y={0}
        scale={1}
        zIndex={10}
      >
        <Rect
          width={IMAGE_WINDOW_WIDTH}
          height={IMAGE_WINDOW_HEIGHT}
          radius={34}
          fill={COLORS.card}
          shadowColor={COLORS.shadow}
          shadowBlur={28}
          shadowOffsetY={12}
          clip
        >
          <Rect
            width={IMAGE_WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={TITLEBAR_Y}
            fill={COLORS.titlebar}
          />

          <Circle
            width={15}
            height={15}
            x={-IMAGE_WINDOW_WIDTH / 2 + 32}
            y={TITLEBAR_Y}
            fill={'#ff5f57'}
          />

          <Circle
            width={15}
            height={15}
            x={-IMAGE_WINDOW_WIDTH / 2 + 58}
            y={TITLEBAR_Y}
            fill={'#febc2e'}
          />

          <Circle
            width={15}
            height={15}
            x={-IMAGE_WINDOW_WIDTH / 2 + 84}
            y={TITLEBAR_Y}
            fill={'#28c840'}
          />

          <Txt
            text={'image.png'}
            x={0}
            y={TITLEBAR_Y}
            fill={COLORS.titleText}
            fontFamily={'monospace'}
            fontSize={24}
            textAlign={'center'}
          />

          <Rect
            width={IMAGE_VIEW_WIDTH}
            height={IMAGE_VIEW_HEIGHT}
            y={36}
            radius={24}
            fill={'rgba(0,0,0,0)'}
            clip
          >
            <Scene4Landscape />
          </Rect>
        </Rect>

        <Rect
          width={IMAGE_WINDOW_WIDTH}
          height={IMAGE_WINDOW_HEIGHT}
          radius={34}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.borderStrong}
          lineWidth={3}
        />
      </Node>

      {/* Physical photo. */}
      <Node
        ref={photo}
        x={360}
        y={36}
        opacity={0}
        scale={1}
        zIndex={14}
      >
        <Node
          ref={photoFront}
          opacity={1}
        >
          {/*
            Polaroid frame.

            Invisible at the beginning, then fades in
            WHILE the image is moving toward the centre.
          */}
          <Rect
            ref={photoFrame}
            width={770}
            height={610}
            y={30}
            radius={22}
            fill={COLORS.paper}
            shadowColor={'rgba(0,0,0,0.30)'}
            shadowBlur={26}
            shadowOffsetY={14}
            opacity={0}
          />

          {/* Bare moving image. */}
          <Rect
            ref={photoImage}
            width={720}
            height={480}
            y={0}
            radius={12}
            fill={'rgba(0,0,0,0)'}
            clip
          >
            <Scene4Landscape />
          </Rect>
        </Node>

        {/* Back of Polaroid. */}
        <Node
          ref={photoBack}
          opacity={0}
        >
          <Rect
            width={770}
            height={610}
            y={30}
            radius={22}
            fill={COLORS.paper}
            shadowColor={'rgba(0,0,0,0.30)'}
            shadowBlur={26}
            shadowOffsetY={14}
          />

          <Rect
            width={690}
            height={500}
            y={10}
            radius={18}
            fill={COLORS.paperDark}
            stroke={COLORS.paperLine}
            lineWidth={2}
          />

          <Node
            ref={noteTag}
            x={-250}
            y={-205}
          >
            <Txt
              text={'tEXt'}
              fill={COLORS.ink}
              fontFamily={'Segoe Print'}
              fontSize={30}
            />

            <Line
              points={[
                [-34, 16],
                [34, 16],
              ]}
              stroke={COLORS.inkSoft}
              lineWidth={2}
              lineCap={'round'}
            />
          </Node>

          <Node
            ref={noteAuthor}
            x={-176}
            y={-105}
            rotation={-2}
          >
            <MetadataSlip
              width={240}
              text={'Author: hacktic'}
            />
          </Node>

          <Node
            ref={noteComment}
            x={140}
            y={-2}
            rotation={1.4}
          >
            <MetadataSlip
              width={350}
              text={'Comment: Mountain Image'}
            />
          </Node>

          <Node
            ref={noteSoftware}
            x={-150}
            y={104}
            rotation={-1}
          >
            <MetadataSlip
              width={300}
              text={'Software: PNG Viewer'}
            />
          </Node>

          <Rect
            ref={hiddenArea}
            width={398}
            height={172}
            y={38}
            radius={22}
            fill={'#EFE4D6'}
            stroke={'#D2C0A7'}
            lineWidth={2}
            opacity={0}
          />

          <Rect
            ref={tapeLeft}
            width={86}
            height={20}
            x={-126}
            y={-56}
            rotation={-14}
            radius={6}
            fill={COLORS.tape}
            opacity={0}
          />

          <Rect
            ref={tapeRight}
            width={86}
            height={20}
            x={124}
            y={-56}
            rotation={14}
            radius={6}
            fill={COLORS.tape}
            opacity={0}
          />

          <Node
            ref={stripA}
            x={-930}
            y={-30}
            opacity={0}
            zIndex={20}
          >
            <HtmlStrip
              width={208}
              color={COLORS.accent}
            />
          </Node>

          <Node
            ref={stripB}
            x={-980}
            y={12}
            opacity={0}
            zIndex={20}
          >
            <HtmlStrip
              width={268}
              color={COLORS.purple}
            />
          </Node>

          <Node
            ref={stripC}
            x={-948}
            y={56}
            opacity={0}
            zIndex={20}
          >
            <HtmlStrip
              width={190}
              color={'#735EE7'}
            />
          </Node>

          <Node
            ref={stripD}
            x={-1005}
            y={100}
            opacity={0}
            zIndex={20}
          >
            <HtmlStrip
              width={232}
              color={COLORS.accent}
            />
          </Node>
        </Node>
      </Node>
    </Node>,
  );

  // Exact final frame from Scene 6.
  yield* waitFor(0.40);

  /*
    The image moves and scales toward the centre.

    0.10 seconds after the movement begins,
    the Polaroid frame starts fading in.

    The fade lasts 0.50 seconds, so the border
    gradually materialises during most of the move.
  */
  yield* all(
    viewer().opacity(
      0,
      0.62,
      easeInCubic,
    ),

    photo().opacity(
      1,
      0.24,
      easeOutCubic,
    ),

    photo().position(
      [0, 18],
      0.72,
      easeInOutCubic,
    ),

    photo().scale(
      PHOTO_FINAL_SCALE,
      0.72,
      easeOutCubic,
    ),

    photoImage().y(
      -18,
      0.72,
      easeInOutCubic,
    ),

    // Border fades in while everything is moving.
    sequence(
      0.10,
      photoFrame().opacity(
        1,
        0.50,
        easeOutCubic,
      ),
    ),
  );

  // Small breathing beat before the flip.
  yield* waitFor(0.18);

  // Flip to metadata.
  yield* photo().scale(
    [0.03, PHOTO_FINAL_SCALE],
    0.28,
    easeInCubic,
  );

  photoFront().opacity(0);
  photoBack().opacity(1);

  yield* photo().scale(
    [
      PHOTO_FINAL_SCALE,
      PHOTO_FINAL_SCALE,
    ],
    0.34,
    easeOutCubic,
  );

  // First metadata hold.
  yield* waitFor(3.10);

  // Flip back to image.
  yield* photo().scale(
    [0.03, PHOTO_FINAL_SCALE],
    0.28,
    easeInCubic,
  );

  photoBack().opacity(0);
  photoFront().opacity(1);

  yield* photo().scale(
    [
      PHOTO_FINAL_SCALE,
      PHOTO_FINAL_SCALE,
    ],
    0.34,
    easeOutCubic,
  );

  // Hold on unchanged image.
  yield* waitFor(3.00);

  // Flip back to metadata.
  yield* photo().scale(
    [0.03, PHOTO_FINAL_SCALE],
    0.28,
    easeInCubic,
  );

  photoFront().opacity(0);
  photoBack().opacity(1);

  yield* photo().scale(
    [
      PHOTO_FINAL_SCALE,
      PHOTO_FINAL_SCALE,
    ],
    0.34,
    easeOutCubic,
  );

  yield* waitFor(0.18);

  // Clear space for hidden HTML.
  yield* all(
    noteAuthor().position(
      [-220, -126],
      0.54,
      easeInOutCubic,
    ),

    noteComment().position(
      [156, -145],
      0.54,
      easeInOutCubic,
    ),

    noteSoftware().position(
      [-162, 182],
      0.54,
      easeInOutCubic,
    ),

    noteTag().position(
      [-256, -212],
      0.54,
      easeInOutCubic,
    ),

    hiddenArea().opacity(
      1,
      0.34,
      easeOutCubic,
    ),

    tapeLeft().opacity(
      0.82,
      0.30,
      easeOutCubic,
    ),

    tapeRight().opacity(
      0.82,
      0.30,
      easeOutCubic,
    ),
  );

  // HTML strips fly in.
  yield* sequence(
    0.12,

    all(
      stripA().opacity(
        1,
        0.10,
        easeOutCubic,
      ),
      stripA().position(
        [-58, -5],
        0.58,
        easeInOutCubic,
      ),
      stripA().scale(
        0.82,
        0.58,
        easeInOutCubic,
      ),
    ),

    all(
      stripB().opacity(
        1,
        0.10,
        easeOutCubic,
      ),
      stripB().position(
        [10, 25],
        0.58,
        easeInOutCubic,
      ),
      stripB().scale(
        0.82,
        0.58,
        easeInOutCubic,
      ),
    ),

    all(
      stripC().opacity(
        1,
        0.10,
        easeOutCubic,
      ),
      stripC().position(
        [-26, 55],
        0.58,
        easeInOutCubic,
      ),
      stripC().scale(
        0.82,
        0.58,
        easeInOutCubic,
      ),
    ),

    all(
      stripD().opacity(
        1,
        0.10,
        easeOutCubic,
      ),
      stripD().position(
        [26, 85],
        0.58,
        easeInOutCubic,
      ),
      stripD().scale(
        0.82,
        0.58,
        easeInOutCubic,
      ),
    ),
  );

  yield* waitFor(0.20);

  yield* all(
    hiddenArea().opacity(
      0.88,
      0.12,
      easeOutCubic,
    ),

    tapeLeft().opacity(
      0.94,
      0.12,
      easeOutCubic,
    ),

    tapeRight().opacity(
      0.94,
      0.12,
      easeOutCubic,
    ),
  );

  // Final flip back to unchanged image.
  yield* photo().scale(
    [0.03, PHOTO_FINAL_SCALE],
    0.28,
    easeInCubic,
  );

  photoBack().opacity(0);
  photoFront().opacity(1);

  yield* photo().scale(
    [
      PHOTO_FINAL_SCALE,
      PHOTO_FINAL_SCALE,
    ],
    0.34,
    easeOutCubic,
  );

  yield* waitFor(0.42);
});