import {
  makeScene2D,
  Node,
  Line,
  Rect,
  Circle,
  Txt,
} from '@motion-canvas/2d';

import {
  createRef,
  all,
  chain,
  waitFor,
  easeInOutCubic,
  easeOutCubic,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const root = createRef<Node>();

  const file = createRef<Node>();
  const connector = createRef<Line>();
  const bytes = createRef<Node>();

  const leftArrow = createRef<Line>();
  const rightArrow = createRef<Line>();

  const leftArrowHeadA = createRef<Line>();
  const leftArrowHeadB = createRef<Line>();
  const rightArrowHeadA = createRef<Line>();
  const rightArrowHeadB = createRef<Line>();

  const viewerWindow = createRef<Node>();
  const editorWindow = createRef<Node>();

  const rawBytes = ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'];
  const byteRefs = rawBytes.map(() => createRef<Rect>());

  const HOLD_BEFORE_TRANSFORM = 174 / 60; // 20:14 -> 23:08 at 60fps = 2.9s
  const COLLAPSE_DURATION = 0.50;
  const WINDOW_REVEAL_DURATION = 0.40;
  const LEFT_FOCUS_HOLD = 0.60;
  const SWAP_DURATION = 0.35;
  const RIGHT_FOCUS_HOLD = 0.60;
  const RESTORE_DURATION = 0.30;
  const FINAL_HOLD = 0.60;

  const FOCUSED_SCALE = 1.03;
  const DIMMED_SCALE = 0.94;
  const FOCUSED_OPACITY = 1.0;
  const DIMMED_OPACITY = 0.38;

  view.add(
    <Node ref={root} scale={1.25}>
      {/* FILE ICON — starts already in the "end of previous shot" position */}
      <Node ref={file} y={-200} opacity={1} scale={1}>
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

          <Rect
            width={105}
            height={85}
            radius={8}
            fill={'#d8ecff'}
            y={20}
            clip
          >
            <Circle
              width={20}
              height={20}
              fill={'#ffd54a'}
              x={28}
              y={-22}
            />

            <Line
              points={[
                [-55, 40],
                [-18, 0],
                [5, 24],
                [28, -5],
                [55, 40],
              ]}
              closed
              fill={'#62a66f'}
              stroke={'#62a66f'}
              lineWidth={2}
            />
          </Rect>
        </Node>

        <Txt
          text={'image.png'}
          fill={'#111111'}
          fontSize={34}
          fontFamily={'Arial'}
          fontWeight={500}
          y={85}
        />
      </Node>

      {/* CONNECTOR — fully drawn at scene start */}
      <Line
        ref={connector}
        points={[
          [0, -58],
          [0, 5],
        ]}
        stroke={'#777777'}
        lineWidth={5}
        lineCap={'round'}
        end={1}
        opacity={1}
      />

      {/* BYTES — start in previous shot position */}
      <Node ref={bytes} y={85} opacity={1} scale={1}>
        {rawBytes.map((byte, index) => (
          <Rect
            ref={byteRefs[index]}
            key={index}
            width={125}
            height={100}
            x={(index - (rawBytes.length - 1) / 2) * 155}
            radius={12}
            fill={'#eeeeee'}
            stroke={'#bdbdbd'}
            lineWidth={4}
            opacity={1}
            scale={1}
          >
            <Txt
              text={byte}
              fill={'#222222'}
              fontSize={46}
              fontFamily={'monospace'}
              fontWeight={700}
            />
          </Rect>
        ))}
      </Node>

      {/* ARROWS — hidden initially */}
      <Line
        ref={leftArrow}
        points={[
          [-110, -55],
          [-110, 0],
          [-280, 105],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      <Line
        ref={rightArrow}
        points={[
          [110, -55],
          [110, 0],
          [280, 105],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      <Line
        ref={leftArrowHeadA}
        points={[
          [-280, 105],
          [-260, 88],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        opacity={0}
      />
      <Line
        ref={leftArrowHeadB}
        points={[
          [-280, 105],
          [-276, 80],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        opacity={0}
      />

      <Line
        ref={rightArrowHeadA}
        points={[
          [280, 105],
          [260, 88],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        opacity={0}
      />
      <Line
        ref={rightArrowHeadB}
        points={[
          [280, 105],
          [276, 80],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        opacity={0}
      />

      {/* IMAGE VIEWER WINDOW */}
      <Node
        ref={viewerWindow}
        x={-290}
        y={250}
        opacity={0}
        scale={0.90}
      >
        <Rect
          width={250}
          height={155}
          radius={12}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.20)'}
          shadowBlur={18}
          shadowOffsetY={8}
          clip
        >
          <Rect
            width={250}
            height={34}
            y={-60.5}
            fill={'#2f3238'}
          />

          <Circle width={12} height={12} x={-103} y={-60.5} fill={'#ff5f57'} />
          <Circle width={12} height={12} x={-83} y={-60.5} fill={'#febc2e'} />
          <Circle width={12} height={12} x={-63} y={-60.5} fill={'#28c840'} />

          <Txt
            text={'Image Viewer'}
            y={-60.5}
            fontSize={20}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
          />

          <Rect
            width={160}
            height={86}
            y={18}
            fill={'#ffffff'}
            stroke={'#cfcfcf'}
            lineWidth={2}
            clip
          >
            <Rect
              width={144}
              height={70}
              y={0}
              fill={'#93c5fd'}
            />

            <Circle
              width={16}
              height={16}
              fill={'#ffffff'}
              x={48}
              y={-20}
            />

            <Line
              points={[
                [-72, 28],
                [-38, -4],
                [-10, 20],
                [18, -8],
                [72, 28],
              ]}
              closed
              fill={'#718096'}
              stroke={'#718096'}
              lineWidth={2}
            />

            <Line
              points={[
                [-72, 30],
                [-48, 10],
                [-20, 28],
                [8, 8],
                [72, 30],
              ]}
              closed
              fill={'#5ca764'}
              stroke={'#5ca764'}
              lineWidth={2}
            />
          </Rect>
        </Rect>
      </Node>

      {/* TEXT EDITOR WINDOW */}
      <Node
        ref={editorWindow}
        x={290}
        y={250}
        opacity={0}
        scale={0.90}
      >
        <Rect
          width={250}
          height={155}
          radius={12}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.20)'}
          shadowBlur={18}
          shadowOffsetY={8}
          clip
        >
          <Rect
            width={250}
            height={34}
            y={-60.5}
            fill={'#2f3238'}
          />

          <Circle width={12} height={12} x={-103} y={-60.5} fill={'#ff5f57'} />
          <Circle width={12} height={12} x={-83} y={-60.5} fill={'#febc2e'} />
          <Circle width={12} height={12} x={-63} y={-60.5} fill={'#28c840'} />

          <Txt
            text={'Text Editor'}
            y={-60.5}
            fontSize={20}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
          />

          <Txt
            text={'%PNG....IHDR…'}
            x={-40}
            y={-12}
            width={170}
            fontSize={28}
            fontFamily={'monospace'}
            fill={'#111111'}
            textAlign={'left'}
          />

          <Txt
            text={'ÿØ...'}
            x={-74}
            y={26}
            width={170}
            fontSize={32}
            fontFamily={'monospace'}
            fill={'#111111'}
            textAlign={'left'}
          />
        </Rect>
      </Node>
    </Node>
  );

  // Start state for the next clip:
  // file visible at top, connector visible, bytes visible underneath.

  // Hold until 23:08 relative to the 20:14 clip start.
  yield* waitFor(HOLD_BEFORE_TRANSFORM);

  // Over about half a second:
  // - file disappears
  // - connector disappears
  // - bytes move up to where the file area was
  yield* all(
    file().opacity(0, COLLAPSE_DURATION, easeOutCubic),
    file().scale(0.92, COLLAPSE_DURATION, easeOutCubic),
    connector().opacity(0, COLLAPSE_DURATION * 0.65, easeOutCubic),
    bytes().y(-112, COLLAPSE_DURATION, easeInOutCubic),
    bytes().scale(0.96, COLLAPSE_DURATION, easeInOutCubic),
  );

  // Draw arrows and reveal windows.
  // Left window is highlighted first; right is dimmed and slightly smaller.
  yield* all(
    leftArrow().opacity(1, 0),
    rightArrow().opacity(1, 0),

    leftArrow().end(1, WINDOW_REVEAL_DURATION, easeInOutCubic),
    rightArrow().end(1, WINDOW_REVEAL_DURATION, easeInOutCubic),

    chain(
      waitFor(WINDOW_REVEAL_DURATION * 0.72),
      all(
        leftArrowHeadA().opacity(1, 0.08, easeOutCubic),
        leftArrowHeadB().opacity(1, 0.08, easeOutCubic),
        rightArrowHeadA().opacity(1, 0.08, easeOutCubic),
        rightArrowHeadB().opacity(1, 0.08, easeOutCubic),
      ),
    ),

    viewerWindow().opacity(FOCUSED_OPACITY, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    viewerWindow().scale(FOCUSED_SCALE, WINDOW_REVEAL_DURATION, easeOutCubic),

    editorWindow().opacity(DIMMED_OPACITY, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    editorWindow().scale(DIMMED_SCALE, WINDOW_REVEAL_DURATION, easeOutCubic),
  );

  // Hold on left focus.
  yield* waitFor(LEFT_FOCUS_HOLD);

  // Swap focus to the text editor.
  yield* all(
    viewerWindow().opacity(DIMMED_OPACITY, SWAP_DURATION, easeInOutCubic),
    viewerWindow().scale(DIMMED_SCALE, SWAP_DURATION, easeInOutCubic),

    editorWindow().opacity(FOCUSED_OPACITY, SWAP_DURATION, easeInOutCubic),
    editorWindow().scale(FOCUSED_SCALE, SWAP_DURATION, easeInOutCubic),
  );

  // Hold on right focus.
  yield* waitFor(RIGHT_FOCUS_HOLD);

  // Return both to normal.
  yield* all(
    viewerWindow().opacity(1, RESTORE_DURATION, easeInOutCubic),
    viewerWindow().scale(1, RESTORE_DURATION, easeInOutCubic),

    editorWindow().opacity(1, RESTORE_DURATION, easeInOutCubic),
    editorWindow().scale(1, RESTORE_DURATION, easeInOutCubic),
  );

  yield* waitFor(FINAL_HOLD);
});