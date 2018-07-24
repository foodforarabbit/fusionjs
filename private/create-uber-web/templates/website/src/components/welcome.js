// @flow
import React from 'react';
import {styled} from 'fusion-plugin-styletron-react';
import type {ElementType} from 'react';
import {withThinFont, withNewsFont} from '../config/fonts';

const Centered = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

const H1 = withThinFont(
  styled('h1', props => ({
    fontWeight: '100',
    fontSize: '96px',
    margin: '0px',
    ...props.$fontStyles,
  }))
);

const A = withNewsFont(
  styled('a', props => {
    return {
      fontWeight: '500',
      fontSize: '14px',
      letterSpacing: '.4px',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: '#11939A',
      ':hover': {
        color: '#0c6c71',
      },
      ...props.$fontStyles,
    };
  })
);

const AlignRight = styled('div', {
  textAlign: 'right',
});

const Svg = styled('svg', {
  // $FlowFixMe
  fill: 'currentColor',
});

const FadeIn = styled('div', props => ({
  opacity: 0,
  animationName: {
    from: {opacity: 0},
    to: {opacity: 1},
  },
  animationDuration: '2s',
  animationFillMode: 'forwards',
  animationDelay: props.$delay,
}));

function RightArrow(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.3 10.7" {...props}>
      <path d="M6.3 5.4L1.4.1 0 1.5l3.6 3.9L0 9.2l1.4 1.4 4.9-5.2z" />
    </Svg>
  );
}

const PaddedRightArrow = styled(RightArrow, props => ({
  paddingLeft: props.$entered ? '14px' : '10px',
  paddingRight: props.$entered ? '0px' : '4px',
  transition: 'padding 400ms ease',
}));

type RightArrowProps = {
  children: ElementType,
};

type RightArrowState = {
  entered: boolean,
};

class RightArrowLink extends React.Component<RightArrowProps, RightArrowState> {
  state = {entered: false};

  onMouseOver = () => {
    this.setState({entered: true});
  };

  onMouseOut = () => {
    this.setState({entered: false});
  };

  render() {
    return (
      <A
        {...this.props}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        {this.props.children}
        <PaddedRightArrow
          width="11"
          height="11"
          $entered={this.state.entered}
        />
      </A>
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
            <RightArrowLink href="http://t.uber.com/web" target="_blank">
              Let&apos;s get started
            </RightArrowLink>
          </FadeIn>
        </AlignRight>
      </div>
    </Centered>
  );
}
