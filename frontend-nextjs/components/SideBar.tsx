import { cn } from '@/lib/utils';
import React from 'react';

const SideBar = ({ className }: { className?: string }) => {
  return <div className={cn('hidden', className)}>SideBar</div>;
};

export default SideBar;
