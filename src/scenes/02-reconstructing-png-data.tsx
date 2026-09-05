import {Circle, Line, Node, Path, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  type Reference,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';


const COLORS = {
  background: '#21232E',
  card: '#343746',
  panel: '#2B2E3B',
  panelDeep: '#242733',
  titlebar: '#1B1D26',
  border: '#50566A',
  borderStrong: '#646B82',
  text: '#F4F6FA',
  textMuted: '#AEB5C6',
  titleText: '#C4CBDA',
  mutedBar: '#697187',
  accent: '#8C7CFF',
  accentGlow: 'rgba(140,124,255,0.24)',
  shadow: 'rgba(0,0,0,0.28)',
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

const rawBytes = ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'];
const WINDOW_X = 300;
const WINDOW_Y = 205;
const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 340;
const TITLEBAR_HEIGHT = 42;

function WindowControls() {
  return (
    <Node y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}>
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 26} fill={'#ff5f57'} />
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 48} fill={'#febc2e'} />
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 70} fill={'#28c840'} />
    </Node>
  );
}

interface PreviousSceneStateProps {
  arrowGroupRef: Reference<Node>;
  byteRefs: Reference<Rect>[];
  byteRowRef: Reference<Node>;
  byteTextRefs: Reference<Txt>[];
  windowGroupRef: Reference<Node>;
}

function PreviousSceneState({
  arrowGroupRef,
  byteRefs,
  byteRowRef,
  byteTextRefs,
  windowGroupRef,
}: PreviousSceneStateProps) {
  return (
    <Node>
      <Node ref={byteRowRef} y={-155}>
        {rawBytes.map((byte, index) => (
          <Rect ref={byteRefs[index]} key={`${index}`} width={125} height={100} x={(index - 3.5) * 155} radius={12} fill={COLORS.card} stroke={COLORS.borderStrong} lineWidth={4} shadowColor={COLORS.shadow} shadowBlur={22} shadowOffsetY={10}>
            <Txt ref={byteTextRefs[index]} text={byte} fill={COLORS.text} fontSize={46} fontFamily={'monospace'} fontWeight={700} />
          </Rect>
        ))}
      </Node>
      <Node ref={arrowGroupRef}>
        <Line points={[[0, -92], [0, -66]]} stroke={COLORS.textMuted} lineWidth={5} lineCap={'round'} />
        <Path data={`M 0 -66 C 0 -25, ${-WINDOW_X} -40, ${-WINDOW_X} -5 L ${-WINDOW_X} 22`} stroke={COLORS.textMuted} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />
        <Path data={`M 0 -66 C 0 -25, ${WINDOW_X} -40, ${WINDOW_X} -5 L ${WINDOW_X} 22`} stroke={COLORS.textMuted} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />
      </Node>

      <Node ref={windowGroupRef}>
        <Node x={-WINDOW_X} y={WINDOW_Y}>
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={COLORS.panelDeep} shadowColor={COLORS.shadow} shadowBlur={22} shadowOffsetY={10} clip>
            <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={-149} fill={COLORS.titlebar} />
            <WindowControls />
            <Txt text={'Image Viewer'} x={0} y={-149} fontSize={24} fontFamily={'monospace'} fill={COLORS.titleText} textAlign={'center'} />
            <Node y={21}><PngPreview scale={3.15} /></Node>
          </Rect>
          {/* Border overlay stays outside the clipped shell, keeping all four edges equally thick. */}
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={'rgba(0,0,0,0)'} stroke={COLORS.borderStrong} lineWidth={3} />
        </Node>

        <Node x={WINDOW_X} y={WINDOW_Y}>
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={COLORS.panelDeep} shadowColor={COLORS.shadow} shadowBlur={22} shadowOffsetY={10} clip>
            <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={-149} fill={COLORS.titlebar} />
            <WindowControls />
            <Txt text={'Text Editor'} x={0} y={-149} fontSize={24} fontFamily={'monospace'} fill={COLORS.titleText} textAlign={'center'} />
            <Txt text={'%PNG....IHDR...........sRGB\n....gAMA........IDATx....'} y={-65} width={440} fontSize={30} lineHeight={42} fontFamily={'monospace'} fill={COLORS.code} textAlign={'left'} />
          </Rect>
          {/* Border overlay stays outside the clipped shell, keeping all four edges equally thick. */}
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={'rgba(0,0,0,0)'} stroke={COLORS.borderStrong} lineWidth={3} />
        </Node>
      </Node>
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const arrowGroup = createRef<Node>();
  const byteRow = createRef<Node>();
  const byteRefs = rawBytes.map(() => createRef<Rect>());
  const byteTextRefs = rawBytes.map(() => createRef<Txt>());
  const windowGroup = createRef<Node>();
  const dataOrb = createRef<Circle>();
  const redStamp = createRef<Circle>();
  const greenStamp = createRef<Circle>();
  const blueStamp = createRef<Circle>();
  const positionXAxis = createRef<Line>();
  const positionYAxis = createRef<Line>();
  const positionGuides = createRef<Node>();
  const transparencyGrid = createRef<Node>();

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
      <PreviousSceneState
        arrowGroupRef={arrowGroup}
        byteRefs={byteRefs}
        byteRowRef={byteRow}
        byteTextRefs={byteTextRefs}
        windowGroupRef={windowGroup}
      />

      {/* One evolving data object: color, then position, then transparency. */}
      <Circle ref={redStamp} width={280} height={280} fill={COLORS.card} opacity={0} scale={0.82} zIndex={2} />
      <Circle ref={greenStamp} width={280} height={280} fill={COLORS.card} opacity={0} scale={0.82} />
      <Circle ref={blueStamp} width={280} height={280} fill={COLORS.card} opacity={0} scale={0.82} />
      <Circle ref={dataOrb} width={230} height={230} fill={COLORS.card} stroke={COLORS.borderStrong} lineWidth={3} opacity={0} scale={0.08} zIndex={2} />

      <Node ref={positionGuides} opacity={0}>
        <Line ref={positionXAxis} points={[[-600, 170], [600, 170]]} stroke={COLORS.textMuted} lineWidth={6} lineCap={'round'} endArrow arrowSize={18} end={0} />
        <Line ref={positionYAxis} points={[[0, 350], [0, -330]]} stroke={COLORS.textMuted} lineWidth={6} lineCap={'round'} endArrow arrowSize={18} end={0} />
        <Line points={[[300, -100], [300, 170]]} stroke={COLORS.border} lineWidth={5} lineDash={[13, 10]} />
        <Line points={[[0, -100], [300, -100]]} stroke={COLORS.border} lineWidth={5} lineDash={[13, 10]} />
      </Node>

      <Node ref={transparencyGrid} opacity={0}>
        {Array.from({length: 160}, (_, index) => {
          const column = index % 16;
          const row = Math.floor(index / 16);
          return <Rect key={`${index}`} x={(column - 7.5) * 100} y={(row - 4.5) * 100} width={100} height={100} fill={(column + row) % 2 === 0 ? COLORS.checkerA : COLORS.checkerB} />;
        })}
      </Node>
    </Node>,
  );

  const BASE_DURATION = 4.6;
  const STRETCH_FACTOR = (BASE_DURATION + 22 / 60) / BASE_DURATION;
  const t = (seconds: number) => seconds * STRETCH_FACTOR;
  const RESET_DURATION = t(0.35);

  // Fade only the arrows and windows while returning the existing bytes to center.
  yield* all(
    arrowGroup().opacity(0, t(0.25), easeOutCubic),
    windowGroup().opacity(0, t(0.30), easeOutCubic),
    byteRow().y(0, RESET_DURATION, easeInOutCubic),
  );

  // Give the centered byte row time to breathe.
  yield* waitFor(t(0.92));

  // Collapse the byte tiles into one white data object.
  yield* all(
    ...byteRefs.flatMap(ref => [
      ref().x(0, t(0.45), easeInOutCubic),
      ref().width(230, t(0.45), easeInOutCubic),
      ref().height(230, t(0.45), easeInOutCubic),
      ref().radius(115, t(0.45), easeInOutCubic),
      ref().fill(COLORS.card, t(0.45), easeInOutCubic),
      ref().stroke(COLORS.borderStrong, t(0.45), easeInOutCubic),
    ]),
    ...byteTextRefs.map(ref => ref().opacity(0, t(0.24), easeOutCubic)),
  );
  byteRefs.forEach(ref => ref().opacity(0));
  dataOrb().opacity(1);
  dataOrb().scale(1);

  // Split the white data object into an RGB triangle.
  yield* all(
    dataOrb().opacity(0, t(0.18), easeOutCubic),
    redStamp().opacity(1, t(0.12), easeOutCubic),
    redStamp().position([0, -170], t(0.45), easeInOutCubic),
    redStamp().fill(COLORS.redText, t(0.36), easeInOutCubic),
    redStamp().scale(1, t(0.45), easeOutCubic),
    greenStamp().opacity(1, t(0.12), easeOutCubic),
    greenStamp().position([-240, 170], t(0.45), easeInOutCubic),
    greenStamp().fill(COLORS.greenText, t(0.36), easeInOutCubic),
    greenStamp().scale(1, t(0.45), easeOutCubic),
    blueStamp().opacity(1, t(0.12), easeOutCubic),
    blueStamp().position([240, 170], t(0.45), easeInOutCubic),
    blueStamp().fill(COLORS.blueText, t(0.36), easeInOutCubic),
    blueStamp().scale(1, t(0.45), easeOutCubic),
  );
  yield* waitFor(t(0.51));

  // Turn the same object into a point on a coordinate plane.
  positionGuides().opacity(1);
  yield* all(
    greenStamp().opacity(0, t(0.20), easeOutCubic),
    blueStamp().opacity(0, t(0.20), easeOutCubic),
    positionXAxis().end(1, t(0.45), easeInOutCubic),
    positionYAxis().end(1, t(0.45), easeInOutCubic),
    redStamp().position([300, -100], t(0.45), easeInOutCubic),
    redStamp().scale(0.32, t(0.45), easeInOutCubic),
  );
  yield* waitFor(t(0.50));

  // Dissolve the axes into a transparency grid.
  yield* all(
    positionGuides().opacity(0, t(0.25), easeOutCubic),
    transparencyGrid().opacity(1, t(0.45), easeOutCubic),
    redStamp().position([0, 40], t(0.45), easeInOutCubic),
    redStamp().fill(COLORS.blueText, t(0.45), easeInOutCubic),
    redStamp().opacity(0.48, t(0.45), easeInOutCubic),
    redStamp().scale(1.5, t(0.45), easeInOutCubic),
  );

  // Hold the final transparency state.
  yield* waitFor(t(0.52));
});
