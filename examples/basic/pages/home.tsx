import React from 'react';
import { Link, page } from 'react-router-decorator';

@page('/home', { title: 'Home首页', context: '/' })
export class Home extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <div>
          <Link to={'/about'}>About</Link>
        </div>
        <div>
          <Link to={`/user/info/${new Date().toTimeString()}`}>User</Link>
        </div>
      </div>
    );
  }
}

@page('', { title: 'Index 首页', context: '/', index: true })
export class Home1 extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h1>Index 5588</h1>
      </div>
    );
  }
}
