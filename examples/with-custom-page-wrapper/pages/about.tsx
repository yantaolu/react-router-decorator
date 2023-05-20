import React from 'react';
import { $page } from 'react-router-decorator';

export const About = () => {
  return (
    <>
      About <a href='https://www.npmjs.com/package/react-router-decorator'>react-router-decorator</a>
    </>
  );
};

$page(About, '/about', { title: '关于' });
