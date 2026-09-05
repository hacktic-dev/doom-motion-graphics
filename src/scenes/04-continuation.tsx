import {
  Circle,
  Img,
  Line,
  Node,
  Path,
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
  linear,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';
import doomImage from '../img/Doom.png';

const openingBytes = ['89', '50', '4E', '47'];
const openingGlyphs = ['‰', 'P', 'N', 'G'];

const DATA_LEFT = -355;
const LINE_SPACING = 42;

const dataLineWidths = [
  690,
  535,
  635,
  430,
  725,
  570,
  655,
  485,
  675,
  515,
];

const dataLineInitialY = dataLineWidths.map(
  (_, index) =>
    (index - (dataLineWidths.length - 1) / 2) *
    LINE_SPACING,
);

const dataLineSplitY = [
  -252,
  -210,
  -168,
  -126,
  -84,

  84,
  126,
  168,
  210,
  252,
];

const insertedLineWidths = [
  590,
  445,
  660,
];

const insertedLineY = [
  -42,
  0,
  42,
];

/*
 * Window.
 */
const WINDOW_WIDTH = 1160;

/*
 * 720 image height
 * + 58 title bar
 * + 32px above image
 * + 32px below image
 */
const WINDOW_HEIGHT = 842;
const TITLEBAR_HEIGHT = 58;
const CONTENT_MARGIN = 32;

/*
 * Preserve the exact old landscape height.
 */
const LANDSCAPE_BASE_SIZE = 720;

const CONTENT_WIDTH =
  WINDOW_WIDTH -
  CONTENT_MARGIN * 2;

const CONTENT_HEIGHT =
  LANDSCAPE_BASE_SIZE;

const CONTENT_Y =
  -WINDOW_HEIGHT / 2 +
  TITLEBAR_HEIGHT +
  CONTENT_MARGIN +
  CONTENT_HEIGHT / 2;

/*
 * THIS is the important part.
 *
 * Old landscape:
 * 720 × 720
 *
 * New viewport:
 * 1096 × 720
 *
 * We retain all the old coordinates and simply
 * expand them horizontally.
 */
const LANDSCAPE_X_SCALE =
  CONTENT_WIDTH /
  LANDSCAPE_BASE_SIZE;

const LANDSCAPE_X_INVERSE =
  1 / LANDSCAPE_X_SCALE;

/*
 * These are the SAME tree positions from the
 * landscape version you liked.
 */
const treePositions = [
  [-304, 148],
  [-252, 128],
  [-195, 161],
  [-142, 145],

  [155, 148],
  [212, 124],
  [270, 156],
  [318, 132],
];

const DOOM_ZOOM_START = 1.004;
const DOOM_ZOOM_END = 1.045;
const DOOM_ZOOM_DURATION = 2.10;
const DOOM_HOLD_BEFORE_FADE = 0.90;
const EMPTY_GAP_BEFORE_SUMMARY = 3.01;

export default makeScene2D(function* (view) {
  /*
   * =========================================================
   * REFERENCES
   * =========================================================
   */

  const openingNodeRefs = openingBytes.map(
    () => createRef<Node>(),
  );

  const openingByteRefs = openingBytes.map(
    () => createRef<Txt>(),
  );

  const openingGlyphRefs = openingGlyphs.map(
    () => createRef<Txt>(),
  );

  const dataSheet = createRef<Node>();

  const dataLineRefs = dataLineWidths.map(
    () => createRef<Rect>(),
  );

  const insertedLineRefs = insertedLineWidths.map(
    () => createRef<Rect>(),
  );

  const fileIcon = createRef<Node>();

  const cursor = createRef<Node>();

  const clickRingA = createRef<Circle>();
  const clickRingB = createRef<Circle>();

  const programWindow = createRef<Node>();
  const programTitle = createRef<Txt>();

  /*
   * Landscape.
   */

  const landscape = createRef<Node>();

  const sky = createRef<Rect>();

  const sun = createRef<Circle>();

  const cloudA = createRef<Node>();
  const cloudB = createRef<Node>();

  const farMountains = createRef<Line>();
  const nearMountains = createRef<Line>();

  const lake = createRef<Rect>();

  const leftShore = createRef<Line>();
  const rightShore = createRef<Line>();

  const treeRefs = treePositions.map(
    () => createRef<Node>(),
  );

  /*
   * Doom artwork.
   */

  const doomFrame = createRef<Rect>();
  const doomArtwork = createRef<Img>();


  const summary = createRef<Node>();

  /*
   * =========================================================
   * SCENE GRAPH
   * =========================================================
   */

  view.add(
    <Node scale={1.25}>
      {/*
       * -------------------------------------------------------
       * SCENE 3 ENDING
       * -------------------------------------------------------
       */}

      {openingBytes.map(
        (byte, index) => (
          <Node
            ref={openingNodeRefs[index]}
            key={`opening-${index}`}
            x={(index - 1.5) * 270}
            scale={1}
            zIndex={6}
          >
            <Rect
              width={205}
              height={170}
              radius={24}
              fill={'#f0f0f0'}
              stroke={'#aaaaaa'}
              lineWidth={5}
              shadowColor={'rgba(0,0,0,0.18)'}
              shadowBlur={18}
              shadowOffsetY={8}
            >
              <Txt
                ref={openingByteRefs[index]}
                text={byte}
                fill={'#2b2b2b'}
                fontSize={66}
                fontFamily={'monospace'}
                fontWeight={700}
                opacity={0}
              />

              <Txt
                ref={openingGlyphRefs[index]}
                text={openingGlyphs[index]}
                fill={'#2b2b2b'}
                fontSize={72}
                fontFamily={'monospace'}
                fontWeight={700}
                opacity={1}
              />
            </Rect>
          </Node>
        ),
      )}

      {/*
       * -------------------------------------------------------
       * ABSTRACT FILE CONTENTS
       * -------------------------------------------------------
       */}

      <Node
        ref={dataSheet}
        opacity={0}
        scale={0.82}
        y={5}
        zIndex={5}
      >
        <Rect
          width={870}
          height={620}
          radius={22}
          fill={'#f7f7f7'}
          stroke={'#b8b8b8'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.16)'}
          shadowBlur={22}
          shadowOffsetY={9}
        />

        {dataLineWidths.map(
          (width, index) => (
            <Rect
              ref={dataLineRefs[index]}
              key={`data-line-${index}`}
              width={width}
              height={17}
              radius={8.5}
              x={
                DATA_LEFT +
                width / 2
              }
              y={
                dataLineInitialY[index]
              }
              fill={'#b7b7b7'}
            />
          ),
        )}

        {insertedLineWidths.map(
          (width, index) => (
            <Rect
              ref={
                insertedLineRefs[index]
              }
              key={`inserted-line-${index}`}
              width={width}
              height={17}
              radius={8.5}
              x={
                DATA_LEFT +
                width / 2 -
                180
              }
              y={
                insertedLineY[index]
              }
              fill={'#8874bd'}
              opacity={0}
              scale={[0.65, 1]}
              shadowColor={
                'rgba(95,72,150,0.16)'
              }
              shadowBlur={7}
            />
          ),
        )}
      </Node>

      {/*
       * -------------------------------------------------------
       * IMAGE.PNG
       * -------------------------------------------------------
       */}

      <Node
        ref={fileIcon}
        opacity={0}
        scale={0.72}
        y={0}
        zIndex={6}
      >
        <Node y={-35}>
          <Line
            points={[
              [-75, -90],
              [35, -90],
              [75, -50],
              [75, 90],
              [-75, 90],
            ]}
            closed
            fill={'#ffffff'}
            stroke={'#c8c8c8'}
            lineWidth={4}
            radius={12}
            shadowColor={
              'rgba(0,0,0,0.18)'
            }
            shadowBlur={18}
            shadowOffsetY={8}
          />

          <Line
            points={[
              [35, -90],
              [35, -50],
              [75, -50],
            ]}
            stroke={'#c8c8c8'}
            lineWidth={4}
          />

          <Line
            points={[
              [35, -90],
              [75, -50],
            ]}
            stroke={'#c8c8c8'}
            lineWidth={4}
          />

          <Node y={20}>
            <PngPreview />
          </Node>
        </Node>

        <Txt
          text={'image.png'}
          fill={'#2b2b2b'}
          fontSize={34}
          fontFamily={'Arial'}
          fontWeight={500}
          y={85}
        />
      </Node>

      {/*
       * -------------------------------------------------------
       * CLICK RIPPLE
       * -------------------------------------------------------
       */}

      <Circle
        ref={clickRingA}
        x={50}
        y={-10}
        width={18}
        height={18}
        stroke={
          'rgba(70,70,70,0.55)'
        }
        lineWidth={3}
        fill={'rgba(0,0,0,0)'}
        opacity={0}
        scale={0.2}
        zIndex={10}
      />

      <Circle
        ref={clickRingB}
        x={50}
        y={-10}
        width={18}
        height={18}
        stroke={
          'rgba(70,70,70,0.32)'
        }
        lineWidth={3}
        fill={'rgba(0,0,0,0)'}
        opacity={0}
        scale={0.2}
        zIndex={10}
      />

      {/*
       * -------------------------------------------------------
       * CURSOR
       * -------------------------------------------------------
       */}

      <Node
        ref={cursor}
        x={260}
        y={175}
        opacity={0}
        scale={0.78}
        zIndex={12}
      >
        <Path
          data={`
            M 2 2
            L 2 48
            L 13 37
            L 22 59
            L 33 54
            L 24 34
            L 42 34
            Z
          `}
          fill={'#ffffff'}
          stroke={'#202020'}
          lineWidth={2.8}
          lineJoin={'round'}
          shadowColor={
            'rgba(0,0,0,0.20)'
          }
          shadowBlur={7}
          shadowOffsetX={2}
          shadowOffsetY={3}
        />
      </Node>

      {/*
       * -------------------------------------------------------
       * LARGE PROGRAM WINDOW
       * -------------------------------------------------------
       */}

      <Node
        ref={programWindow}
        x={0}
        y={0}
        opacity={0}
        scale={0.82}
        zIndex={4}
      >
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={18}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={
            'rgba(0,0,0,0.22)'
          }
          shadowBlur={24}
          shadowOffsetY={11}
          clip
        >
          {/*
           * TITLE BAR
           */}

          <Rect
            width={WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={
              -WINDOW_HEIGHT / 2 +
              TITLEBAR_HEIGHT / 2
            }
            fill={'#2f3238'}
          />

          <Circle
            width={15}
            height={15}
            x={
              -WINDOW_WIDTH / 2 +
              32
            }
            y={
              -WINDOW_HEIGHT / 2 +
              TITLEBAR_HEIGHT / 2
            }
            fill={'#ff5f57'}
          />

          <Circle
            width={15}
            height={15}
            x={
              -WINDOW_WIDTH / 2 +
              58
            }
            y={
              -WINDOW_HEIGHT / 2 +
              TITLEBAR_HEIGHT / 2
            }
            fill={'#febc2e'}
          />

          <Circle
            width={15}
            height={15}
            x={
              -WINDOW_WIDTH / 2 +
              84
            }
            y={
              -WINDOW_HEIGHT / 2 +
              TITLEBAR_HEIGHT / 2
            }
            fill={'#28c840'}
          />

          <Txt
  ref={programTitle}
  text={'Image Viewer'}
  x={-289}
  y={
    -WINDOW_HEIGHT / 2 +
    TITLEBAR_HEIGHT / 2
  }
  width={350}
  fontSize={28}
  fontFamily={'Arial'}
  fontWeight={600}
  fill={'#ffffff'}
  textAlign={'left'}
/>

          {/*
           * ---------------------------------------------------
           * WIDE IMAGE VIEWPORT
           *
           * 32px from left.
           * 32px from right.
           * 32px below title bar.
           * 32px above bottom.
           * ---------------------------------------------------
           */}

          <Rect
            width={CONTENT_WIDTH}
            height={CONTENT_HEIGHT}
            radius={14}
            y={CONTENT_Y}
            fill={'#dceefa'}
            stroke={'#d1d1d1'}
            lineWidth={3}
            shadowColor={
              'rgba(0,0,0,0.08)'
            }
            shadowBlur={10}
            shadowOffsetY={4}
            clip
          >
            {/*
             * ================================================
             * LANDSCAPE
             *
             * ALL THE MAIN GEOMETRY BELOW IS THE OLD 720x720
             * VERSION.
             *
             * We expand the parent horizontally.
             * ================================================
             */}

            <Node
              ref={landscape}
              scale={[
                LANDSCAPE_X_SCALE,
                1,
              ]}
            >
              <Rect
                ref={sky}
                width={720}
                height={720}
                fill={'#dceefa'}
                opacity={0}
              />

              {/*
               * SUN
               *
               * Counter-scale X so the circle stays circular.
               * Its POSITION still gets spread horizontally
               * by the landscape parent.
               */}

              <Node
                x={238}
                y={-235}
                scale={[
                  LANDSCAPE_X_INVERSE,
                  1,
                ]}
              >
                <Circle
                  ref={sun}
                  width={92}
                  height={92}
                  fill={'#f2ca59'}
                  opacity={0}
                  scale={0.2}
                />
              </Node>

              {/*
               * CLOUD LEFT
               */}

              <Node
                ref={cloudA}
                x={-220}
                y={-220}
                opacity={0}
                scale={[
                  LANDSCAPE_X_INVERSE,
                  1,
                ]}
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

              {/*
               * CLOUD RIGHT
               */}

              <Node
                ref={cloudB}
                x={110}
                y={-175}
                opacity={0}
                scale={[
                  LANDSCAPE_X_INVERSE,
                  1,
                ]}
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

              {/*
               * EXACT OLD FAR MOUNTAINS
               */}

              <Line
                ref={farMountains}
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
                opacity={0}
                y={35}
              />

              {/*
               * EXACT OLD NEAR MOUNTAINS
               */}

              <Line
                ref={nearMountains}
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
                opacity={0}
                y={40}
              />

              {/*
               * EXACT OLD LAKE
               */}

              <Rect
                ref={lake}
                width={720}
                height={250}
                y={235}
                fill={'#72b7da'}
                opacity={0}
              />

              {/*
               * EXACT OLD LEFT SHORE
               */}

              <Line
                ref={leftShore}
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
                opacity={0}
                y={24}
              />

              {/*
               * EXACT OLD RIGHT SHORE
               */}

              <Line
                ref={rightShore}
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
                opacity={0}
                y={24}
              />

              {/*
               * SAME TREES.
               *
               * Their positions spread horizontally,
               * while the inverse X scale keeps each
               * individual tree looking normal.
               */}

              {treePositions.map(
                ([x, y], index) => (
                  <Node
                    ref={treeRefs[index]}
                    key={`tree-${index}`}
                    x={x}
                    y={y + 38}
                    opacity={0}
                    scale={[
                      0.25 *
                        LANDSCAPE_X_INVERSE,
                      0.25,
                    ]}
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
                ),
              )}
            </Node>

            {/*
             * ================================================
             * DOOM
             *
             * The complicated hand-built vector Doom scene is
             * gone. This uses the finished artwork directly.
             * The surrounding content Rect already clips to the
             * exact same 14px radius as the mountain scene.
             * ================================================
             */}

            <Rect
              ref={doomFrame}
              width={CONTENT_WIDTH}
              height={CONTENT_HEIGHT}
              radius={14}
              clip
              opacity={0}
            >
              <Img
                ref={doomArtwork}
                src={doomImage}
                width={CONTENT_WIDTH + 8}
                height={CONTENT_HEIGHT + 8}
                opacity={1}
                scale={DOOM_ZOOM_START}
              />

              <Rect
                width={CONTENT_WIDTH}
                height={CONTENT_HEIGHT}
                radius={14}
                fill={'rgba(0,0,0,0)'}
                stroke={'#d1d1d1'}
                lineWidth={3}
              />
            </Rect>
          </Rect>
        </Rect>
      </Node>

      {/*
       * -------------------------------------------------------
       * FINAL SUMMARY
       * -------------------------------------------------------
       */}

      <Node
        ref={summary}
        opacity={0}
        scale={0.82}
        y={10}
        zIndex={9}
      >
        <Node y={-10}>
          <Line
            points={[
              [-90, -125],
              [38, -125],
              [90, -73],
              [90, 125],
              [-90, 125],
            ]}
            closed
            fill={'#ffffff'}
            stroke={'#aaaaaa'}
            lineWidth={4}
            radius={14}
            shadowColor={'rgba(0,0,0,0.17)'}
            shadowBlur={20}
            shadowOffsetY={9}
          />

          <Line
            points={[
              [38, -125],
              [38, -73],
              [90, -73],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          <Line
            points={[
              [38, -125],
              [90, -73],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          {[-54, -26, 2, 30].map((y, index) => (
            <Rect
              key={`summary-line-${index}`}
              width={index % 2 === 0 ? 104 : 82}
              height={14}
              radius={7}
              x={-8}
              y={y}
              fill={index < 2 ? '#b7b7b7' : '#8874bd'}
              opacity={index < 2 ? 1 : 0.92}
            />
          ))}
        </Node>

        <Line
          points={[
            [-92, -10],
            [-250, -10],
          ]}
          stroke={'#777777'}
          lineWidth={4}
          lineCap={'round'}
        />

        <Line
          points={[
            [92, -10],
            [250, -10],
          ]}
          stroke={'#777777'}
          lineWidth={4}
          lineCap={'round'}
        />

        <Node x={-345} y={-10} scale={1.05}>
          <Line
            points={[
              [-76, -92],
              [30, -92],
              [76, -46],
              [76, 92],
              [-76, 92],
            ]}
            closed
            fill={'#ffffff'}
            stroke={'#aaaaaa'}
            lineWidth={4}
            radius={12}
            shadowColor={'rgba(0,0,0,0.14)'}
            shadowBlur={14}
            shadowOffsetY={6}
          />

          <Line
            points={[
              [30, -92],
              [30, -46],
              [76, -46],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          <Line
            points={[
              [30, -92],
              [76, -46],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          <Node y={12} scale={0.9}>
            <PngPreview />
          </Node>
        </Node>

        <Node x={345} y={-10} scale={1.05}>
          <Line
            points={[
              [-76, -92],
              [30, -92],
              [76, -46],
              [76, 92],
              [-76, 92],
            ]}
            closed
            fill={'#ffffff'}
            stroke={'#aaaaaa'}
            lineWidth={4}
            radius={12}
            shadowColor={'rgba(0,0,0,0.14)'}
            shadowBlur={14}
            shadowOffsetY={6}
          />

          <Line
            points={[
              [30, -92],
              [30, -46],
              [76, -46],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          <Line
            points={[
              [30, -92],
              [76, -46],
            ]}
            stroke={'#aaaaaa'}
            lineWidth={4}
          />

          <Node y={2}>
            <Line
              points={[
                [-28, -8],
                [-48, 11],
                [-28, 30],
              ]}
              stroke={'#565656'}
              lineWidth={9}
              lineCap={'round'}
              lineJoin={'round'}
            />

            <Line
              points={[
                [8, -8],
                [-8, 30],
              ]}
              stroke={'#565656'}
              lineWidth={9}
              lineCap={'round'}
            />

            <Line
              points={[
                [28, -8],
                [48, 11],
                [28, 30],
              ]}
              stroke={'#565656'}
              lineWidth={9}
              lineCap={'round'}
              lineJoin={'round'}
            />
          </Node>
        </Node>
      </Node>
    </Node>,
  );

  /*
   * =========================================================
   * TIMELINE
   * =========================================================
   */

  // Hold the PNG signature briefly, then move straight into the
  // document view. No intermediate glyph-to-hex flip.
  yield* waitFor(0.20);

  /*
   * PNG SIGNATURE → FAKE FILE
   */

  yield* all(
    sequence(
      0.04,

      ...openingNodeRefs.map(
        ref =>
          all(
            ref().x(
              0,
              0.48,
              easeInOutCubic,
            ),

            ref().y(
              0,
              0.48,
              easeInOutCubic,
            ),

            ref().scale(
              0.12,
              0.48,
              easeInCubic,
            ),

            ref().opacity(
              0,
              0.40,
              easeInCubic,
            ),
          ),
      ),
    ),

    chain(
      waitFor(0.16),

      all(
        dataSheet().opacity(
          1,
          0.38,
          easeOutCubic,
        ),

        dataSheet().scale(
          1,
          0.42,
          easeOutCubic,
        ),
      ),
    ),
  );

  yield* waitFor(0.25);

  /*
   * SPLIT LINES
   */

  yield* all(
    ...dataLineRefs.map(
      (ref, index) =>
        ref().y(
          dataLineSplitY[index],
          0.48,
          easeInOutCubic,
        ),
    ),
  );

  /*
   * INSERT PURPLE DATA
   */

  yield* sequence(
    0.09,

    ...insertedLineRefs.map(
      (ref, index) =>
        all(
          ref().opacity(
            1,
            0.26,
            easeOutCubic,
          ),

          ref().x(
            DATA_LEFT +
              insertedLineWidths[
                index
              ] /
                2,
            0.44,
            easeInOutCubic,
          ),

          ref().scale(
            [1, 1],
            0.44,
            easeOutCubic,
          ),
        ),
    ),
  );

  yield* waitFor(0.30);

  /*
   * FAKE DATA → IMAGE.PNG
   */

  yield* all(
    dataSheet().scale(
      0.22,
      0.45,
      easeInCubic,
    ),

    dataSheet().opacity(
      0,
      0.50,
      easeInCubic,
    ),

    dataSheet().y(
      -15,
      0.52,
      easeInOutCubic,
    ),

    chain(
      waitFor(0.15),

      all(
        fileIcon().opacity(
          1,
          0.30,
          easeOutCubic,
        ),

        fileIcon().scale(
          1,
          0.30,
          easeOutCubic,
        ),
      ),
    ),
  );

  /*
   * CURSOR
   */

  yield* waitFor(0.12);

  yield* all(
    cursor().opacity(
      1,
      0.12,
      easeOutCubic,
    ),

    cursor().position(
      [48, -12],
      0.42,
      easeInOutCubic,
    ),
  );

  yield* waitFor(0.08);

  /*
   * CLICK
   */

  clickRingA().opacity(1);
  clickRingB().opacity(1);

  yield* all(
    cursor().scale(
      0.70,
      0.07,
      easeInCubic,
    ),

    cursor().y(
      -8,
      0.07,
      easeInCubic,
    ),

    fileIcon().scale(
      0.985,
      0.07,
      easeInCubic,
    ),

    clickRingA().scale(
      2.6,
      0.26,
      easeOutCubic,
    ),

    clickRingA().opacity(
      0,
      0.20,
      easeOutCubic,
    ),

    chain(
      waitFor(0.03),

      all(
        clickRingB().scale(
          3.5,
          0.22,
          easeOutCubic,
        ),

        clickRingB().opacity(
          0,
          0.22,
          easeOutCubic,
        ),
      ),
    ),
  );

  yield* all(
    cursor().scale(
      0.78,
      0.08,
      easeOutCubic,
    ),

    cursor().y(
      -12,
      0.06,
      easeOutCubic,
    ),

    fileIcon().scale(
      1,
      0.06,
      easeOutCubic,
    ),
  );

  yield* waitFor(0.04);

  /*
   * OPEN VIEWER
   */

  yield* all(
    cursor().opacity(
      0,
      0.12,
      easeInCubic,
    ),

    fileIcon().opacity(
      0,
      0.28,
      easeInCubic,
    ),

    fileIcon().scale(
      0.76,
      0.38,
      easeInCubic,
    ),

    programWindow().opacity(
      1,
      0.28,
      easeOutCubic,
    ),

    programWindow().scale(
      1,
      0.45,
      easeOutCubic,
    ),
  );

  /*
   * ---------------------------------------------------------
   * LANDSCAPE ASSEMBLES
   *
   * Same vertical timings/geometry as the square version.
   * ---------------------------------------------------------
   */

  yield* all(
    sky().opacity(
      1,
      0.15,
      easeOutCubic,
    ),

    chain(
      waitFor(0.03),

      all(
        sun().opacity(
          1,
          0.14,
          easeOutCubic,
        ),

        sun().scale(
          1,
          0.22,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.06),

      all(
        cloudA().opacity(
          1,
          0.16,
          easeOutCubic,
        ),

        cloudA().x(
          -205,
          0.16,
          easeOutCubic,
        ),

        cloudB().opacity(
          1,
          0.16,
          easeOutCubic,
        ),

        cloudB().x(
          125,
          0.16,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.10),

      all(
        farMountains().opacity(
          1,
          0.16,
          easeOutCubic,
        ),

        farMountains().y(
          0,
          0.30,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.16),

      all(
        nearMountains().opacity(
          1,
          0.16,
          easeOutCubic,
        ),

        nearMountains().y(
          0,
          0.30,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.22),

      lake().opacity(
        1,
        0.22,
        easeOutCubic,
      ),
    ),

    chain(
      waitFor(0.27),

      all(
        leftShore().opacity(
          1,
          0.18,
          easeOutCubic,
        ),

        leftShore().y(
          0,
          0.28,
          easeOutCubic,
        ),

        rightShore().opacity(
          1,
          0.18,
          easeOutCubic,
        ),

        rightShore().y(
          0,
          0.28,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.32),

      sequence(
        0.03,

        ...treeRefs.map(
          (ref, index) =>
            all(
              ref().opacity(
                1,
                0.12,
                easeOutCubic,
              ),

              /*
               * Restore normal visual tree size,
               * while cancelling the landscape's
               * horizontal stretching.
               */
              ref().scale(
                [
                  LANDSCAPE_X_INVERSE,
                  1,
                ],
                0.18,
                easeOutCubic,
              ),

              ref().y(
                treePositions[
                  index
                ][1],
                0.20,
                easeOutCubic,
              ),
            ),
        ),
      ),
    ),
  );

  yield* waitFor(0.85);

  /*
   * ---------------------------------------------------------
   * LANDSCAPE BREAKS APART
   * ---------------------------------------------------------
   */

  yield* all(
    sun().opacity(
      0,
      0.30,
      easeInCubic,
    ),

    sun().scale(
      0.3,
      0.32,
      easeInCubic,
    ),

    cloudA().x(
      -280,
      0.32,
      easeInOutCubic,
    ),

    cloudA().opacity(
      0,
      0.30,
      easeInCubic,
    ),

    cloudB().x(
      205,
      0.32,
      easeInOutCubic,
    ),

    cloudB().opacity(
      0,
      0.30,
      easeInCubic,
    ),

    farMountains().x(
      -100,
      0.34,
      easeInOutCubic,
    ),

    farMountains().opacity(
      0,
      0.32,
      easeInCubic,
    ),

    nearMountains().x(
      110,
      0.34,
      easeInOutCubic,
    ),

    nearMountains().opacity(
      0,
      0.32,
      easeInCubic,
    ),

    lake().scale(
      [1, 0.2],
      0.34,
      easeInCubic,
    ),

    lake().opacity(
      0,
      0.38,
      easeInCubic,
    ),

    leftShore().x(
      -130,
      0.34,
      easeInOutCubic,
    ),

    leftShore().opacity(
      0,
      0.38,
      easeInCubic,
    ),

    rightShore().x(
      130,
      0.34,
      easeInOutCubic,
    ),

    rightShore().opacity(
      0,
      0.38,
      easeInCubic,
    ),

    ...treeRefs.map(
      (ref, index) =>
        all(
          ref().x(
            treePositions[
              index
            ][0] +
              (
                index < 4
                  ? -70
                  : 70
              ),
            0.30,
            easeInOutCubic,
          ),

          ref().rotation(
            index % 2 === 0
              ? -14
              : 14,
            0.30,
            easeInOutCubic,
          ),

          ref().scale(
            [
              0.25 *
                LANDSCAPE_X_INVERSE,
              0.25,
            ],
            0.40,
            easeInCubic,
          ),

          ref().opacity(
            0,
            0.28,
            easeInCubic,
          ),
        ),
    ),

    chain(
      waitFor(0.04),

      all(
        programWindow().scale(
          [0.055, 1],
          0.40,
          easeInCubic,
        ),

        programWindow().rotation(
          -2,
          0.40,
          easeInOutCubic,
        ),
      ),
    ),
  );

  /*
   * SWITCH INTERPRETATION
   */

  landscape().opacity(0);

  programTitle().text(
    'Doom',
  );

  /*
   * ---------------------------------------------------------
   * DOOM FLIPS IN + ONE CONTINUOUS BACKGROUND ZOOM
   * ---------------------------------------------------------
   *
   * Important: this uses plain `yield`, not `yield*`.
   * That starts the zoom as a concurrent thread and lets the
   * rest of the scene continue while that SAME tween keeps
   * running. There are no separate push-ins.
   */

  doomFrame().opacity(1);
  doomArtwork().opacity(1);
  doomArtwork().scale(DOOM_ZOOM_START);

  /*
   * Start the zoom BEFORE reopening the edge-on window.
   * The image is therefore already moving as the flip reveals it.
   */
  yield doomArtwork().scale(
    DOOM_ZOOM_END,
    DOOM_ZOOM_DURATION,
    linear,
  );

  yield* all(
    programWindow().scale(
      [1, 1],
      0.55,
      easeOutCubic,
    ),

    programWindow().rotation(
      0,
      0.55,
      easeOutCubic,
    ),
  );

  /*
   * Hold on Doom while the SAME background zoom keeps running.
   */
  yield* waitFor(DOOM_HOLD_BEFORE_FADE);

  /*
   * Fade Doom away completely.
   * Leave the stage empty so you can animate POLYGLOT in Fusion.
   */

  yield* all(
    programWindow().opacity(
      0,
      0.46,
      easeInCubic,
    ),

    programWindow().scale(
      0.72,
      0.60,
      easeInCubic,
    ),

    programWindow().y(
      -30,
      0.60,
      easeInOutCubic,
    ),

    doomArtwork().opacity(
      0,
      0.38,
      easeInCubic,
    ),

    doomFrame().opacity(
      0,
      0.38,
      easeInCubic,
    ),
  );

  yield* waitFor(EMPTY_GAP_BEFORE_SUMMARY);

  /*
   * Bring in the clean file-format summary graphic.
   * No POLYGLOT text here.
   */

  yield* all(
    summary().opacity(
      1,
      0.38,
      easeOutCubic,
    ),

    summary().scale(
      1,
      0.55,
      easeOutCubic,
    ),

    summary().y(
      0,
      0.55,
      easeOutCubic,
    ),
  );

  yield* waitFor(1.95);
});