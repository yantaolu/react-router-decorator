import React from 'react';
import { $page, PageWrapperProps } from 'react-router-decorator';

export const Info = ({ params }: PageWrapperProps) => {
  console.log('用户id', params.id);
  return <div>用户详情</div>;
};

$page(Info, '/info/:id', { title: '用户详情', context: '/user' });
