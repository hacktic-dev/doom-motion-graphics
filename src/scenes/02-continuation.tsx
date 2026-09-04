import {Circle, Line, Node, Path, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  type Reference,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';

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
          <Rect ref={byteRefs[index]} key={`${index}`} width={125} height={100} x={(index - 3.5) * 155} radius={12} fill={'#eeeeee'} stroke={'#bdbdbd'} lineWidth={4}>
            <Txt ref={byteTextRefs[index]} text={byte} fill={'#2b2b2b'} fontSize={46} fontFamily={'monospace'} fontWeight={700} />
          </Rect>
        ))}
      </Node>
      <Node ref={arrowGroupRef}>
        <Line points={[[0, -92], [0, -66]]} stroke={'#333333'} lineWidth={5} lineCap={'round'} />
        <Path data={`M 0 -66 C 0 -25, ${-WINDOW_X} -40, ${-WINDOW_X} -5 L ${-WINDOW_X} 22`} stroke={'#333333'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />
        <Path data={`M 0 -66 C 0 -25, ${WINDOW_X} -40, ${WINDOW_X} -5 L ${WINDOW_X} 22`} stroke={'#333333'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />
      </Node>

      <Node ref={windowGroupRef}>
        <Node x={-WINDOW_X} y={WINDOW_Y}>
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={'#f2f2f2'} stroke={'#2f2f2f'} lineWidth={3} shadowColor={'rgba(0,0,0,0.22)'} shadowBlur={22} shadowOffsetY={10} clip>
            <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={-149} fill={'#2f3238'} />
            <WindowControls />
            <Txt text={'Image Viewer'} width={308} y={-149} fontSize={24} fontFamily={'Arial'} fontWeight={600} fill={'#ffffff'} textAlign={'left'} />
            <Node y={21}><PngPreview scale={3.15} /></Node>
          </Rect>
        </Node>

        <Node x={WINDOW_X} y={WINDOW_Y}>
          <Rect width={WINDOW_WIDTH} height={WINDOW_HEIGHT} radius={16} fill={'#f2f2f2'} stroke={'#2f2f2f'} lineWidth={3} shadowColor={'rgba(0,0,0,0.22)'} shadowBlur={22} shadowOffsetY={10} clip>
            <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={-149} fill={'#2f3238'} />
            <WindowControls />
            <Txt text={'Text Editor'} width={308} y={-149} fontSize={24} fontFamily={'Arial'} fontWeight={600} fill={'#ffffff'} textAlign={'left'} />
            <Txt text={'%PNG....IHDR...........sRGB\n....gAMA........IDATx....'} y={-65} width={440} fontSize={30} lineHeight={42} fontFamily={'monospace'} fill={'#111111'} textAlign={'left'} />
          </Rect>
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
    <Node scale={1.25}>
      <PreviousSceneState
        arrowGroupRef={arrowGroup}
        byteRefs={byteRefs}
        byteRowRef={byteRow}
        byteTextRefs={byteTextRefs}
        windowGroupRef={windowGroup}
      />

      {/* One evolving data object: color, then position, then transparency. */}
      <Circle ref={redStamp} x={-420} y={50} width={280} height={280} fill={'#ef5350'} opacity={0} />
      <Circle ref={greenStamp} y={50} width={280} height={280} fill={'#66bb6a'} opacity={0} />
      <Circle ref={blueStamp} x={420} y={50} width={280} height={280} fill={'#42a5f5'} opacity={0} />
      <Circle ref={dataOrb} width={280} height={280} fill={'#ef5350'} opacity={0} scale={0.08} zIndex={2} />

      <Node ref={positionGuides} opacity={0}>
        <Line ref={positionXAxis} points={[[-600, 170], [600, 170]]} stroke={'#777777'} lineWidth={6} lineCap={'round'} endArrow arrowSize={18} end={0} />
        <Line ref={positionYAxis} points={[[0, 350], [0, -330]]} stroke={'#777777'} lineWidth={6} lineCap={'round'} endArrow arrowSize={18} end={0} />
        <Line points={[[300, -100], [300, 170]]} stroke={'#b5b5b5'} lineWidth={5} lineDash={[13, 10]} />
        <Line points={[[0, -100], [300, -100]]} stroke={'#b5b5b5'} lineWidth={5} lineDash={[13, 10]} />
      </Node>

      <Node ref={transparencyGrid} y={40} opacity={0}>
        {Array.from({length: 60}, (_, index) => {
          const column = index % 10;
          const row = Math.floor(index / 10);
          return <Rect key={`${index}`} x={(column - 4.5) * 100} y={(row - 2.5) * 100} width={100} height={100} fill={(column + row) % 2 === 0 ? '#d8d8d8' : '#ffffff'} />;
        })}
      </Node>
    </Node>,
  );

  const RESET_DURATION = 0.35;

  // Fade only the arrows and windows while returning the existing bytes to center.
  yield* all(
    arrowGroup().opacity(0, 0.25, easeOutCubic),
    windowGroup().opacity(0, 0.30, easeOutCubic),
    byteRow().y(0, RESET_DURATION, easeInOutCubic),
  );

  // 0.35–1.27: give the centered byte row time to breathe.
  yield* waitFor(0.92);

  // 1.27–1.72: collapse the byte tiles into one red data object.
  yield* all(
    ...byteRefs.flatMap(ref => [
      ref().x(0, 0.45, easeInOutCubic),
      ref().width(280, 0.45, easeInOutCubic),
      ref().height(280, 0.45, easeInOutCubic),
      ref().radius(140, 0.45, easeInOutCubic),
      ref().fill('#ef5350', 0.45, easeInOutCubic),
      ref().stroke('#ef5350', 0.45, easeInOutCubic),
    ]),
    ...byteTextRefs.map(ref => ref().opacity(0, 0.24, easeOutCubic)),
  );
  byteRefs.forEach(ref => ref().opacity(0));
  dataOrb().opacity(1);
  dataOrb().scale(1);

  // 1.72–2.68: sweep continuously across the frame, stamping each color.
  yield* all(dataOrb().x(-420, 0.18, easeInOutCubic), dataOrb().y(50, 0.18, easeInOutCubic));
  redStamp().opacity(1);
  yield* all(
    dataOrb().x(420, 0.66, easeInOutCubic),
    chain(
      dataOrb().fill('#66bb6a', 0.33, easeInOutCubic),
      dataOrb().fill('#42a5f5', 0.33, easeInOutCubic),
    ),
    chain(
      waitFor(0.33),
      greenStamp().opacity(1, 0),
    ),
  );
  blueStamp().opacity(1);
  yield* waitFor(0.12);

  // 2.68–3.13: turn the same object into a point on a coordinate plane.
  positionGuides().opacity(1);
  yield* all(
    redStamp().opacity(0, 0.20, easeOutCubic),
    greenStamp().opacity(0, 0.20, easeOutCubic),
    blueStamp().opacity(0, 0.20, easeOutCubic),
    positionXAxis().end(1, 0.45, easeInOutCubic),
    positionYAxis().end(1, 0.45, easeInOutCubic),
    dataOrb().position([300, -100], 0.45, easeInOutCubic),
    dataOrb().fill('#ef5350', 0.45, easeInOutCubic),
    dataOrb().scale(0.32, 0.45, easeInOutCubic),
  );
  yield* waitFor(0.50);

  // 3.63–4.08: dissolve the axes into a transparency grid.
  yield* all(
    positionGuides().opacity(0, 0.25, easeOutCubic),
    transparencyGrid().opacity(1, 0.45, easeOutCubic),
    dataOrb().position([0, 40], 0.45, easeInOutCubic),
    dataOrb().fill('#42a5f5', 0.45, easeInOutCubic),
    dataOrb().opacity(0.48, 0.45, easeInOutCubic),
    dataOrb().scale(1.5, 0.45, easeInOutCubic),
  );

  // Hold the final transparency state.
  yield* waitFor(0.52);
});
