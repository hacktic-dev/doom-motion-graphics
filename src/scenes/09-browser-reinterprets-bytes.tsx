import {
  Circle,
  Img,
  Line,
  Node,
  Path,
  Rect,
  Txt,
  Video,
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

import gameplayVideo from '../img/gameplay.mp4';
import doomguyImage from '../img/doomguy.png';
import {Scene4Landscape} from './07-png-metadata';

const COLORS = {
  background: '#21232E',
  card: '#2C2F3B',
  titlebar: '#1B1D26',
  border: '#646B82',
  titleText: '#C4CBDA',
  text: '#F4F6FA',
  purple: '#8C7CFF',
  purpleSoft: '#A996FF',
  shadow: 'rgba(0,0,0,0.24)',
};

const WINDOW_WIDTH = 1204;
const WINDOW_HEIGHT = 842;
const TITLEBAR_HEIGHT = 58;
const TITLEBAR_Y = -WINDOW_HEIGHT / 2 + TITLEBAR_HEIGHT / 2;
const CONTENT_WIDTH = 1140;
const CONTENT_HEIGHT = 720;
const CONTENT_Y = 29;

function HtmlTag() {
  return (
    <Node>
      <Line
        points={[[-34, -25], [-62, 0], [-34, 25]]}
        stroke={COLORS.purple}
        lineWidth={12}
        lineCap={'round'}
        lineJoin={'round'}
      />
      <Line
        points={[[13, -27], [-13, 27]]}
        stroke={COLORS.purple}
        lineWidth={12}
        lineCap={'round'}
      />
      <Line
        points={[[34, -25], [62, 0], [34, 25]]}
        stroke={COLORS.purple}
        lineWidth={12}
        lineCap={'round'}
        lineJoin={'round'}
      />
    </Node>
  );
}

function PurpleStrip({width}: {width: number}) {
  return (
    <Rect
      width={width}
      height={24}
      radius={12}
      fill={COLORS.purple}
      shadowColor={'rgba(140,124,255,0.20)'}
      shadowBlur={12}
      shadowOffsetY={5}
    >
      <Rect x={-width / 2 + 22} width={20} height={8} radius={4} fill={'rgba(255,255,255,0.23)'} />
      <Rect x={-width / 2 + 52} width={42} height={8} radius={4} fill={'rgba(255,255,255,0.17)'} />
      <Rect x={-width / 2 + 98} width={28} height={8} radius={4} fill={'rgba(255,255,255,0.15)'} />
    </Rect>
  );
}

function FinalFile() {
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
        fill={'#3F4558'}
        stroke={COLORS.border}
        lineWidth={5}
        radius={15}
        shadowColor={COLORS.shadow}
        shadowBlur={22}
        shadowOffsetY={10}
      />
      <Line points={[[42, -115], [42, -63], [94, -63]]} stroke={COLORS.border} lineWidth={5} />
      <Line points={[[42, -115], [94, -63]]} stroke={COLORS.border} lineWidth={5} />
      <Img
        src={doomguyImage}
        width={148}
        height={148}
        y={8}
        smoothing={false}
      />
      <Txt
        text={'doom.png'}
        y={160}
        fill={COLORS.text}
        fontFamily={'Arial'}
        fontSize={35}
        fontWeight={600}
      />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const window = createRef<Node>();
  const programBackdrop = createRef<Rect>();
  const imageLayer = createRef<Node>();
  const htmlLayer = createRef<Node>();
  const gameplay = createRef<Video>();
  const imageTitle = createRef<Txt>();
  const htmlTitle = createRef<Txt>();
  const htmlTag = createRef<Node>();
  const playButton = createRef<Node>();
  const loadingFill = createRef<Rect>();
  const finalFile = createRef<Node>();
  const ghostRefs = Array.from({length: 4}, () => createRef<Node>());

  view.add(<Rect width={'100%'} height={'100%'} fill={COLORS.background} />);

  view.add(
    <Node>
      <Node ref={window} scale={1.25}>
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={20}
          fill={COLORS.card}
          shadowColor={COLORS.shadow}
          shadowBlur={28}
          shadowOffsetY={12}
          clip
        >
          <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={TITLEBAR_Y} fill={COLORS.titlebar} />
          <Circle width={15} height={15} x={-WINDOW_WIDTH / 2 + 32} y={TITLEBAR_Y} fill={'#ff5f57'} />
          <Circle width={15} height={15} x={-WINDOW_WIDTH / 2 + 58} y={TITLEBAR_Y} fill={'#febc2e'} />
          <Circle width={15} height={15} x={-WINDOW_WIDTH / 2 + 84} y={TITLEBAR_Y} fill={'#28c840'} />
          <Rect width={820} height={36} y={TITLEBAR_Y} radius={9} fill={'#2B2E3B'} />

          <Txt
            ref={imageTitle}
            text={'image.png'}
            y={TITLEBAR_Y}
            fill={COLORS.titleText}
            fontFamily={'monospace'}
            fontSize={24}
          />
          <Txt
            ref={htmlTitle}
            text={'doom.html'}
            y={TITLEBAR_Y}
            fill={COLORS.titleText}
            fontFamily={'monospace'}
            fontSize={24}
            opacity={0}
            scale={[1, 0]}
          />

          <Rect
            width={CONTENT_WIDTH}
            height={CONTENT_HEIGHT}
            y={CONTENT_Y}
            radius={12}
            fill={'rgba(0,0,0,0)'}
            clip
          >
            <Rect
              ref={programBackdrop}
              width={CONTENT_WIDTH}
              height={CONTENT_HEIGHT}
              fill={'#11131A'}
              opacity={0}
              scale={[1080 / CONTENT_WIDTH, 1]}
            />
            <Node ref={imageLayer} scale={1.5}>
              <Scene4Landscape />
            </Node>

            <Node ref={htmlLayer} opacity={0}>
              <Node ref={htmlTag} y={-22} scale={2.15}>
                <HtmlTag />
              </Node>
              <Node ref={playButton} y={112} opacity={0} scale={0.25}>
                <Rect
                  width={300}
                  height={22}
                  radius={11}
                  fill={'rgba(255,255,255,0.12)'}
                  shadowColor={'rgba(140,124,255,0.24)'}
                  shadowBlur={14}
                >
                  <Rect
                    ref={loadingFill}
                    width={0}
                    height={22}
                    x={-150}
                    offset={[-1, 0]}
                    radius={11}
                    fill={COLORS.purple}
                  />
                </Rect>
              </Node>
            </Node>

            <Video
              ref={gameplay}
              src={gameplayVideo}
              width={1280}
              time={29}
              opacity={0}
            />
          </Rect>
        </Rect>
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={20}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.border}
          lineWidth={3}
        />
      </Node>

      {[
        [-642.5794, -210.5102, -9.1509, 0.991485, 1.008515],
        [656.4291, -188.3039, 4.1818, 0.997899, 1.002101],
        [-660.1022, 219.3102, -5.1468, 1.007993, 0.992007],
        [647.1772, 227.9165, -13.0967, 1.004448, 0.995552],
      ].map(([x, y, rotation, scaleX, scaleY], index) => (
        <Node
          ref={ghostRefs[index]}
          key={`same-bytes-${index}`}
          x={x}
          y={y}
          rotation={rotation}
          scale={[scaleX, scaleY]}
          opacity={[0.58, 0.54, 0.52, 0.56][index]}
          zIndex={5}
        >
          <PurpleStrip width={285} />
        </Node>
      ))}

      <Node ref={finalFile} opacity={0} scale={0.55}>
        <FinalFile />
      </Node>
    </Node>,
  );

  // 0.00–0.50 — exact visual handoff from Scene 8.
  yield* waitFor(0.50);

  // 0.50–1.50 — the four existing byte/code fragments flow into the same
  // window rather than being replaced by a new set of data.
  yield* sequence(
    0.08,
    ...ghostRefs.map((ref, index) => all(
      ref().position([0, -54 + index * 36], 0.76, easeInOutCubic),
      ref().rotation(0, 0.76, easeInOutCubic),
      ref().opacity(0.86, 0.32, easeOutCubic),
    )),
  );

  // 1.50–2.05 — reinterpret the same open file as HTML.
  yield* all(
    imageTitle().scale([1, 0], 0.25, easeInCubic),
    imageTitle().opacity(0, 0.22, easeInCubic),
    imageLayer().opacity(0.10, 0.55, easeInCubic),
    imageLayer().scale([1.5833, 1.5], 0.55, easeInOutCubic),
    programBackdrop().opacity(1, 0.42, easeInCubic),
    programBackdrop().scale([1, 1], 0.55, easeInOutCubic),
    ...ghostRefs.map(ref => ref().opacity(0, 0.42, easeInCubic)),
    chain(
      waitFor(0.24),
      all(
        htmlTitle().opacity(1, 0.20, easeOutCubic),
        htmlTitle().scale([1, 1], 0.31, easeOutCubic),
      ),
    ),
  );

  // 2.05–2.40 — identical HTML-tag-to-game-loader animation from Scene 5.
  yield* all(
    imageLayer().opacity(0, 0.42, easeInCubic),
    htmlLayer().opacity(1, 0.22, easeOutCubic),
    htmlTag().y(-72, 0.35, easeInOutCubic),
    htmlTag().scale(1.55, 0.35, easeInOutCubic),
    playButton().opacity(1, 0.24, easeOutCubic),
    playButton().scale(1, 0.35, easeOutCubic),
  );

  // 2.40–3.05 — identical Scene 5 loading completion and gameplay reveal.
  gameplay().seek(29);
  gameplay().play();
  yield* all(
    loadingFill().width(300, 0.30, easeInOutCubic),
    chain(waitFor(0.28), playButton().opacity(0, 0.20, easeInCubic)),
    htmlTag().opacity(0, 0.30, easeInCubic),
    chain(waitFor(0.14), gameplay().opacity(1, 0.51, easeOutCubic)),
  );

  // 3.05–5.90 — let the different interpretation register.
  yield* waitFor(2.85);

  // 5.90–6.70 — close the browser back into the single polyglot file.
  yield* all(
    window().opacity(0, 0.48, easeInCubic),
    window().scale([0.16, 0.30], 0.80, easeInOutCubic),
    chain(
      waitFor(0.36),
      all(
        finalFile().opacity(1, 0.30, easeOutCubic),
        finalFile().scale(1.12, 0.44, easeOutCubic),
      ),
    ),
  );
  gameplay().pause();

  // 6.70–8.00 — quiet final image under the spoken sign-off.
  yield* waitFor(1.30);

  // 8.00–9.00 — clean ending with no extra explanatory copy.
  yield* all(
    finalFile().opacity(0, 0.72, easeInCubic),
    finalFile().scale(0.88, 0.72, easeInCubic),
  );
  yield* waitFor(0.28);
});
