// @flow

import React, {useState, useRef, useEffect} from 'react';
import {styled, useStyletron} from 'baseui';
import {Button} from 'baseui/button';
import {ChevronRightFilled} from '@uber/icons';

const FadeIn = styled<{$delay: string}>('div', props => ({
  opacity: 0,
  animationName: {
    from: {opacity: 0},
    to: {opacity: 1},
  },
  animationDuration: '2s',
  animationFillMode: 'forwards',
  animationDelay: props.$delay,
}));

export default function Hello() {
  const [css, theme] = useStyletron();

  const centered = css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  });

  const h1 = css({
    ...theme.typography.DisplayMedium,
    color: theme.colors.contentPrimary,
  });

  return (
    <div className={centered}>
      <div>
        <FadeIn $delay="500ms">
          <h1 className={h1}>Welcome</h1>
        </FadeIn>
        <div className={css({textAlign: 'right'})}>
          <FadeIn $delay="1.5s">
            <ButtonLink>Let&apos;s get started</ButtonLink>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

function ButtonLink(props) {
  const buttonRef = useRef(null);
  const isHovered = useHover(buttonRef);
  return (
    <Button
      {...props}
      ref={buttonRef}
      endEnhancer={ChevronIcon}
      overrides={{
        BaseButton: {
          props: {
            $as: 'a',
            href: 'https://engdocs.uberinternal.com/web/docs/guides/graphql',
            target: '_blank',
          },
          style: {
            paddingRight: isHovered ? '10px' : '16px',
            transitionProperty: 'background padding',
          },
        },
        EndEnhancer: {
          style: ({$theme}) => ({
            marginLeft: isHovered ? '18px' : '12px',
            transitionProperty: 'margin',
            transitionDuration: $theme.animation.timing100,
            transitionTimingFunction: $theme.animation.easeOutCurve,
          }),
        },
      }}
    />
  );
}

function ChevronIcon(props) {
  return <ChevronRightFilled size="24px" />;
}

function useHover(ref) {
  const [value, setValue] = useState(false);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);
      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [ref]);
  return value;
}
