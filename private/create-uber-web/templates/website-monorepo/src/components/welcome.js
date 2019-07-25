// @flow
import * as React from 'react';
import {styled} from 'baseui';
import {Button} from 'baseui/button';
import {ChevronRightFilled} from '@uber/icons';
import {withMoveTextLight} from '../config/fonts';

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const H1 = withMoveTextLight(
  styled<{$foneStyles: any}>('h1', props => ({
    fontWeight: '100',
    fontSize: '96px',
    margin: '0px',
    ...props.$fontStyles,
  }))
);

const AlignRight = styled('div', {
  textAlign: 'right',
});

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

function ChevronIcon(props) {
  return <ChevronRightFilled size="24px" />;
}

type ButtonProps = {
  children: React.Node,
};

type ButtonState = {
  hovered: boolean,
};

class ButtonLink extends React.Component<ButtonProps, ButtonState> {
  state = {hovered: false};

  onMouseOver = () => {
    this.setState({hovered: true});
  };

  onMouseOut = () => {
    this.setState({hovered: false});
  };

  render() {
    return (
      <Button
        {...this.props}
        data-tracking-name="get-started"
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        endEnhancer={ChevronIcon}
        overrides={{
          BaseButton: {
            props: {
              $as: 'a',
              href: 'http://t.uber.com/web',
              target: '_blank',
            },
            style: {
              paddingRight: this.state.hovered ? '10px' : '16px',
              transitionProperty: 'background padding',
            },
          },
          EndEnhancer: {
            style: ({$theme}) => ({
              marginLeft: this.state.hovered ? '18px' : '12px',
              transitionProperty: 'margin',
              transitionDuration: $theme.animation.timing100,
              transitionTimingFunction: $theme.animation.easeOutCurve,
            }),
          },
        }}
      >
        {this.props.children}
      </Button>
    );
  }
}

export default function Hello() {
  return (
    <Centered>
      <div>
        <FadeIn $delay="500ms">
          <H1>Welcome</H1>
        </FadeIn>
        <AlignRight>
          <FadeIn $delay="1.5s">
            <ButtonLink>Let&apos;s get started</ButtonLink>
          </FadeIn>
        </AlignRight>
      </div>
    </Centered>
  );
}
