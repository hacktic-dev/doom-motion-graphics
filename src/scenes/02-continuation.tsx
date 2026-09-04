import {Circle, Line, Node, Path, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';

const rawBytes = ['89', '50', '4E', '47', '0D', '0A', '1A', '0A'];
const WINDOW_X = 300;
const WINDOW_Y = 205;
const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 340;
const TITLEBAR_HEIGHT = 42;

function PngFile() {
  return (
    <Node>
      <Node y={-35}>
        <Line
          points={[[-75, -90], [35, -90], [75, -50], [75, 90], [-75, 90]]}
          closed
          fill={'#ffffff'}
          stroke={'#c8c8c8'}
          lineWidth={4}
          radius={12}
        />
        <Line points={[[35, -90], [35, -50], [75, -50]]} stroke={'#c8c8c8'} lineWidth={4} />
        <Line points={[[35, -90], [75, -50]]} stroke={'#c8c8c8'} lineWidth={4} />
        <Node y={20}><PngPreview /></Node>
      </Node>
      <Txt text={'image.png'} fill={'#2b2b2b'} fontSize={34} fontFamily={'Arial'} fontWeight={500} y={85} />
    </Node>
  );
}

function WindowControls() {
  return (
    <Node y={-(WINDOW_HEIGHT / 2) + TITLEBAR_HEIGHT / 2}>
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 26} fill={'#ff5f57'} />
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 48} fill={'#febc2e'} />
      <Circle width={13} height={13} x={-(WINDOW_WIDTH / 2) + 70} fill={'#28c840'} />
    </Node>
  );
}

function PreviousSceneState() {
  return (
    <Node>
      <Node y={-155}>
        {rawBytes.map((byte, index) => (
          <Rect key={`${index}`} width={125} height={100} x={(index - 3.5) * 155} radius={12} fill={'#eeeeee'} stroke={'#bdbdbd'} lineWidth={4}>
            <Txt text={byte} fill={'#2b2b2b'} fontSize={46} fontFamily={'monospace'} fontWeight={700} />
          </Rect>
        ))}
      </Node>
      <Line points={[[0, -92], [0, -66]]} stroke={'#333333'} lineWidth={5} lineCap={'round'} />
      <Path data={`M 0 -66 C 0 -25, ${-WINDOW_X} -40, ${-WINDOW_X} -5 L ${-WINDOW_X} 22`} stroke={'#333333'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />
      <Path data={`M 0 -66 C 0 -25, ${WINDOW_X} -40, ${WINDOW_X} -5 L ${WINDOW_X} 22`} stroke={'#333333'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} />

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
  );
}

function ImageDataPanel() {
  const cardXs = [-260, 0, 260];
  return (
    <Rect width={850} height={240} radius={18} fill={'#f7f7f7'} stroke={'#bdbdbd'} lineWidth={3} shadowColor={'rgba(0,0,0,0.18)'} shadowBlur={18} shadowOffsetY={8}>
      <Txt text={'PNG Image Data'} y={-91} fontSize={26} fontFamily={'Arial'} fontWeight={700} fill={'#2b2b2b'} />
      {cardXs.map((x, index) => (
        <Rect key={`${index}`} x={x} y={24} width={230} height={150} radius={12} fill={'#ffffff'} stroke={'#d0d0d0'} lineWidth={2} />
      ))}

      <Node x={cardXs[0]} y={10}>
        <Circle x={-48} width={48} height={48} fill={'#ef5350'} />
        <Circle width={48} height={48} fill={'#66bb6a'} />
        <Circle x={48} width={48} height={48} fill={'#42a5f5'} />
        <Txt text={'COLOR'} y={59} fontSize={20} fontFamily={'monospace'} fontWeight={700} fill={'#333333'} />
      </Node>

      <Node x={cardXs[1]} y={4}>
        <Line points={[[-58, 34], [-58, -40]]} stroke={'#777777'} lineWidth={3} endArrow arrowSize={10} />
        <Line points={[[-58, 34], [58, 34]]} stroke={'#777777'} lineWidth={3} endArrow arrowSize={10} />
        <Circle x={23} y={-15} width={20} height={20} fill={'#ef5350'} />
        <Line points={[[23, -5], [23, 34]]} stroke={'#bbbbbb'} lineWidth={2} lineDash={[6, 5]} />
        <Line points={[[-58, -15], [13, -15]]} stroke={'#bbbbbb'} lineWidth={2} lineDash={[6, 5]} />
        <Txt text={'POSITION'} y={65} fontSize={20} fontFamily={'monospace'} fontWeight={700} fill={'#333333'} />
      </Node>

      <Node x={cardXs[2]} y={-2}>
        {Array.from({length: 16}, (_, index) => {
          const column = index % 4;
          const row = Math.floor(index / 4);
          return <Rect key={`${index}`} x={(column - 1.5) * 22} y={(row - 1.5) * 22} width={22} height={22} fill={(column + row) % 2 === 0 ? '#dedede' : '#ffffff'} />;
        })}
        <Circle width={62} height={62} fill={'rgba(66,165,245,0.48)'} />
        <Txt text={'TRANSPARENCY'} y={72} fontSize={18} fontFamily={'monospace'} fontWeight={700} fill={'#333333'} />
      </Node>
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  const previousScene = createRef<Node>();
  const file = createRef<Node>();
  const fileToBytes = createRef<Line>();
  const byteRefs = rawBytes.map(() => createRef<Rect>());
  const bytesToData = createRef<Line>();
  const dataPanel = createRef<Node>();

  view.add(
    <Node scale={1.25}>
      <Node ref={previousScene}><PreviousSceneState /></Node>
      <Node ref={file} opacity={0} scale={0.08}><PngFile /></Node>

      <Line ref={fileToBytes} points={[[0, -160], [0, -105]]} stroke={'#555555'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} end={0} opacity={0} />

      <Node y={-45}>
        {rawBytes.map((byte, index) => (
          <Rect ref={byteRefs[index]} key={`${index}`} width={125} height={100} x={(index - 3.5) * 155} radius={12} fill={'#eeeeee'} stroke={'#bdbdbd'} lineWidth={4} opacity={0} scale={0.08}>
            <Txt text={byte} fill={'#2b2b2b'} fontSize={46} fontFamily={'monospace'} fontWeight={700} />
          </Rect>
        ))}
      </Node>

      <Line ref={bytesToData} points={[[0, 12], [0, 99]]} stroke={'#555555'} lineWidth={5} lineCap={'round'} endArrow arrowSize={14} end={0} opacity={0} />
      <Node ref={dataPanel} y={230} opacity={0} scale={0.92}><ImageDataPanel /></Node>
    </Node>,
  );

  // 0.00–0.35: clear the inherited diagram as one completed thought.
  yield* all(previousScene().opacity(0, 0.35, easeOutCubic), previousScene().scale(1.05, 0.35, easeOutCubic));

  // 0.35–0.60: introduce the PNG file again.
  yield* all(
    file().opacity(1, 0.20),
    chain(file().scale(1.1, 0.19, easeInOutCubic), file().scale(1, 0.06, easeOutCubic)),
  );
  yield* waitFor(0.25);

  // 0.85–1.33: move the file up and connect it to its bytes.
  yield* file().y(-255, 0.30, easeInOutCubic);
  fileToBytes().opacity(1);
  yield* fileToBytes().end(1, 0.18, easeInOutCubic);

  // 1.33–2.04: reveal the bytes one by one.
  yield* sequence(
    0.07,
    ...byteRefs.map(ref => all(
      ref().opacity(1, 0.18),
      chain(ref().scale(1.12, 0.16, easeInOutCubic), ref().scale(1, 0.06, easeOutCubic)),
    )),
  );

  // 2.04–2.24: connect the bytes to their image information.
  bytesToData().opacity(1);
  yield* bytesToData().end(1, 0.20, easeInOutCubic);

  // 2.24–2.64: reveal color, position, and transparency data together.
  yield* all(dataPanel().opacity(1, 0.32, easeOutCubic), dataPanel().scale(1, 0.40, easeOutCubic));

  // Hold through the end of the approximately 4.6-second narration line.
  yield* waitFor(1.96);
});
