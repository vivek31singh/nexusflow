import { useWorkspace } from '@/contexts/workspace-context';

/**
 * Hook for theme management
 */
export function useTheme() {
  const { state, dispatch } = useWorkspace();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return {
    theme: state.theme,
    toggleTheme,
    isDark: state.theme === 'dark',
  };
}
