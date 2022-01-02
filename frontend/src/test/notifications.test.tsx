import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useNotifications } from '../hooks/useNotifications';
import { wrapper } from './wrapper';

test('load notifications', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useNotifications(), {
    wrapper,
  });
  await waitFor(() =>
    expect(
      result.current.notifications.find(n => n.title === 'notification'),
    ).toBeDefined(),
  );
  await waitForNextUpdate();
  expect(
    result.current.notifications.find(n => n.title === 'notification'),
  ).toBeDefined();
});
