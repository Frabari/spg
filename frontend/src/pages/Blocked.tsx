import { EmptyState } from '../components/EmptyState';

export const Blocked = () => (
  <EmptyState
    type="error"
    hint="Your Basil account was blocked because of a policy infringement. Check again in some days"
  />
);
