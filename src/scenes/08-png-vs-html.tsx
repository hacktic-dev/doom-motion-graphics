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
  tween,
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';
import {Scene4Landscape as Scene7Landscape} from './07-png-metadata';

const COLORS = {
  background: '#21232E',
  card: '#2C2F3B',
  cardDark: '#3F4558',
  titlebar: '#1B1D26',
  border: '#69708D',
  borderStrong: '#646B82',
  text: '#F4F6FA',
  titleText: '#C4CBDA',
  shadow: 'rgba(0,0,0,0.24)',

  paper: '#F4EEE4',
  orange: '#F09A57',
  purple: '#8C7CFF',
  purpleSoft: '#A996FF',
  purpleGlow: 'rgba(140,124,255,0.20)',

  sky: '#D5E8F3',
  sun: '#F0C348',
  cloud: '#F7F7F7',
  mountain1: '#86A6CD',
  mountain2: '#4E78A8',
  mountain3: '#658DBA',
  mountain4: '#355C8C',
  grass: '#6B9A5D',
  water: '#72ADD0',
  tree1: '#2D6A5B',
  tree2: '#397A63',
};

const PHOTO_START_SCALE = 1.248;
// Scene 8 originally played in roughly 10.76 seconds.  The narrative beats
// outside the canonical Scene 4 click are stretched uniformly to make the
// complete scene exactly 14 seconds while preserving that click verbatim.
const pace = (seconds: number) => seconds * 1.3436;

const VIEWER_WIDTH = 1204;
const VIEWER_HEIGHT = 842;
const TITLEBAR_HEIGHT = 58;
const TITLEBAR_Y = -VIEWER_HEIGHT / 2 + TITLEBAR_HEIGHT / 2;
const VIEWER_CONTENT_Y = 29;

function Scene4Landscape() {
  return (
    <Node>
      <Rect width={720} height={480} fill={COLORS.sky} radius={18} />

      <Circle x={260} y={-160} width={66} height={66} fill={COLORS.sun} />

      <Node x={-160} y={-130} opacity={0.9}>
        <Circle width={34} height={34} x={-18} fill={COLORS.cloud} />
        <Circle width={42} height={42} x={12} fill={COLORS.cloud} />
        <Circle width={34} height={34} x={38} fill={COLORS.cloud} />
        <Rect width={92} height={24} y={10} radius={12} fill={COLORS.cloud} />
      </Node>

      <Node x={120} y={-120} opacity={0.9}>
        <Circle width={30} height={30} x={-15} fill={COLORS.cloud} />
        <Circle width={40} height={40} x={10} fill={COLORS.cloud} />
        <Circle width={28} height={28} x={34} fill={COLORS.cloud} />
        <Rect width={76} height={20} y={9} radius={10} fill={COLORS.cloud} />
      </Node>

      <Line
        points={[
          [-360, 120],
          [-240, 30],
          [-150, 90],
          [-40, 10],
          [80, 105],
          [200, 25],
          [360, 120],
        ]}
        closed
        fill={COLORS.mountain1}
      />

      <Line
        points={[
          [-360, 150],
          [-290, 95],
          [-220, 132],
          [-140, 60],
          [-40, 150],
        ]}
        closed
        fill={COLORS.mountain2}
      />

      <Line
        points={[
          [-70, 150],
          [55, 78],
          [170, 150],
        ]}
        closed
        fill={COLORS.mountain4}
      />

      <Line
        points={[
          [80, 150],
          [190, 52],
          [295, 150],
        ]}
        closed
        fill={COLORS.mountain3}
      />

      <Line
        points={[
          [230, 150],
          [318, 86],
          [390, 150],
        ]}
        closed
        fill={COLORS.mountain1}
      />

      <Rect y={125} width={720} height={110} fill={COLORS.water} />

      <Line
        points={[
          [-360, 240],
          [-360, 125],
          [-155, 146],
          [-40, 188],
          [0, 240],
        ]}
        closed
        fill={COLORS.grass}
      />

      <Line
        points={[
          [360, 240],
          [360, 125],
          [165, 147],
          [45, 190],
          [0, 240],
        ]}
        closed
        fill={COLORS.grass}
      />

      <Line
        points={[
          [-78, 240],
          [0, 132],
          [78, 240],
        ]}
        closed
        fill={COLORS.water}
      />

      {[
        [-300, 150],
        [-255, 138],
        [-205, 160],
        [-155, 145],
        [150, 150],
        [205, 132],
        [260, 158],
        [310, 142],
      ].map(([x, y], i) => (
        <Node key={`tree-${i}`} x={x} y={y}>
          <Line
            points={[
              [0, -40],
              [-28, 20],
              [28, 20],
            ]}
            closed
            fill={i % 2 === 0 ? COLORS.tree1 : COLORS.tree2}
          />
          <Line
            points={[
              [0, -70],
              [-24, -10],
              [24, -10],
            ]}
            closed
            fill={i % 2 === 0 ? COLORS.tree2 : COLORS.tree1}
          />
        </Node>
      ))}
    </Node>
  );
}

function HtmlTag() {
  return (
    <Node y={2}>
      <Line
        points={[[-28, -8], [-48, 11], [-28, 30]]}
        stroke={COLORS.purple}
        lineWidth={9}
        lineCap={'round'}
        lineJoin={'round'}
      />
      <Line
        points={[[8, -8], [-8, 30]]}
        stroke={COLORS.purple}
        lineWidth={9}
        lineCap={'round'}
      />
      <Line
        points={[[28, -8], [48, 11], [28, 30]]}
        stroke={COLORS.purple}
        lineWidth={9}
        lineCap={'round'}
        lineJoin={'round'}
      />
    </Node>
  );
}

function FileShape({kind}: {kind: 'html' | 'png'}) {
  return (
    <Node>
      <Line
        points={[
          [-92, -115],
          [42, -115],
          [94, -63],
          [94, 115],
          [-92, 115],
        ]}
        closed
        fill={COLORS.cardDark}
        stroke={COLORS.borderStrong}
        lineWidth={5}
        radius={15}
        shadowColor={COLORS.shadow}
        shadowBlur={22}
        shadowOffsetY={10}
      />

      <Line
        points={[[42, -115], [42, -63], [94, -63]]}
        stroke={COLORS.borderStrong}
        lineWidth={5}
      />

      <Line
        points={[[42, -115], [94, -63]]}
        stroke={COLORS.borderStrong}
        lineWidth={5}
      />

      {kind === 'html' ? (
        <Node y={8} scale={1.15}>
          <HtmlTag />
        </Node>
      ) : (
        <Node y={18} scale={1.24}>
          <PngPreview />
        </Node>
      )}
    </Node>
  );
}

function PngFile() {
  return (
    <Node>
      <FileShape kind={'png'} />
      <Txt
        text={'image.png'}
        y={160}
        fill={COLORS.text}
        fontFamily={'Arial'}
        fontSize={35}
        fontWeight={600}
        textAlign={'center'}
      />
    </Node>
  );
}

function DoomHtmlFile() {
  return (
    <Node>
      <FileShape kind={'html'} />
      <Txt
        text={'doom.html'}
        y={160}
        fill={COLORS.text}
        fontFamily={'Arial'}
        fontSize={35}
        fontWeight={600}
        textAlign={'center'}
      />
    </Node>
  );
}

function ChunkCard() {
  return (
    <Rect
      width={310}
      height={260}
      radius={32}
      fill={COLORS.cardDark}
      stroke={COLORS.border}
      lineWidth={4}
      shadowColor={COLORS.shadow}
      shadowBlur={18}
      shadowOffsetY={10}
    >
      <Rect
        width={100}
        height={34}
        radius={15}
        y={-98}
        fill={COLORS.orange}
      />
      <Txt
        text={'tEXt'}
        y={-98}
        fill={COLORS.background}
        fontFamily={'monospace'}
        fontWeight={700}
        fontSize={24}
      />
    </Rect>
  );
}

function PurpleStrip({width}: {width: number}) {
  return (
    <Rect
      width={width}
      height={24}
      radius={12}
      fill={COLORS.purple}
      shadowColor={COLORS.purpleGlow}
      shadowBlur={12}
      shadowOffsetY={5}
    >
      <Rect x={-width / 2 + 16} width={16} height={8} radius={4} fill={'rgba(255,255,255,0.23)'} />
      <Rect x={-width / 2 + 40} width={40} height={8} radius={4} fill={'rgba(255,255,255,0.18)'} />
      <Rect x={-width / 2 + 88} width={30} height={8} radius={4} fill={'rgba(255,255,255,0.16)'} />
    </Rect>
  );
}

function MouseCursor() {
  return (
    <Node>
      <Path
        data={'M 2 2 L 2 48 L 13 37 L 22 59 L 33 54 L 24 34 L 42 34 Z'}
        fill={'#ffffff'}
        stroke={'#111217'}
        lineWidth={2.8}
        lineJoin={'round'}
        shadowColor={'rgba(0,0,0,0.25)'}
        shadowBlur={8}
        shadowOffsetY={4}
      />
    </Node>
  );
}

function ImageViewer() {
  return (
    <Node scale={1.25}>
      <Rect
        width={VIEWER_WIDTH}
        height={VIEWER_HEIGHT}
        radius={20}
        fill={COLORS.card}
        shadowColor={COLORS.shadow}
        shadowBlur={28}
        shadowOffsetY={12}
        clip
      >
        <Rect
          width={VIEWER_WIDTH}
          height={TITLEBAR_HEIGHT}
          y={TITLEBAR_Y}
          fill={COLORS.titlebar}
        />

        <Circle width={15} height={15} x={-VIEWER_WIDTH / 2 + 32} y={TITLEBAR_Y} fill={'#ff5f57'} />
        <Circle width={15} height={15} x={-VIEWER_WIDTH / 2 + 58} y={TITLEBAR_Y} fill={'#febc2e'} />
        <Circle width={15} height={15} x={-VIEWER_WIDTH / 2 + 84} y={TITLEBAR_Y} fill={'#28c840'} />
        <Rect width={820} height={36} y={TITLEBAR_Y} radius={9} fill={'#2B2E3B'} />

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
          width={1140}
          height={720}
          y={VIEWER_CONTENT_Y}
          radius={12}
          fill={'rgba(0,0,0,0)'}
          clip
        >
          <Node scale={1.5}>
            <Scene7Landscape />
          </Node>
        </Rect>
      </Rect>

      <Rect
        width={VIEWER_WIDTH}
        height={VIEWER_HEIGHT}
        radius={20}
        fill={'rgba(0,0,0,0)'}
        stroke={COLORS.borderStrong}
        lineWidth={3}
      />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const photo = createRef<Node>();
  const pngFile = createRef<Node>();
  const doomFile = createRef<Node>();
  const textChunk = createRef<Node>();

  const stripA = createRef<Node>();
  const stripB = createRef<Node>();
  const stripC = createRef<Node>();
  const stripD = createRef<Node>();

  const cursor = createRef<Node>();
  const clickRingA = createRef<Circle>();
  const clickRingB = createRef<Circle>();
  const viewer = createRef<Node>();

  const ghostA = createRef<Node>();
  const ghostB = createRef<Node>();
  const ghostC = createRef<Node>();
  const ghostD = createRef<Node>();

  view.add(
    <Rect width={'100%'} height={'100%'} fill={COLORS.background} zIndex={-100} />,
  );

  view.add(
    <Node>
      <Node ref={photo} x={0} y={18} scale={PHOTO_START_SCALE} zIndex={10}>
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
          width={720}
          height={480}
          y={-18}
          radius={12}
          fill={'rgba(0,0,0,0)'}
          clip
        >
          <Scene7Landscape />
        </Rect>
      </Node>

      <Node ref={pngFile} x={0} y={-8} scale={1.18} opacity={0} zIndex={12}>
        <PngFile />
      </Node>

      <Node ref={doomFile} x={-620} y={-8} scale={1.12} opacity={0} zIndex={11}>
        <DoomHtmlFile />
      </Node>

      <Node ref={textChunk} x={0} y={-10} scale={1.28} opacity={0} zIndex={11}>
        <ChunkCard />
      </Node>

      <Node ref={stripA} x={-500} y={-72} opacity={0} zIndex={11}>
        <PurpleStrip width={170} />
      </Node>
      <Node ref={stripB} x={-500} y={-30} opacity={0} zIndex={11}>
        <PurpleStrip width={216} />
      </Node>
      <Node ref={stripC} x={-500} y={12} opacity={0} zIndex={11}>
        <PurpleStrip width={152} />
      </Node>
      <Node ref={stripD} x={-500} y={54} opacity={0} zIndex={11}>
        <PurpleStrip width={194} />
      </Node>

      <Node ref={cursor} x={590} y={230} opacity={0} scale={0.82} zIndex={20}>
        <MouseCursor />
      </Node>

      <Circle
        ref={clickRingA}
        x={500}
        y={-10}
        width={18}
        height={18}
        stroke={COLORS.purpleSoft}
        lineWidth={3}
        opacity={0}
        scale={0.2}
        zIndex={19}
      />
      <Circle
        ref={clickRingB}
        x={500}
        y={-10}
        width={18}
        height={18}
        stroke={'rgba(169,150,255,0.72)'}
        lineWidth={3}
        opacity={0}
        scale={0.2}
        zIndex={19}
      />

      <Node ref={viewer} x={0} y={0} opacity={0} scale={0.94} zIndex={9}>
        <ImageViewer />
      </Node>

      <Node ref={ghostA} x={-650} y={-205} opacity={0} rotation={-7} zIndex={15}>
        <PurpleStrip width={285} />
      </Node>
      <Node ref={ghostB} x={650} y={-190} opacity={0} rotation={6} zIndex={15}>
        <PurpleStrip width={285} />
      </Node>
      <Node ref={ghostC} x={-660} y={210} opacity={0} rotation={5} zIndex={15}>
        <PurpleStrip width={285} />
      </Node>
      <Node ref={ghostD} x={660} y={225} opacity={0} rotation={-5} zIndex={15}>
        <PurpleStrip width={285} />
      </Node>
    </Node>,
  );

  yield* waitFor(pace(0.45));

  // Replace the Scene 7 photo with the file it represents.  Both objects keep
  // a stable apparent size; opacity carries the transition.
  yield* all(
    photo().opacity(0, pace(0.68), easeInCubic),
    pngFile().opacity(1, pace(0.48), easeOutCubic),
  );
  yield* waitFor(pace(0.55));

  // Make a clear two-object composition: HTML on the left, PNG on the right.
  yield* all(
    pngFile().x(500, pace(0.58), easeInOutCubic),
    doomFile().opacity(1, pace(0.38), easeOutCubic),
    doomFile().x(-500, pace(0.58), easeInOutCubic),
  );

  yield* waitFor(pace(0.20));

  // Reveal the code that was already inside doom.html directly over the file
  // while its shell fades away.
  yield* all(
    doomFile().opacity(0, pace(0.42), easeInCubic),
    stripA().opacity(1, pace(0.26), easeOutCubic),
    stripB().opacity(1, pace(0.28), easeOutCubic),
    stripC().opacity(1, pace(0.30), easeOutCubic),
    stripD().opacity(1, pace(0.32), easeOutCubic),
  );

  yield* all(
    textChunk().opacity(1, pace(0.28), easeOutCubic),
  );

  yield* waitFor(pace(0.15));

  // Each strip travels directly into its matching slot in the chunk card.
  yield* sequence(
    pace(0.07),
    stripA().position([0, -58], pace(0.56), easeInOutCubic),
    stripB().position([0, -18], pace(0.56), easeInOutCubic),
    stripC().position([0, 22], pace(0.56), easeInOutCubic),
    stripD().position([0, 62], pace(0.56), easeInOutCubic),
  );

  yield* waitFor(pace(0.38));

  // The filled chunk physically shrinks into image.png.  Its four contents
  // remain visible throughout the journey and disappear only on impact.
  yield* all(
    textChunk().position([500, -8], pace(0.72), easeInOutCubic),
    textChunk().scale(0.20, pace(0.72), easeOutCubic),
    stripA().x(500, pace(0.72), easeInOutCubic),
    stripA().y(-17.6, pace(0.72), easeOutCubic),
    stripA().scale(0.20, pace(0.72), easeOutCubic),
    stripB().x(500, pace(0.72), easeInOutCubic),
    stripB().y(-9.6, pace(0.72), easeOutCubic),
    stripB().scale(0.20, pace(0.72), easeOutCubic),
    stripC().x(500, pace(0.72), easeInOutCubic),
    stripC().y(-1.6, pace(0.72), easeOutCubic),
    stripC().scale(0.20, pace(0.72), easeOutCubic),
    stripD().x(500, pace(0.72), easeInOutCubic),
    stripD().y(6.4, pace(0.72), easeOutCubic),
    stripD().scale(0.20, pace(0.72), easeOutCubic),
  );

  yield* all(
    textChunk().opacity(0, pace(0.10), easeInCubic),
    stripA().opacity(0, pace(0.10), easeInCubic),
    stripB().opacity(0, pace(0.10), easeInCubic),
    stripC().opacity(0, pace(0.10), easeInCubic),
    stripD().opacity(0, pace(0.10), easeInCubic),
    chain(
      pngFile().scale(1.27, pace(0.14), easeOutCubic),
      pngFile().scale(1.18, pace(0.18), easeInOutCubic),
    ),
  );
  yield* waitFor(pace(0.82));

  // Use the same recognisable cursor shape as Scene 4 and click the file
  // without making the file itself pulse or resize.
  yield* all(
    cursor().opacity(1, 0.18, easeOutCubic),
    cursor().position([498, -12], 0.42, easeInOutCubic),
  );
  yield* waitFor(0.08);

  clickRingA().opacity(1);
  clickRingB().opacity(1);

  // Exact Scene 4 click choreography, adjusted only for this file's base scale.
  yield* all(
    cursor().scale(0.70, 0.07, easeInCubic),
    cursor().y(-8, 0.07, easeInCubic),
    pngFile().scale(1.162, 0.07, easeInCubic),
    clickRingA().scale(2.6, 0.26, easeOutCubic),
    clickRingA().opacity(0, 0.20, easeOutCubic),
    chain(
      waitFor(0.03),
      all(
        clickRingB().scale(3.5, 0.22, easeOutCubic),
        clickRingB().opacity(0, 0.22, easeOutCubic),
      ),
    ),
  );
  yield* all(
    cursor().scale(0.78, 0.08, easeOutCubic),
    cursor().y(-12, 0.06, easeOutCubic),
    pngFile().scale(1.18, 0.06, easeOutCubic),
  );
  yield* waitFor(0.04);

  yield* all(
    cursor().opacity(0, 0.12, easeInCubic),
    pngFile().opacity(0, 0.28, easeInCubic),
    pngFile().scale(0.897, 0.38, easeInCubic),
    viewer().opacity(1, 0.28, easeOutCubic),
    viewer().scale(1, 0.45, easeOutCubic),
  );

  // The four code fragments drift independently around the viewer. Their
  // paths are slow, shallow arcs rather than synchronized mechanical hops.
  const ghostDuration = pace(2.91);
  const ghostBases = [
    {node: ghostA, x: -650, y: -205, rotation: -7, phase: 0.15, direction: 1},
    {node: ghostB, x: 650, y: -190, rotation: 6, phase: 1.70, direction: -1},
    {node: ghostC, x: -660, y: 210, rotation: 5, phase: 3.10, direction: -1},
    {node: ghostD, x: 660, y: 225, rotation: -5, phase: 4.55, direction: 1},
  ];

  // Fade and float concurrently.  Every wave is offset back to zero at the
  // first frame, so procedural motion begins without a positional jump.
  yield* all(
    sequence(
      pace(0.10),
      ghostA().opacity(0.58, pace(0.30), easeOutCubic),
      ghostB().opacity(0.54, pace(0.30), easeOutCubic),
      ghostC().opacity(0.52, pace(0.30), easeOutCubic),
      ghostD().opacity(0.56, pace(0.30), easeOutCubic),
    ),
    tween(ghostDuration, value => {
      const time = value * Math.PI * 2.15;

      for (const {node: ref, x, y, rotation, phase, direction} of ghostBases) {
        const wave = time + phase;
        const secondary = time * 0.43 + phase * 1.8;
        const startSecondary = phase * 1.8;
        const jelly =
          (Math.sin(time * 0.82 + phase) - Math.sin(phase)) * 0.012;

        ref().position([
          x + direction * (
            (Math.sin(wave) - Math.sin(phase)) * 22 +
            (Math.sin(secondary) - Math.sin(startSecondary)) * 7
          ),
          y +
            (Math.cos(wave * 0.68) - Math.cos(phase * 0.68)) * 5 +
            (Math.sin(secondary) - Math.sin(startSecondary)) * 1.5,
        ]);
        ref().rotation(
          rotation +
            (Math.sin(wave * 0.42) - Math.sin(phase * 0.42)) * 4.5 +
            (Math.cos(secondary) - Math.cos(startSecondary)) * 1.5,
        );
        ref().scale([1 + jelly, 1 - jelly]);
      }
    }),
  );

  yield* waitFor(pace(0.20));
});
