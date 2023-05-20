import React from 'react';
import { $page, useParams } from 'react-router-decorator';

export const Info = () => {
  const params = useParams();
  console.log('用户id', params.id);
  return <div>用户详情</div>;
};

$page(Info, '/info/:id', { title: '用户详情', context: '/user' });
