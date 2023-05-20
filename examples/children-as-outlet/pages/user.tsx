import React from 'react';
import { page } from 'react-router-decorator';

@page('/user', { title: '用户' })
export class User extends React.Component<any, any> {
  render() {
    return (
      <>
        <div>用户</div>
        {/* 使用 children 代替嵌套路由插槽 */}
        {this.props.children}
      </>
    );
  }
}
