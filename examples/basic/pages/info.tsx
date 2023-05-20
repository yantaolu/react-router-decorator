import React from 'react';
import { page } from 'react-router-decorator';

@page('/info/:id', { title: '用户详情', context: '/user' })
export class Info extends React.Component {
  render() {
    return <div>用户详情</div>;
  }
}
