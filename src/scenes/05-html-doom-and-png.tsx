import {
  Circle,
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

import {PngPreview} from '../components/PngPreview';
import gameplayVideo from '../img/gameplay.mp4';

const COLORS = {
  background: '#21232E',
  card: '#343746',
  panel: '#2B2E3B',
  windowShell: '#2C2F3B',
  titlebar: '#1B1D26',
  border: '#50566A',
  borderStrong: '#646B82',
  text: '#F4F6FA',
  textMuted: '#AEB5C6',
  accent: '#8C7CFF',
  shadow: 'rgba(0,0,0,0.28)',
};

const TITLEBAR_HEIGHT = 58;
const CONTENT_MARGIN = 32;
// The source is a 16:9 encode containing a centred 4:3 gameplay image.
// The video is drawn at 1280px wide. A 1140px mask removes the encoded black
// side bars while retaining Doom's green frame on both active-image edges.
// Raise this to reveal more edge; lower it to crop farther inward.
const CONTENT_WIDTH = 1140;
const CONTENT_HEIGHT = 720;
const GAMEPLAY_WIDTH = 1280;
const WINDOW_WIDTH = CONTENT_WIDTH + CONTENT_MARGIN * 2;
const WINDOW_HEIGHT = TITLEBAR_HEIGHT + CONTENT_HEIGHT + CONTENT_MARGIN * 2;
const TITLEBAR_Y = -WINDOW_HEIGHT / 2 + TITLEBAR_HEIGHT / 2;
const CONTENT_Y =
  -WINDOW_HEIGHT / 2 +
  TITLEBAR_HEIGHT +
  CONTENT_MARGIN +
  CONTENT_HEIGHT / 2;

function HtmlTag() {
  return (
    <Node y={2}>
      <Line
        points={[[-28, -8], [-48, 11], [-28, 30]]}
        stroke={COLORS.accent}
        lineWidth={9}
        lineCap={'round'}
        lineJoin={'round'}
      />
      <Line
        points={[[8, -8], [-8, 30]]}
        stroke={COLORS.accent}
        lineWidth={9}
        lineCap={'round'}
      />
      <Line
        points={[[28, -8], [48, 11], [28, 30]]}
        stroke={COLORS.accent}
        lineWidth={9}
        lineCap={'round'}
        lineJoin={'round'}
      />
    </Node>
  );
}

function FileShape({kind}: {kind: 'html' | 'png' | 'unknown'}) {
  return (
    <Node>
      <Line
        points={[
          [-90, -112],
          [38, -112],
          [90, -60],
          [90, 112],
          [-90, 112],
        ]}
        closed
        fill={COLORS.card}
        stroke={COLORS.borderStrong}
        lineWidth={5}
        radius={15}
        shadowColor={COLORS.shadow}
        shadowBlur={22}
        shadowOffsetY={10}
      />
      <Line
        points={[[38, -112], [38, -60], [90, -60]]}
        stroke={COLORS.borderStrong}
        lineWidth={5}
      />
      <Line
        points={[[38, -112], [90, -60]]}
        stroke={COLORS.borderStrong}
        lineWidth={5}
      />

      {kind === 'html' ? (
        <Node y={8} scale={1.15}><HtmlTag /></Node>
      ) : null}

      {kind === 'png' ? <Node y={18} scale={1.22}><PngPreview /></Node> : null}

    </Node>
  );
}

export default makeScene2D(function* (view) {
  const htmlFile = createRef<Node>();
  const browser = createRef<Node>();
  const doomArtwork = createRef<Video>();
  const pngFile = createRef<Node>();
  const destination = createRef<Node>();
  const braidRefs = Array.from({length: 6}, () => createRef<Path>());
  const fusionBarRefs = Array.from({length: 6}, () => createRef<Rect>());
  const browserTag = createRef<Node>();
  const playButton = createRef<Node>();

  view.add(
    <Rect width={'100%'} height={'100%'} fill={COLORS.background} zIndex={-100} />,
  );

  view.add(
    <Node scale={1.25}>
      <Node ref={htmlFile} opacity={0} scale={0.08}>
        <FileShape kind={'html'} />
        <Txt
          text={'doom.html'}
          y={155}
          fill={COLORS.text}
          fontSize={35}
          fontFamily={'Arial'}
          fontWeight={600}
        />
      </Node>

      <Node ref={browser} opacity={0} scale={[0.15, 0.266]}>
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={20}
          fill={COLORS.windowShell}
          shadowColor={COLORS.shadow}
          shadowBlur={22}
          shadowOffsetY={10}
          clip
        >
          <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={TITLEBAR_Y} fill={COLORS.titlebar} />
          <Circle width={17} height={17} x={-580} y={TITLEBAR_Y} fill={'#ff5f57'} />
          <Circle width={17} height={17} x={-550} y={TITLEBAR_Y} fill={'#febc2e'} />
          <Circle width={17} height={17} x={-520} y={TITLEBAR_Y} fill={'#28c840'} />
          <Rect width={820} height={36} y={TITLEBAR_Y} radius={9} fill={COLORS.panel} />
          <Txt
            text={'doom.html'}
            y={TITLEBAR_Y}
            fill={COLORS.textMuted}
            fontSize={22}
            fontFamily={'monospace'}
          />
          <Rect width={CONTENT_WIDTH} height={CONTENT_HEIGHT} y={CONTENT_Y} radius={12} fill={'#11131A'} clip>
            <Node ref={browserTag} y={-22} scale={2.15}>
              <HtmlTag />
            </Node>

            <Node ref={playButton} y={112} opacity={0} scale={0.25}>
              <Circle
                width={104}
                height={104}
                fill={COLORS.accent}
                shadowColor={'rgba(140,124,255,0.30)'}
                shadowBlur={20}
              />
              <Line
                points={[[-13, -24], [31, 0], [-13, 24]]}
                closed
                fill={COLORS.text}
                stroke={COLORS.text}
                lineWidth={3}
              />
            </Node>
            <Video
              ref={doomArtwork}
              src={gameplayVideo}
              width={GAMEPLAY_WIDTH}
              time={16}
              opacity={0}
            />
          </Rect>
        </Rect>
        <Rect
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          radius={20}
          fill={'rgba(0,0,0,0)'}
          stroke={COLORS.borderStrong}
          lineWidth={4}
        />
      </Node>

      <Node ref={pngFile} x={-700} y={-80} opacity={0} scale={0.72}>
        <FileShape kind={'png'} />
        <Txt
          text={'image.png'}
          y={155}
          fill={COLORS.text}
          fontSize={35}
          fontFamily={'Arial'}
          fontWeight={600}
        />
      </Node>

      <Node ref={destination} x={0} y={0} opacity={0} scale={0.42} zIndex={5}>
        <FileShape kind={'unknown'} />
        {[
          '#75b8ec', COLORS.accent, '#70b879',
          '#a996ff', '#f3c24f', '#735ee7',
        ].map((color, index) => (
          <Rect
            ref={fusionBarRefs[index]}
            key={`fusion-${index}`}
            width={105 - (index % 3) * 12}
            height={13}
            radius={7}
            y={-32 + index * 20}
            fill={color}
            opacity={0}
            scale={[0, 1]}
          />
        ))}
      </Node>

      {[
        {data: 'M -155 -62 C -112 -52 -82 28 18 -24', color: '#75b8ec'},
        {data: 'M -155 -42 C -96 -18 -72 -34 18 0', color: '#70b879'},
        {data: 'M -155 -22 C -118 10 -58 42 18 24', color: '#f3c24f'},
        {data: 'M 155 -62 C 112 -52 82 28 -18 -24', color: COLORS.accent},
        {data: 'M 155 -42 C 96 -18 72 -34 -18 0', color: '#a996ff'},
        {data: 'M 155 -22 C 118 10 58 42 -18 24', color: '#735ee7'},
      ].map(({data, color}, index) => (
        <Path
          ref={braidRefs[index]}
          key={`braid-${index}`}
          data={data}
          stroke={color}
          lineWidth={11}
          lineCap={'round'}
          end={0}
          opacity={0}
          zIndex={3}
        />
      ))}
    </Node>,
  );

  // 0.00–0.80: establish the self-contained HTML file.
  yield* all(
    htmlFile().opacity(1, 0.24, easeOutCubic),
    htmlFile().scale(1, 0.45, easeOutCubic),
  );
  yield* waitFor(0.35);

  // 0.80–1.20: a restrained pulse anticipates execution.
  yield* chain(
    htmlFile().scale(1.07, 0.18, easeOutCubic),
    htmlFile().scale(1, 0.18, easeInOutCubic),
  );
  yield* waitFor(0.04);

  // 1.20–2.00: the file itself unfolds into browser chrome. Starting the
  // browser at the file's proportions keeps this as one continuous object.
  yield* all(
    htmlFile().opacity(0, 0.34, easeInCubic),
    htmlFile().scale([6.1, 3.55], 0.80, easeInOutCubic),
    browser().opacity(1, 0.22, easeOutCubic),
    browser().scale([1, 1], 0.80, easeInOutCubic),
  );

  // 2.00–2.35: the retained code mark becomes an executable play control.
  yield* all(
    browserTag().y(-72, 0.35, easeInOutCubic),
    browserTag().scale(1.55, 0.35, easeInOutCubic),
    playButton().opacity(1, 0.24, easeOutCubic),
    playButton().scale(1, 0.35, easeOutCubic),
  );

  // 2.35–3.00: pressing play replaces the HTML mark with the running program.
  doomArtwork().seek(16);
  doomArtwork().play();
  yield* all(
    chain(
      playButton().scale(0.82, 0.10, easeInCubic),
      playButton().scale(1.12, 0.12, easeOutCubic),
      playButton().opacity(0, 0.20, easeInCubic),
    ),
    browserTag().opacity(0, 0.30, easeInCubic),
    chain(waitFor(0.14), doomArtwork().opacity(1, 0.51, easeOutCubic)),
  );

  // 3.00–5.75: allow the running program to register.
  yield* waitFor(2.75);

  // 5.75–6.55: collapse the whole browser back into doom.html.
  yield* all(
    doomArtwork().opacity(0, 0.28, easeInCubic),
    browser().opacity(0, 0.42, easeInCubic),
    browser().scale(0.16, 0.70, easeInCubic),
    chain(
      waitFor(0.34),
      all(
        htmlFile().opacity(1, 0.28, easeOutCubic),
        htmlFile().scale(1, 0.46, easeOutCubic),
      ),
    ),
  );
  doomArtwork().pause();

  // 6.55–10.25: hold on the single packaged file.
  yield* waitFor(3.70);

  // 10.25–10.78: make room and introduce image.png as the second input.
  yield* all(
    htmlFile().position([350, -80], 0.465, easeInOutCubic),
    pngFile().x(-350, 0.465, easeInOutCubic),
    pngFile().opacity(1, 0.255, easeOutCubic),
    pngFile().scale(1, 0.465, easeOutCubic),
  );
  yield* waitFor(0.06);

  // 10.78–11.90: hold on the two ingredients without reducing them to a
  // conventional plus-sign equation.
  yield* waitFor(1.125);

  // 11.90–12.91: both files release visible data strands toward the centre.
  // As the braid completes, the sources dissolve and one larger file forms.
  yield* all(
    pngFile().position([-245, -55], 0.54, easeInOutCubic),
    pngFile().rotation(7, 0.54, easeInOutCubic),
    htmlFile().position([245, -55], 0.54, easeInOutCubic),
    htmlFile().rotation(-7, 0.54, easeInOutCubic),
    chain(
      waitFor(0.0375),
      sequence(
        0.0525,
        ...braidRefs.map(ref => all(
          ref().opacity(1, 0),
          ref().end(1, 0.54, easeInOutCubic),
        )),
      ),
    ),
    chain(
      waitFor(0.465),
      all(
        pngFile().opacity(0, 0.375, easeInCubic),
        pngFile().scale(0.28, 0.375, easeInCubic),
        htmlFile().opacity(0, 0.375, easeInCubic),
        htmlFile().scale(0.28, 0.375, easeInCubic),
      ),
    ),
    chain(
      waitFor(0.51),
      all(
        destination().opacity(1, 0.24, easeOutCubic),
        destination().scale(1.20, 0.39, easeOutCubic),
      ),
    ),
    chain(
      waitFor(0.615),
      sequence(
        0.0375,
        ...fusionBarRefs.map(ref => all(
          ref().opacity(1, 0.135, easeOutCubic),
          ref().scale([1, 1], 0.21, easeOutCubic),
        )),
      ),
    ),
    chain(
      waitFor(0.75),
      all(...braidRefs.map(ref => ref().opacity(0, 0.15, easeInCubic))),
    ),
  );
  yield* waitFor(0.4875);

  // 13.40–14.00: hold the larger combined file for the Scene 6 handoff.
  yield* waitFor(0.60);
});
