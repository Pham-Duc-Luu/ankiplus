import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { XMLBuilder } from "fast-xml-parser";
import { IShortCollectionDto, IUserProfileDto } from "./dto/dto.type";
import dayjs from "dayjs";

export interface User {
  _id?: string | number;
  avatar: object;
  avatarBuilt?: any;
  username: string;
  email: string;
  collections?: IShortCollectionDto[];
  password: string;
  page?: number;
  amountPerPage?: number;
  collectionsGroupByDate?: Record<string, IShortCollectionDto[]>;
}
const options = {
  ignoreAttributes: false,
};
const builder = new XMLBuilder(options);

const initAvatar = {
  "?xml": {
    "@_version": "1.0",
  },
  svg: {
    style: {
      "#text": ".st0{fill:#4E7A9E;}",
      "@_type": "text/css",
    },
    g: {
      g: {
        g: {
          path: [
            {
              "@_class": "st0",
              "@_d":
                "M24.8,30.9c0,0.8,0,1.6,0,2.4c0,2.6-0.2,5.3,0.3,7.9c0.6,3.3,5.4,2.3,5.6-0.8c0.1-2.1-0.3-4.2-0.4-6.2     c-0.1-1-0.1-1.9-0.2-2.9c0-0.2,0-0.3-0.1-0.5c2.2,0,4.3-0.1,6.4-0.5c2.8-0.5,2.9-5.4,0-5.8c-4.1-0.6-8.3-0.1-12.5,0     c-4,0.1-8.5,0-12.2,1.4c-2,0.7-2.2,3.6,0,4.2C15.6,31.3,20,31,24,30.9C24.3,30.9,24.6,30.9,24.8,30.9z",
            },
            {
              "@_class": "st0",
              "@_d":
                "M78.3,24.5c-4.1-0.6-8.3-0.1-12.5,0c-4,0.1-8.5,0-12.2,1.4c-2,0.7-2.2,3.6,0,4.2c3.8,1.2,8.3,0.9,12.2,0.8     c0.3,0,0.6,0,0.8,0c0,0.8,0,1.6,0,2.4c0,2.6-0.2,5.3,0.3,7.9c0.6,3.3,5.4,2.3,5.6-0.8c0.1-2.1-0.3-4.2-0.4-6.2     c-0.1-1-0.1-1.9-0.2-2.9c0-0.2,0-0.3-0.1-0.5c2.2,0,4.3-0.1,6.4-0.5C81.1,29.8,81.2,24.9,78.3,24.5z",
            },
            {
              "@_class": "st0",
              "@_d":
                "M69.4,62.7c-8.4-1.1-16.8-1.8-25.3-1.6c-4.1,0.1-8.1,0.4-12.2,0.9c-3.6,0.5-8.7,0.8-11.7,3.1     c-1.1,0.9-1,2.4,0.4,3c3.3,1.3,7.8,0.5,11.3,0.4c3.8-0.1,7.7-0.2,11.5-0.2c8,0.1,16,0.6,23.9,1.7c2.1,0.3,4.1-0.5,4.7-2.7     C72.6,65.6,71.4,63,69.4,62.7z",
            },
          ],
        },
      },
    },
    "@_width": "",
    "@_height": "",
    "@_viewBox": "0 0 91 91",
    "@_id": "Layer_1",
    "@_version": "1.1",
    "@_xml:space": "preserve",
    "@_xmlns": "http://www.w3.org/2000/svg",
    "@_xmlns:xlink": "http://www.w3.org/1999/xlink",
  },
};

const initialState: User = {
  avatar: initAvatar,
  avatarBuilt: builder.build(initAvatar),
  username: "quizlette8421301",
  email: "quizlette8421301@gmail.com",
  password: "*************",
};
// Function to group collections by the day they were created
const groupCollectionsByDay = (
  collections: IShortCollectionDto[]
): Record<string, IShortCollectionDto[]> => {
  return collections.reduce(
    (groups: Record<string, IShortCollectionDto[]>, collection) => {
      // Format the createdAt date to "YYYY-MM-DD" (ignoring time)
      const day = dayjs(collection.createdAt).format("YYYY-MM-DD");

      // Initialize the group if it doesn't exist
      if (!groups[day]) {
        groups[day] = [];
      }

      // Add the collection to the corresponding day group
      groups[day].push(collection);

      return groups;
    },
    {}
  );
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAvatarByChooseIcon: (state, payload: PayloadAction<object>) => {
      state.avatar = payload.payload;
      state.avatarBuilt = builder.build(payload.payload);
    },
    buildAvatar: (state) => {
      state.avatarBuilt = builder.build(state.avatar);
    },
    setState: (state, { payload }: PayloadAction<IUserProfileDto>) => {
      state._id = payload._id;
      state.username = payload.username;
      state.email = payload.email;
      state.collections = payload.collections?.data;
    },
    groupCollectionsByDayAction: (
      state,
      { payload }: PayloadAction<{ limit?: number; skip?: number }>
    ) => {
      if (state.collections) {
        state.collectionsGroupByDate = groupCollectionsByDay(state.collections);
      }
    },
  },
});

export const { setAvatarByChooseIcon, setState, groupCollectionsByDayAction } =
  userSlice.actions;

export default userSlice.reducer;
