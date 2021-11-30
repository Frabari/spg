import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useNotifications } from '../hooks/useNotifications';

test('load notifications', async () => {
  const { result } = renderHook(() => useNotifications());
  await waitFor(() =>
    expect(result.current.notifications.find(n => n.title === 'notification')),
  );
});
