import * as migration_20261023_150000_initial from './20261023_150000_initial';

export const migrations = [
  {
    up: migration_20261023_150000_initial.up,
    down: migration_20261023_150000_initial.down,
    name: '20261023_150000_initial'
  },
];
