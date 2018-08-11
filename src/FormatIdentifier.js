import React, { Component } from 'react';

export default class FormatIdentifier extends Component {
  render() {
    return pug`
      .format-identifier
        p 入力： ${this.props.format}
          br
          |結果： ${this.props.result}
    `;
  }
}
