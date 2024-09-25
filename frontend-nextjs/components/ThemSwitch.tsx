import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      isIconOnly
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
      {theme === 'light' ? <CiDark size={28} /> : <CiLight size={28} />}
    </Button>
  );
};

export default ThemeSwitch;
