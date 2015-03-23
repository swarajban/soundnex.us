"use strict";

class HelloMessage extends React.Component {
  render () {
    return <div className={classNames('hello')}>Hello {this.props.name}</div>;
  }
}
