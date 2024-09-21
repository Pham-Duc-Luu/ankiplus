import IconCloud from '@/components/magicui/icon-cloud';
import { Outlet } from '@remix-run/react';
import React from 'react';

const slugs = [
  'typescript',
  'javascript',
  'dart',
  'java',
  'react',
  'flutter',
  'android',
  'html5',
  'css3',
  'nodedotjs',
  'express',
  'nextdotjs',
  'prisma',
  'amazonaws',
  'postgresql',
  'firebase',
  'nginx',
  'vercel',
  'testinglibrary',
  'jest',
  'cypress',
  'docker',
  'git',
  'jira',
  'github',
  'gitlab',
  'visualstudiocode',
  'androidstudio',
  'sonarqube',
  'figma',
];

const auth = () => {
  return (
    <div className=" min-w-full min-h-screen flex items-center justify-center">
      <div className=" flex-1">
        <Outlet></Outlet>
      </div>
      <div className="lg:block hidden">
        <IconCloud iconSlugs={slugs} />
      </div>
    </div>
  );
};

export default auth;
