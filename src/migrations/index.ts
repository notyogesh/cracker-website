import * as migration_20261023_150000_initial from './20261023_150000_initial';
import * as migration_20261023_154716_blob_fields from './20261023_154716_blob_fields';

export const migrations = [
  {
    up: migration_20261023_150000_initial.up,
    down: migration_20261023_150000_initial.down,
    name: '20261023_150000_initial',
  },
  {
    up: migration_20261023_154716_blob_fields.up,
    down: migration_20261023_154716_blob_fields.down,
    name: '20261023_154716_blob_fields'
  },
];
