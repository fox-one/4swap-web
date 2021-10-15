import {
  MutationTypes as AppMutaionTypes,
  ActionTypes as AppActionTypes,
  prefix as AppPrefix,
} from "./modules/app/types";

import {
  MutationTypes as AccountMutaionTypes,
  ActionTypes as AccountActionTypes,
  GetterTypes as AccountGetterTypes,
  prefix as AccountPrefix,
} from "./modules/account/types";

import {
  MutationTypes as AuthMutationTypes,
  ActionTypes as AuthActionTypes,
  GetterTypes as AuthGetterTypes,
  prefix as AuthPrefix,
} from "./modules/auth/types";

import {
  MutationTypes as PoolMutationTypes,
  ActionTypes as PoolActionTypes,
  GetterTypes as PoolGetterTypes,
  prefix as PoolPrefix,
} from "./modules/pool/types";

function getGlobalTypes<T>(types: T, prefix: string) {
  return Object.keys(types).reduce(
    (m, k) => ({
      [k]: `${prefix}${types[k]}`,
      ...m,
    }),
    {}
  ) as { [k in keyof T]: string };
}

export const GlobalMutations = {
  ...getGlobalTypes(AppMutaionTypes, AppPrefix),
  ...getGlobalTypes(AccountMutaionTypes, AccountPrefix),
  ...getGlobalTypes(AuthMutationTypes, AuthPrefix),
  ...getGlobalTypes(PoolMutationTypes, PoolPrefix),
};

export const GlobalActions = {
  ...getGlobalTypes(AppActionTypes, AppPrefix),
  ...getGlobalTypes(AccountActionTypes, AccountPrefix),
  ...getGlobalTypes(AuthActionTypes, AuthPrefix),
  ...getGlobalTypes(PoolActionTypes, PoolPrefix),
};

export const GlobalGetters = {
  ...getGlobalTypes(AuthGetterTypes, AuthPrefix),
  ...getGlobalTypes(AccountGetterTypes, AccountPrefix),
  ...getGlobalTypes(PoolGetterTypes, PoolPrefix),
};
