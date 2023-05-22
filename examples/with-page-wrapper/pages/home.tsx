import React from 'react';
import { Link, page } from 'react-router-decorator';

@page('/', { title: '首页' })
export class Home extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <div>
          <Link to={'/about'}>About</Link>
        </div>
        <div>
          <Link to={`/user`}>User</Link>
        </div>
        <div>
          <Link to={`/user/info/test`}>User Info</Link>
        </div>
      </div>
    );
  }
}
