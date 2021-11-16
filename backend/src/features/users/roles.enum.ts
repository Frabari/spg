export enum Role {
  CUSTOMER = 'customer',
  FARMER = 'farmer',
  RIDER = 'rider',
  EMPLOYEE = 'employee',
  WAREHOUSE_WORKER = 'warehouse_worker',
  WAREHOUSE_MANAGER = 'warehouse_manager',
  MANAGER = 'manager',
}

export const ADMINS = [
  Role.MANAGER,
  Role.WAREHOUSE_MANAGER,
  Role.WAREHOUSE_WORKER,
  Role.EMPLOYEE,
];

export const STAFF = ADMINS.concat(Role.RIDER);
