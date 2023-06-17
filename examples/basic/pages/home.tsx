import React from 'react';
import { Link, page } from 'react-router-decorator';

@page('/home', { title: '首页', context: '/' })
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
