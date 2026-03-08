import { cn } from '@/utils/cn'
import { SpinnerStyles as S } from './styles'
import { SPINNER, DURATION, SR_ONLY } from '../../config'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  ref?: React.Ref<HTMLDivElement>
}

const faceColors = {
  front: 'var(--color-spinner-front)',
  back: 'var(--color-spinner-back)',
  left: 'var(--color-spinner-light)',
  right: 'var(--color-spinner-lighter)',
  top: 'var(--color-spinner-dark)',
  bottom: 'var(--color-spinner-darker)',
}

function Spinner({ size = 'md', className, ref, ...props }: SpinnerProps) {
  const { cube, translate } = SPINNER.sizes[size]

  return (
    <div
      ref={ref}
      role="status"
      className={cn(S.container, className)}
      style={{ perspective: SPINNER.perspective }}
      {...props}
    >
      <style>
        {`
          @keyframes cube-spin {
            0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
            100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
          }
        `}
      </style>
      <div
        style={{
          width: cube,
          height: cube,
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: `cube-spin ${DURATION.spinner}s linear infinite`,
        }}
      >
        {/* Front face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `translateZ(${translate}px)`,
            backgroundColor: faceColors.front,
          }}
        />
        {/* Back face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `translateZ(-${translate}px)`,
            backgroundColor: faceColors.back,
          }}
        />
        {/* Left face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `rotateY(90deg) translateZ(${translate}px)`,
            backgroundColor: faceColors.left,
          }}
        />
        {/* Right face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `rotateY(-90deg) translateZ(${translate}px)`,
            backgroundColor: faceColors.right,
          }}
        />
        {/* Top face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `rotateX(90deg) translateZ(${translate}px)`,
            backgroundColor: faceColors.top,
          }}
        />
        {/* Bottom face */}
        <div
          style={{
            width: cube + SPINNER.cornerFill * 2,
            height: cube + SPINNER.cornerFill * 2,
            position: 'absolute',
            top: -SPINNER.cornerFill,
            left: -SPINNER.cornerFill,
            opacity: 0.8,
            borderRadius: SPINNER.borderRadius,
            transform: `rotateX(-90deg) translateZ(${translate}px)`,
            backgroundColor: faceColors.bottom,
          }}
        />
      </div>
      <span className={S.srOnly}>{SR_ONLY.loading}</span>
    </div>
  )
}

export { Spinner }
