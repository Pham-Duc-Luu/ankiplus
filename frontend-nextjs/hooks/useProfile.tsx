import { title } from 'process';
import { create } from 'zustand';
import { StoreApi, UseBoundStore } from 'zustand';
import { createSelectors } from './useCreateCollection';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IProfile {
  _id: string;
  email: string;
  username: string;
  collections?: { _id: string; name: string }[];
}

export interface IProfileStore {
  access_token?: string;
  profile?: IProfile;
  initProfile: (profile: IProfile) => void;
}

export const useProfileStore = create<IProfileStore>(
  persist(
    (set, get) => ({
      initProfile: (profile) => set({ ...get(), profile }),
    }),
    {
      name: 'anki-user', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const useCreateCollection = createSelectors(useProfileStore);
