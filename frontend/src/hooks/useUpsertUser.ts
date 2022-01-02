import { useMutation } from 'react-query';
import { createUser, updateUser, User } from '../api/BasilApi';

export const useUpsertUser = () => {
  const createMutation = useMutation(createUser);
  const updateMutation = useMutation((user: Partial<User>) =>
    updateUser(user.id, user),
  );
  const upsertUser = (user: Partial<User>) => {
    if (!user?.id) {
      return createMutation.mutateAsync(user);
    }
    return updateMutation.mutateAsync(user);
  };
  return {
    upsertUser,
  };
};
