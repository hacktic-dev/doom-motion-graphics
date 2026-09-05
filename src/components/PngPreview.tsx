import {Circle, Line, Node, Rect} from '@motion-canvas/2d';

export interface PngPreviewProps {
  scale?: number;
}

export function PngPreview({scale = 1}: PngPreviewProps) {
  return (
    <Node scale={scale}>
      <Rect width={105} height={85} radius={8} fill={'#d8ecff'} clip>
        <Circle
          width={20}
          height={20}
          fill={'#ffd54a'}
          x={28}
          y={-22}
        />

        <Line
          points={[
            [-55, 45],
            [-18, 0],
            [5, 24],
            [28, -5],
            [55, 45],
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
