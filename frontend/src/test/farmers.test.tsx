import './BasilApi.mock';
import { renderHook } from '@testing-library/react-hooks';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { useFarmers } from '../hooks/useFarmers';

const client = new QueryClient();
const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <BrowserRouter>
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  </BrowserRouter>
);

test('get farmers', async () => {
  const { result, waitFor } = renderHook(() => useFarmers(), { wrapper });
  await waitFor(() =>
    expect(result.current.data.find(u => u.id === 31).name).toEqual('Luigi'),
  );
});
