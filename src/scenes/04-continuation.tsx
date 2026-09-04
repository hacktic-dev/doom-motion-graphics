import {
  Circle,
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
  sequence,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';

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

const treePositions = [
  [-250, 130],
  [-170, 148],
  [-110, 126],
  [115, 128],
  [180, 112],
  [250, 145],
];

export default makeScene2D(function* (view) {
  /*
   * =========================================================
   * REFERENCES
   * =========================================================
   */

  const openingNodeRefs = openingBytes.map(
    () => createRef<Node>(),
  );

  const openingRectRefs = openingBytes.map(
    () => createRef<Rect>(),
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

  /*
   * Click ripple.
   */
  const clickRingA = createRef<Circle>();
  const clickRingB = createRef<Circle>();

  const programWindow = createRef<Node>();
  const programTitle = createRef<Txt>();

  const landscape = createRef<Node>();

  const sky = createRef<Rect>();
  const sun = createRef<Circle>();

  const farMountains = createRef<Line>();
  const nearMountains = createRef<Line>();

  const river = createRef<Line>();

  const leftLand = createRef<Line>();
  const rightLand = createRef<Line>();

  const treeRefs = treePositions.map(
    () => createRef<Line>(),
  );

  const doomScene = createRef<Node>();

  const doomFloor = createRef<Line>();
  const doomLeftWall = createRef<Line>();
  const doomRightWall = createRef<Line>();
  const doomDoor = createRef<Rect>();

  const doomEnemy = createRef<Node>();
  const doomHud = createRef<Node>();
  const doomGun = createRef<Line>();

  const polyglotLabel = createRef<Txt>();

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
       * EXACT SCENE 3 ENDING
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
              ref={openingRectRefs[index]}
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
              x={DATA_LEFT + width / 2}
              y={dataLineInitialY[index]}
              fill={'#b7b7b7'}
            />
          ),
        )}

        {insertedLineWidths.map(
          (width, index) => (
            <Rect
              ref={insertedLineRefs[index]}
              key={`inserted-line-${index}`}
              width={width}
              height={17}
              radius={8.5}
              x={
                DATA_LEFT +
                width / 2 -
                180
              }
              y={insertedLineY[index]}
              fill={'#8874bd'}
              opacity={0}
              scale={[0.65, 1]}
              shadowColor={'rgba(95,72,150,0.16)'}
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
            shadowColor={'rgba(0,0,0,0.18)'}
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
       * CLICK RINGS
       *
       * Positioned at the final cursor-tip location.
       * -------------------------------------------------------
       */}

      <Circle
        ref={clickRingA}
        x={50}
        y={-10}
        width={18}
        height={18}
        stroke={'rgba(70,70,70,0.55)'}
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
        stroke={'rgba(70,70,70,0.32)'}
        lineWidth={3}
        fill={'rgba(0,0,0,0)'}
        opacity={0}
        scale={0.2}
        zIndex={10}
      />

      {/*
       * -------------------------------------------------------
       * CLEAN MOUSE CURSOR
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
          shadowColor={'rgba(0,0,0,0.20)'}
          shadowBlur={7}
          shadowOffsetX={2}
          shadowOffsetY={3}
        />
      </Node>

      {/*
       * -------------------------------------------------------
       * LARGE CENTRED PROGRAM WINDOW
       * -------------------------------------------------------
       */}

      <Node
        ref={programWindow}
        y={0}
        opacity={0}
        scale={0.82}
        zIndex={4}
      >
        <Rect
          width={1160}
          height={800}
          radius={18}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.22)'}
          shadowBlur={24}
          shadowOffsetY={11}
          clip
        >
          <Rect
            width={1160}
            height={56}
            y={-372}
            fill={'#2f3238'}
          />

          <Circle
            width={15}
            height={15}
            x={-548}
            y={-372}
            fill={'#ff5f57'}
          />

          <Circle
            width={15}
            height={15}
            x={-522}
            y={-372}
            fill={'#febc2e'}
          />

          <Circle
            width={15}
            height={15}
            x={-496}
            y={-372}
            fill={'#28c840'}
          />

          <Txt
            ref={programTitle}
            text={'Image Viewer'}
            x={-430}
            y={-372}
            width={290}
            fontSize={30}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
            textAlign={'left'}
          />

          {/*
           * SQUARE IMAGE / GAME AREA
           */}

          <Rect
            width={680}
            height={680}
            radius={16}
            y={38}
            fill={'#ffffff'}
            stroke={'#d1d1d1'}
            lineWidth={3}
            shadowColor={'rgba(0,0,0,0.08)'}
            shadowBlur={10}
            shadowOffsetY={4}
            clip
          >
            {/*
             * ================================================
             * IMAGE VIEWER
             * ================================================
             */}

            <Node ref={landscape}>
              <Rect
                ref={sky}
                width={680}
                height={680}
                fill={'#d7e8f5'}
                opacity={0}
              />

              <Circle
                ref={sun}
                x={220}
                y={-220}
                width={92}
                height={92}
                fill={'#f0c85a'}
                opacity={0}
                scale={0.15}
              />

              <Line
                ref={farMountains}
                points={[
                  [-340, 170],
                  [-270, 120],
                  [-200, 150],
                  [-120, 90],
                  [-40, 145],
                  [40, 105],
                  [120, 152],
                  [200, 96],
                  [280, 155],
                  [340, 118],
                  [340, 210],
                  [-340, 210],
                ]}
                closed
                fill={'#7a9fc9'}
                opacity={0}
                y={-22}
              />

              <Line
                ref={nearMountains}
                points={[
                  [-340, 200],
                  [-255, 132],
                  [-175, 188],
                  [-85, 110],
                  [0, 182],
                  [90, 122],
                  [180, 196],
                  [270, 135],
                  [340, 188],
                  [340, 235],
                  [-340, 235],
                ]}
                closed
                fill={'#456f98'}
                opacity={0}
                y={-10}
              />

              <Line
                ref={leftLand}
                points={[
                  [-340, 86],
                  [-210, 50],
                  [-75, 78],
                  [0, 168],
                  [-340, 215],
                ]}
                closed
                fill={'#5d8b59'}
                opacity={0}
                y={155}
              />

              <Line
                ref={rightLand}
                points={[
                  [340, 74],
                  [210, 48],
                  [75, 82],
                  [0, 168],
                  [340, 215],
                ]}
                closed
                fill={'#628f5b'}
                opacity={0}
                y={155}
              />

              <Line
                ref={river}
                points={[
                  [-160, 340],
                  [-75, 170],
                  [0, 115],
                  [75, 170],
                  [160, 340],
                ]}
                closed
                fill={'#74b7da'}
                opacity={0}
                scale={[0.15, 1]}
              />

              {treePositions.map(
                ([x, y], index) => (
                  <Line
                    ref={treeRefs[index]}
                    key={`tree-${index}`}
                    x={x}
                    y={y}
                    points={[
                      [0, -44],
                      [32, 30],
                      [-32, 30],
                    ]}
                    closed
                    fill={
                      index % 2 === 0
                        ? '#2d6758'
                        : '#3a7865'
                    }
                    opacity={0}
                    scale={0.2}
                  />
                ),
              )}
            </Node>

            {/*
             * ================================================
             * DOOM
             * ================================================
             */}

            <Node
              ref={doomScene}
              opacity={0}
            >
              <Rect
                width={680}
                height={680}
                fill={'#1a1010'}
              />

              <Rect
                width={680}
                height={240}
                y={-220}
                fill={'#571313'}
              />

              <Line
                ref={doomLeftWall}
                points={[
                  [-340, 35],
                  [-125, 0],
                  [-55, 55],
                  [-55, 340],
                  [-340, 340],
                ]}
                closed
                fill={'#6f5840'}
                opacity={0}
              />

              <Line
                ref={doomRightWall}
                points={[
                  [340, 35],
                  [125, 0],
                  [55, 55],
                  [55, 340],
                  [340, 340],
                ]}
                closed
                fill={'#745b43'}
                opacity={0}
              />

              <Line
                ref={doomFloor}
                points={[
                  [-340, 340],
                  [-88, 74],
                  [88, 74],
                  [340, 340],
                ]}
                closed
                fill={'#3f3328'}
                opacity={0}
              />

              <Rect
                ref={doomDoor}
                width={122}
                height={164}
                y={42}
                fill={'#1d1a18'}
                stroke={'#8f7a57'}
                lineWidth={6}
                radius={6}
                opacity={0}
              />

              <Node
                ref={doomEnemy}
                y={24}
                opacity={0}
                scale={0.42}
              >
                <Line
                  points={[
                    [-46, -10],
                    [-28, -46],
                    [-10, -28],
                    [10, -28],
                    [28, -46],
                    [46, -10],
                    [58, 36],
                    [28, 70],
                    [-28, 70],
                    [-58, 36],
                  ]}
                  closed
                  fill={'#8c2020'}
                  stroke={'#4f0f0f'}
                  lineWidth={4}
                />

                <Circle
                  width={14}
                  height={14}
                  x={-15}
                  y={0}
                  fill={'#f8da72'}
                />

                <Circle
                  width={14}
                  height={14}
                  x={15}
                  y={0}
                  fill={'#f8da72'}
                />
              </Node>

              <Line
                ref={doomGun}
                points={[
                  [-52, 340],
                  [-24, 260],
                  [24, 260],
                  [52, 340],
                ]}
                closed
                fill={'#6b7076'}
                stroke={'#373b40'}
                lineWidth={4}
                opacity={0}
              />

              <Node
                ref={doomHud}
                y={296}
                opacity={0}
              >
                <Rect
                  width={680}
                  height={88}
                  fill={'#6c675a'}
                />

                <Rect
                  x={-190}
                  width={122}
                  height={50}
                  radius={10}
                  fill={'#49453d'}
                >
                  <Txt
                    text={'AMMO 50'}
                    fill={'#d8d3c8'}
                    fontSize={22}
                    fontFamily={'Arial'}
                    fontWeight={700}
                  />
                </Rect>

                <Rect
                  width={122}
                  height={50}
                  radius={10}
                  fill={'#49453d'}
                >
                  <Txt
                    text={'HEALTH 100'}
                    fill={'#d8d3c8'}
                    fontSize={20}
                    fontFamily={'Arial'}
                    fontWeight={700}
                  />
                </Rect>

                <Rect
                  x={190}
                  width={122}
                  height={50}
                  radius={10}
                  fill={'#49453d'}
                >
                  <Txt
                    text={'ARMOR 0'}
                    fill={'#d8d3c8'}
                    fontSize={21}
                    fontFamily={'Arial'}
                    fontWeight={700}
                  />
                </Rect>
              </Node>
            </Node>
          </Rect>
        </Rect>
      </Node>

      <Txt
        ref={polyglotLabel}
        text={'POLYGLOT'}
        y={390}
        fill={'#61509d'}
        fontSize={47}
        fontFamily={'Arial'}
        fontWeight={700}
        opacity={0}
        scale={0.9}
      />

      {/*
       * -------------------------------------------------------
       * FINAL SUMMARY
       * -------------------------------------------------------
       */}

      <Node
        ref={summary}
        opacity={0}
        scale={0.82}
        y={15}
        zIndex={9}
      >
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

        <Txt
          text={'89 50 4E\n47 0D 0A'}
          fill={'#777777'}
          fontSize={20}
          fontFamily={'monospace'}
          fontWeight={700}
          lineHeight={33}
          opacity={0.55}
          y={8}
        />

        <Line
          points={[
            [-90, 15],
            [-205, 15],
          ]}
          stroke={'#777777'}
          lineWidth={4}
          lineCap={'round'}
        />

        <Line
          points={[
            [90, 15],
            [205, 15],
          ]}
          stroke={'#777777'}
          lineWidth={4}
          lineCap={'round'}
        />

        <Rect
          x={-290}
          y={15}
          width={155}
          height={76}
          radius={14}
          fill={'#d4f0d5'}
          stroke={'#4d8d57'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.12)'}
          shadowBlur={10}
          shadowOffsetY={4}
        >
          <Txt
            text={'PNG'}
            fill={'#377b42'}
            fontSize={35}
            fontFamily={'Arial'}
            fontWeight={700}
          />
        </Rect>

        <Rect
          x={290}
          y={15}
          width={155}
          height={76}
          radius={14}
          fill={'#dcd6f2'}
          stroke={'#66539e'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.12)'}
          shadowBlur={10}
          shadowOffsetY={4}
        >
          <Txt
            text={'HTML'}
            fill={'#59458f'}
            fontSize={32}
            fontFamily={'Arial'}
            fontWeight={700}
          />
        </Rect>

        <Txt
          text={'POLYGLOT'}
          fill={'#2f2f2f'}
          fontSize={38}
          fontFamily={'Arial'}
          fontWeight={700}
          y={190}
        />
      </Node>
    </Node>,
  );

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  function* flipOpeningGlyphToByte(
    index: number,
  ) {
    const node =
      openingNodeRefs[index]();

    yield* node.scale(
      [0, 1],
      0.10,
      easeInCubic,
    );

    openingGlyphRefs[index]().opacity(0);
    openingByteRefs[index]().opacity(1);

    yield* node.scale(
      [1, 1],
      0.10,
      easeOutCubic,
    );
  }

  /*
   * =========================================================
   * TIMELINE
   * =========================================================
   */

  yield* waitFor(0.25);

  yield* sequence(
    0.08,

    ...openingGlyphs.map(
      (_, index) =>
        flipOpeningGlyphToByte(index),
    ),
  );

  /*
   * HEX → ABSTRACT CONTENTS
   */

  yield* all(
    sequence(
      0.04,

      ...openingNodeRefs.map(
        ref =>
          all(
            ref().x(
              0,
              0.55,
              easeInOutCubic,
            ),

            ref().y(
              0,
              0.55,
              easeInOutCubic,
            ),

            ref().scale(
              0.12,
              0.55,
              easeInCubic,
            ),

            ref().opacity(
              0,
              0.42,
              easeInCubic,
            ),
          ),
      ),
    ),

    chain(
      waitFor(0.18),

      all(
        dataSheet().opacity(
          1,
          0.38,
          easeOutCubic,
        ),

        dataSheet().scale(
          1,
          0.55,
          easeOutCubic,
        ),
      ),
    ),
  );

  yield* waitFor(0.40);

  /*
   * FILE CONTENTS SPLIT
   */

  yield* all(
    ...dataLineRefs.map(
      (ref, index) =>
        ref().y(
          dataLineSplitY[index],
          0.60,
          easeInOutCubic,
        ),
    ),
  );

  /*
   * INSERT PURPLE CONTENT
   */

  yield* sequence(
    0.11,

    ...insertedLineRefs.map(
      (ref, index) =>
        all(
          ref().opacity(
            1,
            0.22,
            easeOutCubic,
          ),

          ref().x(
            DATA_LEFT +
              insertedLineWidths[index] /
                2,
            0.52,
            easeInOutCubic,
          ),

          ref().scale(
            [1, 1],
            0.52,
            easeOutCubic,
          ),
        ),
    ),
  );

  yield* waitFor(0.55);

  /*
   * ABSTRACT CONTENTS → IMAGE.PNG
   */

  yield* all(
    dataSheet().scale(
      0.22,
      0.62,
      easeInCubic,
    ),

    dataSheet().opacity(
      0,
      0.50,
      easeInCubic,
    ),

    dataSheet().y(
      -15,
      0.62,
      easeInOutCubic,
    ),

    chain(
      waitFor(0.18),

      all(
        fileIcon().opacity(
          1,
          0.34,
          easeOutCubic,
        ),

        fileIcon().scale(
          1,
          0.46,
          easeOutCubic,
        ),
      ),
    ),
  );

  /*
   * ---------------------------------------------------------
   * CURSOR ENTERS
   * ---------------------------------------------------------
   */

  yield* waitFor(0.18);

  yield* all(
    cursor().opacity(
      1,
      0.15,
      easeOutCubic,
    ),

    cursor().position(
      [48, -12],
      0.52,
      easeInOutCubic,
    ),
  );

  yield* waitFor(0.12);

  /*
   * ---------------------------------------------------------
   * CLICK
   *
   * Keep the clean cursor, but restore the expanding rings.
   * ---------------------------------------------------------
   */

  clickRingA().opacity(1);
  clickRingB().opacity(1);

  yield* all(
    /*
     * Cursor presses down.
     */
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

    /*
     * File responds very subtly.
     */
    fileIcon().scale(
      0.985,
      0.07,
      easeInCubic,
    ),

    /*
     * First click ripple.
     */
    clickRingA().scale(
      2.6,
      0.30,
      easeOutCubic,
    ),

    clickRingA().opacity(
      0,
      0.30,
      easeOutCubic,
    ),

    /*
     * Slightly slower outer ripple.
     */
    chain(
      waitFor(0.035),

      all(
        clickRingB().scale(
          3.5,
          0.35,
          easeOutCubic,
        ),

        clickRingB().opacity(
          0,
          0.35,
          easeOutCubic,
        ),
      ),
    ),
  );

  /*
   * Cursor releases.
   */

  yield* all(
    cursor().scale(
      0.78,
      0.09,
      easeOutCubic,
    ),

    cursor().y(
      -12,
      0.09,
      easeOutCubic,
    ),

    fileIcon().scale(
      1,
      0.09,
      easeOutCubic,
    ),
  );

  yield* waitFor(0.07);

  /*
   * FILE → IMAGE VIEWER
   */

  yield* all(
    cursor().opacity(
      0,
      0.16,
      easeInCubic,
    ),

    fileIcon().opacity(
      0,
      0.38,
      easeInCubic,
    ),

    fileIcon().scale(
      0.76,
      0.46,
      easeInCubic,
    ),

    programWindow().opacity(
      1,
      0.42,
      easeOutCubic,
    ),

    programWindow().scale(
      1,
      0.62,
      easeOutCubic,
    ),
  );

  /*
   * LANDSCAPE ASSEMBLES
   */

  yield* all(
    sky().opacity(
      1,
      0.22,
      easeOutCubic,
    ),

    chain(
      waitFor(0.05),

      all(
        sun().opacity(
          1,
          0.20,
          easeOutCubic,
        ),

        sun().scale(
          1,
          0.34,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.10),

      all(
        farMountains().opacity(
          1,
          0.24,
          easeOutCubic,
        ),

        farMountains().y(
          0,
          0.52,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.20),

      all(
        nearMountains().opacity(
          1,
          0.24,
          easeOutCubic,
        ),

        nearMountains().y(
          0,
          0.52,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.28),

      all(
        leftLand().opacity(
          1,
          0.24,
          easeOutCubic,
        ),

        leftLand().y(
          0,
          0.46,
          easeOutCubic,
        ),

        rightLand().opacity(
          1,
          0.24,
          easeOutCubic,
        ),

        rightLand().y(
          0,
          0.46,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.34),

      all(
        river().opacity(
          1,
          0.22,
          easeOutCubic,
        ),

        river().scale(
          [1, 1],
          0.54,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.42),

      sequence(
        0.05,

        ...treeRefs.map(
          (ref, index) =>
            all(
              ref().opacity(
                1,
                0.18,
                easeOutCubic,
              ),

              ref().scale(
                1,
                0.24,
                easeOutCubic,
              ),

              ref().y(
                treePositions[index][1],
                0.28,
                easeOutCubic,
              ),
            ),
        ),
      ),
    ),
  );

  yield* waitFor(1.00);

  /*
   * LANDSCAPE BREAKS APART + WINDOW FLIPS
   */

  yield* all(
    sun().x(
      290,
      0.46,
      easeInOutCubic,
    ),

    sun().y(
      -150,
      0.46,
      easeInOutCubic,
    ),

    sun().scale(
      0.28,
      0.46,
      easeInCubic,
    ),

    sun().opacity(
      0,
      0.40,
      easeInCubic,
    ),

    farMountains().x(
      -120,
      0.46,
      easeInOutCubic,
    ),

    farMountains().rotation(
      -7,
      0.46,
      easeInOutCubic,
    ),

    farMountains().opacity(
      0,
      0.46,
      easeInCubic,
    ),

    nearMountains().x(
      135,
      0.46,
      easeInOutCubic,
    ),

    nearMountains().rotation(
      7,
      0.46,
      easeInOutCubic,
    ),

    nearMountains().opacity(
      0,
      0.46,
      easeInCubic,
    ),

    leftLand().x(
      -140,
      0.46,
      easeInOutCubic,
    ),

    leftLand().opacity(
      0,
      0.42,
      easeInCubic,
    ),

    rightLand().x(
      140,
      0.46,
      easeInOutCubic,
    ),

    rightLand().opacity(
      0,
      0.42,
      easeInCubic,
    ),

    river().scale(
      [0.18, 1],
      0.46,
      easeInCubic,
    ),

    river().opacity(
      0,
      0.42,
      easeInCubic,
    ),

    ...treeRefs.map(
      (ref, index) =>
        all(
          ref().x(
            treePositions[index][0] +
              (
                index < 3
                  ? -65
                  : 65
              ),
            0.40,
            easeInOutCubic,
          ),

          ref().rotation(
            index % 2 === 0
              ? -16
              : 16,
            0.40,
            easeInOutCubic,
          ),

          ref().scale(
            0.25,
            0.40,
            easeInCubic,
          ),

          ref().opacity(
            0,
            0.36,
            easeInCubic,
          ),
        ),
    ),

    chain(
      waitFor(0.08),

      all(
        programWindow().scale(
          [0.055, 1],
          0.52,
          easeInCubic,
        ),

        programWindow().rotation(
          -2,
          0.52,
          easeInOutCubic,
        ),
      ),
    ),
  );

  /*
   * EDGE-ON:
   * SWITCH TO DOOM
   */

  landscape().opacity(0);

  doomScene().opacity(1);

  programTitle().text(
    'Doom',
  );

  /*
   * WINDOW REOPENS AS DOOM
   */

  yield* all(
    programWindow().scale(
      [1, 1],
      0.72,
      easeOutCubic,
    ),

    programWindow().rotation(
      0,
      0.72,
      easeOutCubic,
    ),

    chain(
      waitFor(0.10),

      all(
        doomLeftWall().opacity(
          1,
          0.20,
          easeOutCubic,
        ),

        doomRightWall().opacity(
          1,
          0.20,
          easeOutCubic,
        ),

        doomFloor().opacity(
          1,
          0.20,
          easeOutCubic,
        ),

        doomDoor().opacity(
          1,
          0.24,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.24),

      all(
        doomEnemy().opacity(
          1,
          0.22,
          easeOutCubic,
        ),

        doomEnemy().scale(
          1,
          0.30,
          easeOutCubic,
        ),
      ),
    ),

    chain(
      waitFor(0.30),

      doomGun().opacity(
        1,
        0.18,
        easeOutCubic,
      ),
    ),

    chain(
      waitFor(0.34),

      doomHud().opacity(
        1,
        0.22,
        easeOutCubic,
      ),
    ),
  );

  yield* waitFor(1.00);

  /*
   * POLYGLOT REVEAL
   */

  yield* all(
    polyglotLabel().opacity(
      1,
      0.35,
      easeOutCubic,
    ),

    polyglotLabel().scale(
      1,
      0.45,
      easeOutCubic,
    ),

    polyglotLabel().y(
      372,
      0.45,
      easeOutCubic,
    ),
  );

  yield* waitFor(1.15);

  /*
   * FINAL SUMMARY
   */

  yield* all(
    programWindow().opacity(
      0,
      0.58,
      easeInCubic,
    ),

    programWindow().scale(
      0.72,
      0.72,
      easeInCubic,
    ),

    programWindow().y(
      -30,
      0.72,
      easeInOutCubic,
    ),

    polyglotLabel().opacity(
      0,
      0.40,
      easeInCubic,
    ),

    polyglotLabel().scale(
      0.82,
      0.50,
      easeInCubic,
    ),

    summary().opacity(
      1,
      0.50,
      easeOutCubic,
    ),

    summary().scale(
      1,
      0.75,
      easeOutCubic,
    ),
  );

  yield* waitFor(2.20);
});