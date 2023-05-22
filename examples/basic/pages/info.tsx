import React from 'react';
import { $page, useParams } from 'react-router-decorator';

export const Info = () => {
  const params = useParams();
  return (
    <>
      <h2>用户详情</h2>
      <h4>用户 {params.id}</h4>
    </>
  );
};

$page(Info, '/info/:id', { title: '用户详情', context: '/user' });
