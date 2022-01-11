import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { wrapper } from './wrapper';

test('update profile', async () => {
  const { result } = renderHook(() => useUpdateProfile(), { wrapper });
  await waitFor(() => expect(result.current).toBeDefined());
});
