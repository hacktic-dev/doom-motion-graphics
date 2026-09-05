import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';

import {
  all,
  chain,
  createRef,
  easeInOutCubic,
  waitFor,
} from '@motion-canvas/core';

const COLORS = {
  card: '#343746',
  text: '#F4F6FA',
  shadow: 'rgba(0,0,0,0.28)',
};

const TITLE = 'What is a file format?';

/*
 * Exact section timing:
 *
 * 0.00 - 0.60  pill expands
 * 0.60 - 0.90  brief pause
 * 0.90 - 2.45  text types
 * 2.45 - 2.90  finished title holds
 * 2.90 - 3.60  pill collapses
 */
const PILL_IN_DURATION = 0.60;
const BEFORE_TYPE_DELAY = 0.30;
const TYPE_DURATION = 1.55;
const FINISHED_HOLD = 0.45;
const PILL_OUT_DURATION = 0.70;

const PILL_WIDTH = 1050;
const PILL_HEIGHT = 118;
const COLLAPSED_WIDTH = 28;

export default makeScene2D(function* (view) {
  const pill = createRef<Rect>();
  const title = createRef<Txt>();

  view.add(
    <Rect
      ref={pill}
      width={COLLAPSED_WIDTH}
      height={PILL_HEIGHT}
      y={-337}
      radius={20}
      fill={COLORS.card}
      shadowColor={COLORS.shadow}
      shadowBlur={22}
      shadowOffsetY={10}
      opacity={0}
      clip
    >
      <Txt
        ref={title}
        text={''}
        fill={COLORS.text}
        fontSize={73}
        fontFamily={'Courier New'}
        fontWeight={700}
        textAlign={'center'}
        width={PILL_WIDTH - 88}
      />
    </Rect>,
  );

  yield* all(
    pill().width(
      PILL_WIDTH,
      PILL_IN_DURATION,
      easeInOutCubic,
    ),
    pill().opacity(1, 0.14, easeInOutCubic),
  );

  yield* waitFor(BEFORE_TYPE_DELAY);

  const timePerCharacter = TYPE_DURATION / TITLE.length;

  for (let index = 0; index < TITLE.length; index++) {
    title().text(TITLE.slice(0, index + 1));
    yield* waitFor(timePerCharacter);
  }

  yield* waitFor(FINISHED_HOLD);

  yield* all(
    pill().width(
      COLLAPSED_WIDTH,
      PILL_OUT_DURATION,
      easeInOutCubic,
    ),
    chain(
      waitFor(PILL_OUT_DURATION - 0.16),
      pill().opacity(0, 0.16, easeInOutCubic),
    ),
  );
});
