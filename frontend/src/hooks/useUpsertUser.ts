import { useMutation, useQueryClient } from 'react-query';
import { createUser, updateUser, User } from '../api/BasilApi';
import { USER_QUERY } from './useUser';

export const useUpsertUser = () => {
  const client = useQueryClient();
  const createMutation = useMutation(createUser);
  const updateMutation = useMutation((user: Partial<User>) =>
    updateUser(user.id, user),
  );
  const upsertUser = (user: Partial<User>) => {
    if (!user?.id) {
      return createMutation.mutateAsync(user);
    }
    return updateMutation.mutateAsync(user).then(updatedUser => {
      client.setQueryData([USER_QUERY, updatedUser.id], updatedUser);
      return updatedUser;
    });
  };
  return {
    upsertUser,
  };
};
