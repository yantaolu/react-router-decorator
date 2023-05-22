import React from 'react';
import { useParams } from 'react-router-decorator';

const Info = () => {
  const params = useParams();
  return (
    <>
      <h2>用户详情</h2>
      <h4>用户 {params.id}</h4>
    </>
  );
};

export default Info;
