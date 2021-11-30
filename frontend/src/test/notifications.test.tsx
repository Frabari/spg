import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useNotifications } from '../hooks/useNotifications';

test('load notifications', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useNotifications());
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
