import { NavigateFunction } from 'react-router-dom';

export const handleScroll = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const navigateAndScroll = async (
  e: React.MouseEvent<HTMLElement, MouseEvent>,
  navigate: NavigateFunction,
  param: string | null,
  path = '/'
) => {
  // If the current route is different from the desired path, navigate
  if (window.location.pathname !== path) {
    navigate(path);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for navigation to complete
  }

  // If param is provided, scroll to the desired section
  if (param) {
    handleScroll(e, param);
  }
};
