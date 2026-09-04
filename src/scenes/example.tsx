import {
  makeScene2D,
  Node,
  Line,
  Path,
  Rect,
  Circle,
  Txt,
} from '@motion-canvas/2d';

import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
  easeOutCubic,
} from '@motion-canvas/core';

function PngPreview(props: {scale?: number}) {
  const scale = props.scale ?? 1;

  return (
    <Node scale={scale}>
      <Rect
        width={105}
        height={85}
        radius={8}
        fill={'#d8ecff'}
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
  );
}

export default makeScene2D(function* (view) {
  const root = createRef<Node>();

  const file = createRef<Node>();
  const connector = createRef<Line>();
  const bytes = createRef<Node>();

  const splitStem = createRef<Line>();
  const leftArrow = createRef<Path>();
  const rightArrow = createRef<Path>();

  const viewerWindow = createRef<Node>();
  const editorWindow = createRef<Node>();

  const rawBytes = ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'];

  const HOLD_BEFORE_TRANSFORM = 174 / 60; // 20:14 -> 23:08 at 60 fps
  const COLLAPSE_DURATION = 0.50;
  const STEM_DRAW_DURATION = 0.16;
  const BRANCH_DRAW_DURATION = 0.38;
  const WINDOW_REVEAL_DURATION = 0.40;
  const LEFT_FOCUS_HOLD = 0.60;
  const SWAP_DURATION = 0.35;
  const RIGHT_FOCUS_HOLD = 0.60;
  const RESTORE_DURATION = 0.30;
  const FINAL_HOLD = 0.60;

  const FINAL_BYTES_Y = -155;

  const WINDOW_X = 300;
  const WINDOW_Y = 205;
  const WINDOW_WIDTH = 500;
  const WINDOW_HEIGHT = 340;
  const TITLEBAR_HEIGHT = 42;

  const FOCUSED_SCALE = 1.03;
  const DIMMED_SCALE = 0.92;
  const FOCUSED_OPACITY = 1.0;
  const DIMMED_OPACITY = 0.35;

  view.add(
    <Node ref={root} scale={1.25}>
      {/* FILE ICON — starts already in the end state of the previous shot */}
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

      {/* CONNECTOR — visible at scene start */}
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

      {/* BYTES — visible at scene start */}
      <Node ref={bytes} y={85} opacity={1} scale={1}>
        {rawBytes.map((byte, index) => (
          <Rect
            key={`${index}`}
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
              fill={'#2b2b2b'}
              fontSize={46}
              fontFamily={'monospace'}
              fontWeight={700}
            />
          </Rect>
        ))}
      </Node>

      {/* SHARED STEM AND CURVED SPLIT ARROWS */}
      <Line
        ref={splitStem}
        points={[
          [0, -92],
          [0, -66],
        ]}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      <Path
        ref={leftArrow}
        data={`M 0 -66 C 0 -25, ${-WINDOW_X} -40, ${-WINDOW_X} -5 L ${-WINDOW_X} 22`}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        endArrow
        arrowSize={14}
        end={0}
        opacity={0}
      />

      <Path
        ref={rightArrow}
        data={`M 0 -66 C 0 -25, ${WINDOW_X} -40, ${WINDOW_X} -5 L ${WINDOW_X} 22`}
        stroke={'#333333'}
        lineWidth={5}
        lineCap={'round'}
        endArrow
        arrowSize={14}
        end={0}
        opacity={0}
      />

      {/* IMAGE VIEWER WINDOW */}
      <Node
        ref={viewerWindow}
        x={-WINDOW_X}
        y={WINDOW_Y}
        opacity={0}
        scale={0.88}
      >
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={16}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.22)'}
          shadowBlur={22}
          shadowOffsetY={10}
          clip
        >
          <Rect
            width={WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#2f3238'}
          />

          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 26}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#ff5f57'}
          />
          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 48}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#febc2e'}
          />
          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 70}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#28c840'}
          />

          <Txt
            text={'Image Viewer'}
            x={58}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fontSize={24}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
          />

          <Rect
            width={300}
            height={200}
            y={30}
            fill={'#ffffff'}
            stroke={'#d7d7d7'}
            lineWidth={2}
            clip
          >
            <PngPreview scale={2.4} />
          </Rect>
        </Rect>
      </Node>

      {/* TEXT EDITOR WINDOW */}
      <Node
        ref={editorWindow}
        x={WINDOW_X}
        y={WINDOW_Y}
        opacity={0}
        scale={0.88}
      >
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={16}
          fill={'#f2f2f2'}
          stroke={'#2f2f2f'}
          lineWidth={3}
          shadowColor={'rgba(0,0,0,0.22)'}
          shadowBlur={22}
          shadowOffsetY={10}
          clip
        >
          <Rect
            width={WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#2f3238'}
          />

          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 26}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#ff5f57'}
          />
          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 48}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#febc2e'}
          />
          <Circle
            width={13}
            height={13}
            x={-(WINDOW_WIDTH / 2) + 70}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={'#28c840'}
          />

          <Txt
            text={'Text Editor'}
            x={52}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fontSize={24}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={'#ffffff'}
          />

          <Txt
            text={'%PNG....IHDR…'}
            x={18}
            y={-36}
            width={340}
            fontSize={34}
            fontFamily={'monospace'}
            fill={'#111111'}
            textAlign={'left'}
          />

          <Txt
            text={'ÿØ...'}
            x={-16}
            y={18}
            width={340}
            fontSize={38}
            fontFamily={'monospace'}
            fill={'#111111'}
            textAlign={'left'}
          />
        </Rect>
      </Node>
    </Node>
  );

  // Hold until the transformation point
  yield* waitFor(HOLD_BEFORE_TRANSFORM);

  // File disappears, connector disappears, bytes move upward
  yield* all(
    file().opacity(0, COLLAPSE_DURATION, easeOutCubic),
    file().scale(0.92, COLLAPSE_DURATION, easeOutCubic),
    connector().opacity(0, COLLAPSE_DURATION * 0.65, easeOutCubic),
    bytes().y(FINAL_BYTES_Y, COLLAPSE_DURATION, easeInOutCubic),
  );

  // Draw the shared stem, then both curved branches.
  splitStem().opacity(1);
  yield* splitStem().end(1, STEM_DRAW_DURATION, easeInOutCubic);

  leftArrow().opacity(1);
  rightArrow().opacity(1);
  yield* all(
    leftArrow().end(1, BRANCH_DRAW_DURATION, easeInOutCubic),
    rightArrow().end(1, BRANCH_DRAW_DURATION, easeInOutCubic),
  );

  // Reveal the windows only after the split-arrow drawing is complete.
  // Image viewer starts focused, text editor starts dimmed.
  yield* all(
    viewerWindow().opacity(FOCUSED_OPACITY, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    viewerWindow().scale(FOCUSED_SCALE, WINDOW_REVEAL_DURATION, easeOutCubic),

    editorWindow().opacity(DIMMED_OPACITY, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    editorWindow().scale(DIMMED_SCALE, WINDOW_REVEAL_DURATION, easeOutCubic),
  );

  // Hold on image viewer focus
  yield* waitFor(LEFT_FOCUS_HOLD);

  // Swap focus to text editor
  yield* all(
    viewerWindow().opacity(DIMMED_OPACITY, SWAP_DURATION, easeInOutCubic),
    viewerWindow().scale(DIMMED_SCALE, SWAP_DURATION, easeInOutCubic),

    editorWindow().opacity(FOCUSED_OPACITY, SWAP_DURATION, easeInOutCubic),
    editorWindow().scale(FOCUSED_SCALE, SWAP_DURATION, easeInOutCubic),
  );

  // Hold on text editor focus
  yield* waitFor(RIGHT_FOCUS_HOLD);

  // Return both to normal
  yield* all(
    viewerWindow().opacity(1, RESTORE_DURATION, easeInOutCubic),
    viewerWindow().scale(1, RESTORE_DURATION, easeInOutCubic),

    editorWindow().opacity(1, RESTORE_DURATION, easeInOutCubic),
    editorWindow().scale(1, RESTORE_DURATION, easeInOutCubic),
  );

  yield* waitFor(FINAL_HOLD);
});
