import React from 'react';
import io from 'socket.io-client';

class SocketFetch extends React.Component {
  constructor() {
    super();
    this.state = {
      response: false,
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = io(endpoint);

    socket.on('twitchstuff', function(res){
      if (res) {
       this.props.setBoobaData(res);
      }
    }.bind(this));
  }

  render() {
    return null;
  }
}

export default SocketFetch;