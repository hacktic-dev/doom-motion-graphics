import {
  Circle,
  Img,
  Line,
  Node,
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
  waitFor,
} from '@motion-canvas/core';

import {PngPreview} from '../components/PngPreview';
import doomScreenshot from '../img/doom.png';

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

const WINDOW_WIDTH = 1160;
const WINDOW_HEIGHT = 842;
const TITLEBAR_HEIGHT = 58;
const CONTENT_WIDTH = 1096;
const CONTENT_HEIGHT = 720;

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

      {kind === 'unknown' ? (
        <Txt
          text={'?'}
          y={16}
          fill={COLORS.textMuted}
          fontSize={76}
          fontFamily={'Arial'}
          fontWeight={700}
        />
      ) : null}
    </Node>
  );
}

export default makeScene2D(function* (view) {
  const htmlFile = createRef<Node>();
  const browser = createRef<Node>();
  const doomArtwork = createRef<Img>();
  const pngFile = createRef<Node>();
  const plus = createRef<Txt>();
  const destination = createRef<Node>();
  const leftPath = createRef<Line>();
  const rightPath = createRef<Line>();
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

      <Node ref={browser} opacity={0} scale={[0.155, 0.266]}>
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
          <Rect width={WINDOW_WIDTH} height={TITLEBAR_HEIGHT} y={-392} fill={COLORS.titlebar} />
          <Circle width={17} height={17} x={-550} y={-392} fill={'#ff5f57'} />
          <Circle width={17} height={17} x={-520} y={-392} fill={'#febc2e'} />
          <Circle width={17} height={17} x={-490} y={-392} fill={'#28c840'} />
          <Rect width={760} height={36} y={-392} radius={9} fill={COLORS.panel} />
          <Txt
            text={'doom.html'}
            y={-392}
            fill={COLORS.textMuted}
            fontSize={22}
            fontFamily={'monospace'}
          />
          <Rect width={CONTENT_WIDTH} height={CONTENT_HEIGHT} y={32} radius={12} fill={'#11131A'} clip>
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
            <Img
              ref={doomArtwork}
              src={doomScreenshot}
              width={CONTENT_WIDTH}
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

      <Txt
        ref={plus}
        text={'+'}
        y={-80}
        fill={COLORS.textMuted}
        fontSize={78}
        fontFamily={'Arial'}
        fontWeight={500}
        opacity={0}
        scale={0.6}
      />

      <Node ref={destination} y={210} opacity={0} scale={0.72}>
        <FileShape kind={'unknown'} />
      </Node>

      <Line
        ref={leftPath}
        points={[[-320, 25], [-170, 120], [-95, 155]]}
        stroke={COLORS.textMuted}
        lineWidth={5}
        lineCap={'round'}
        endArrow
        arrowSize={15}
        end={0}
        opacity={0}
      />
      <Line
        ref={rightPath}
        points={[[320, 25], [170, 120], [95, 155]]}
        stroke={COLORS.textMuted}
        lineWidth={5}
        lineCap={'round'}
        endArrow
        arrowSize={15}
        end={0}
        opacity={0}
      />
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
  yield* all(
    chain(
      playButton().scale(0.82, 0.10, easeInCubic),
      playButton().scale(1.12, 0.12, easeOutCubic),
      playButton().opacity(0, 0.20, easeInCubic),
    ),
    browserTag().opacity(0, 0.30, easeInCubic),
    chain(waitFor(0.14), doomArtwork().opacity(1, 0.51, easeOutCubic)),
  );

  // 3.00–6.25: allow the running program to register.
  yield* waitFor(3.25);

  // 6.25–7.05: collapse the whole browser back into doom.html.
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

  // 7.05–9.00: hold on the single packaged file.
  yield* waitFor(1.95);

  // 9.00–9.70: make room and introduce image.png as the second input.
  yield* all(
    htmlFile().position([350, -80], 0.62, easeInOutCubic),
    pngFile().x(-350, 0.62, easeInOutCubic),
    pngFile().opacity(1, 0.34, easeOutCubic),
    pngFile().scale(1, 0.62, easeOutCubic),
    chain(
      waitFor(0.34),
      all(
        plus().opacity(1, 0.24, easeOutCubic),
        plus().scale(1, 0.30, easeOutCubic),
      ),
    ),
  );
  yield* waitFor(0.06);

  // 9.70–11.20: hold the clear two-input equation.
  yield* waitFor(1.50);

  // 11.20–12.44: reveal the unresolved destination and begin convergence.
  yield* all(
    destination().opacity(1, 0.32, easeOutCubic),
    destination().scale(1, 0.45, easeOutCubic),
    plus().opacity(0, 0.24, easeInCubic),
    chain(
      waitFor(0.32),
      all(
        leftPath().opacity(1, 0.01),
        rightPath().opacity(1, 0.01),
        leftPath().end(1, 0.68, easeInOutCubic),
        rightPath().end(1, 0.68, easeInOutCubic),
        pngFile().position([-285, -105], 0.92, easeInOutCubic),
        htmlFile().position([285, -105], 0.92, easeInOutCubic),
      ),
    ),
  );
  yield* waitFor(0.76);

  // 12.44–14.00: unresolved final composition for the Scene 6 handoff.
  yield* waitFor(0.80);
});
