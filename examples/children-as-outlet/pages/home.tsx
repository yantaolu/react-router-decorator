import React from 'react';
import { page } from 'react-router-decorator';

@page('/')
export class Home extends React.Component<any, any> {
  render() {
    return <div>Hello World.</div>;
  }
}
