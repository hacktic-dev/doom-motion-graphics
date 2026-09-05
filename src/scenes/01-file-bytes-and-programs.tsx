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
  chain,
  sequence,
  waitFor,
  easeInOutCubic,
  easeOutCubic,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';

const COLORS = {
  background: '#21232E',
  card: '#343746',
  panelDeep: '#242733',
  titlebar: '#1B1D26',
  border: '#50566A',
  borderStrong: '#646B82',
  text: '#F4F6FA',
  textMuted: '#AEB5C6',
  shadow: 'rgba(0,0,0,0.38)',
  shadowSoft: 'rgba(0,0,0,0.28)',
};

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
  const byteRefs = rawBytes.map(() => createRef<Rect>());

  const COLLAPSE_DURATION = 0.50;
  const STEM_DRAW_DURATION = 0.16;
  const BRANCH_DRAW_DURATION = 0.38;
  const WINDOW_REVEAL_DURATION = 0.40;
  const NEUTRAL_WINDOW_HOLD = 0.30;
  const FOCUS_SEQUENCE_TIME_SCALE = 0.95;
  const LEFT_FOCUS_HOLD = 0.60 * FOCUS_SEQUENCE_TIME_SCALE;
  const SWAP_DURATION = 0.35 * FOCUS_SEQUENCE_TIME_SCALE;
  const RIGHT_FOCUS_HOLD = 0.60 * FOCUS_SEQUENCE_TIME_SCALE;
  const RESTORE_DURATION = 0.30 * FOCUS_SEQUENCE_TIME_SCALE;
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
    <Rect
      width={'100%'}
      height={'100%'}
      fill={COLORS.background}
      zIndex={-100}
    />,
  );

  view.add(
    <Node ref={root} scale={1.25}>
      {/* PNG file */}
      <Node ref={file} opacity={0} scale={0.08}>
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
            fill={COLORS.card}
            stroke={COLORS.borderStrong}
            lineWidth={4}
            radius={12}
            shadowColor={COLORS.shadow}
            shadowBlur={22}
            shadowOffsetY={10}
          />

          <Line
            points={[
              [35, -90],
              [35, -50],
              [75, -50],
            ]}
            stroke={COLORS.borderStrong}
            lineWidth={4}
          />

          <Line
            points={[
              [35, -90],
              [75, -50],
            ]}
            stroke={COLORS.borderStrong}
            lineWidth={4}
          />

          <Node y={20}>
            <PngPreview />
          </Node>
        </Node>

        <Txt
          text={'image.png'}
          fill={COLORS.text}
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
        stroke={COLORS.textMuted}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      {/* BYTES — visible at scene start */}
      <Node ref={bytes} y={85} opacity={1} scale={1}>
        {rawBytes.map((byte, index) => (
          <Rect
            ref={byteRefs[index]}
            key={`${index}`}
            width={125}
            height={100}
            x={(index - (rawBytes.length - 1) / 2) * 155}
            radius={12}
            fill={COLORS.card}
            stroke={COLORS.borderStrong}
            lineWidth={4}
            opacity={0}
            scale={0.08}
          >
            <Txt
              text={byte}
              fill={COLORS.text}
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
        stroke={COLORS.textMuted}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      <Path
        ref={leftArrow}
        data={`M 0 -66 C 0 -25, ${-WINDOW_X} -40, ${-WINDOW_X} -5 L ${-WINDOW_X} 22`}
        stroke={COLORS.textMuted}
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
        stroke={COLORS.textMuted}
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
          fill={COLORS.panelDeep}
          shadowColor={COLORS.shadow}
          shadowBlur={22}
          shadowOffsetY={10}
          clip
        >
          <Rect
            width={WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={COLORS.titlebar}
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
            x={0}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            width={308}
            fontSize={24}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={COLORS.text}
            textAlign={'left'}
          />

          <Node y={24}>
            <PngPreview scale={3.15} />
          </Node>
        </Rect>

        {/* Draw the window border after the clipped contents so the title bar cannot cover it. */}
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={16}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.borderStrong}
          lineWidth={3}
        />
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
          fill={COLORS.panelDeep}
          shadowColor={COLORS.shadow}
          shadowBlur={22}
          shadowOffsetY={10}
          clip
        >
          <Rect
            width={WINDOW_WIDTH}
            height={TITLEBAR_HEIGHT}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            fill={COLORS.titlebar}
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
            x={0}
            y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}
            width={308}
            fontSize={24}
            fontFamily={'Arial'}
            fontWeight={600}
            fill={COLORS.text}
            textAlign={'left'}
          />

          <Txt
            text={'%PNG....IHDR...........sRGB\n....gAMA........IDATx....'}
            x={0}
            y={-65}
            width={440}
            fontSize={30}
            lineHeight={42}
            fontFamily={'monospace'}
            fill={COLORS.text}
            textAlign={'left'}
          />
        </Rect>

        {/* Draw the window border after the clipped contents so the title bar cannot cover it. */}
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={16}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.borderStrong}
          lineWidth={3}
        />
      </Node>
    </Node>
  );

  // File icon and filename pop in.
  yield* all(
    file().opacity(1, 0.20),
    chain(
      file().scale(1.12, 0.19, easeInOutCubic),
      file().scale(1, 0.06, easeOutCubic),
    ),
  );

  // Let the file sit alone before revealing its contents.
  yield* waitFor(0.90);

  // Move the file upward and draw the connector.
  yield* file().y(-200, 0.30, easeInOutCubic);
  connector().opacity(1);
  yield* connector().end(1, 0.20, easeInOutCubic);

  // Reveal each byte in sequence.
  yield* sequence(
    0.07,
    ...byteRefs.map(ref =>
      all(
        ref().opacity(1, 0.18),
        chain(
          ref().scale(1.12, 0.16, easeInOutCubic),
          ref().scale(1, 0.06, easeOutCubic),
        ),
      ),
    ),
  );

  yield* waitFor(0.79);

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

  // Reveal both windows at their normal size and full opacity.
  yield* all(
    viewerWindow().opacity(1, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    viewerWindow().scale(1, WINDOW_REVEAL_DURATION, easeOutCubic),

    editorWindow().opacity(1, WINDOW_REVEAL_DURATION * 0.8, easeOutCubic),
    editorWindow().scale(1, WINDOW_REVEAL_DURATION, easeOutCubic),
  );

  // Briefly hold the neutral state before emphasizing either window.
  yield* waitFor(NEUTRAL_WINDOW_HOLD);

  // Focus the image viewer and dim the text editor.
  yield* all(
    viewerWindow().opacity(FOCUSED_OPACITY, SWAP_DURATION, easeInOutCubic),
    viewerWindow().scale(FOCUSED_SCALE, SWAP_DURATION, easeInOutCubic),

    editorWindow().opacity(DIMMED_OPACITY, SWAP_DURATION, easeInOutCubic),
    editorWindow().scale(DIMMED_SCALE, SWAP_DURATION, easeInOutCubic),
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
