import { isPlainObject } from "@reduxjs/toolkit";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { GraphQLError, type DocumentNode } from "graphql";
import { GraphQLClient, ClientError, RequestOptions } from "graphql-request";
import type {
  ErrorResponse,
  GraphqlRequestBaseQueryArgs,
  PrepareHeaders,
  RequestHeaders,
} from "./GraphqlBaseQueryTypes";
import { RootState } from "../store";
import axios, { AxiosError } from "axios";
import { IAuthResponse } from "../RTK-query/authApi";
import { loggedOut, setAccessToken } from "../authSilce";

export const graphqlRequestBaseQuery = <E = ErrorResponse>(
  options: GraphqlRequestBaseQueryArgs<E>
): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  E,
  Partial<Pick<ClientError, "request" | "response">>
> => {
  const client =
    "client" in options
      ? options.client
      : new GraphQLClient(`${options.url}/graphql`);
  const requestHeaders: RequestHeaders =
    "requestHeaders" in options ? options.requestHeaders : {};

  return async (
    { document, variables },
    { getState, endpoint, forced, type, signal, extra, dispatch }
  ) => {
    const { persistedReducer } = getState() as RootState;

    const getToken = () => {
      const { persistedReducer } = getState() as RootState;
      console.log({
        access_token: persistedReducer.auth.access_token,
        refresh_token: persistedReducer.auth.refresh_token,
      });

      return {
        access_token: persistedReducer.auth.access_token,
        refresh_token: persistedReducer.auth.refresh_token,
      };
    };

    const fetchNewToken = async () => {
      return await axios.post<IAuthResponse>(
        `${process?.env?.NEXT_PUBLIC_API_BASE_URL}/refresh-token` || "",
        {
          refresh_token: getToken().refresh_token,
          access_token: getToken().access_token,
        },
        {
          headers: {
            Authorization: getToken().access_token
              ? `Bearer ${getToken().access_token}`
              : "", // Add token here
          },
        }
      );
    };

    const ClientRequest = async () => {
      const prepareHeaders: PrepareHeaders =
        options.prepareHeaders ?? ((x) => x);
      const headers = new Headers(stripUndefined(requestHeaders));

      headers.set(
        "Authorization",
        `Bearer ${persistedReducer.auth.access_token}`
      );

      const preparedHeaders = await prepareHeaders(headers, {
        getState,
        endpoint,
        forced,
        type,
        extra,
      });
      return await client.request({
        document,
        variables,
        signal: signal as unknown as RequestOptions["signal"],
        requestHeaders: preparedHeaders,
      });
    };

    try {
      // const prepareHeaders: PrepareHeaders =
      //   options.prepareHeaders ?? ((x) => x);
      // const headers = new Headers(stripUndefined(requestHeaders));

      // headers.set(
      //   "Authorization",
      //   `Bearer ${persistedReducer.auth.access_token}`
      // );

      // const preparedHeaders = await prepareHeaders(headers, {
      //   getState,
      //   endpoint,
      //   forced,
      //   type,
      //   extra,
      // });
      return {
        data: await ClientRequest(),
        meta: {},
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error;
        if (message.includes("401")) {
          try {
            const refreshResult = await fetchNewToken();
            if (refreshResult.data.access_token) {
              // store the new token
              dispatch(setAccessToken(refreshResult.data.access_token));

              return {
                data: await ClientRequest(),
                meta: {},
              };
            } else {
              throw new AxiosError("Something went wrong!");
            }
          } catch (error) {
            dispatch(loggedOut());
            const err = error as AxiosError;
            const { message, stack, name } = err;
            const customErrors =
              options.customErrors ?? (() => ({ name, message, stack }));
            const customizedErrors = { message, stack, name } as E;

            return { error: customizedErrors, meta: { request, response } };
          }
        }

        const customErrors =
          options.customErrors ?? (() => ({ name, message, stack }));

        const customizedErrors = customErrors(error) as E;
        return { error: customizedErrors, meta: { request, response } };
      }
      throw error;
    }
  };
};

function stripUndefined(obj: any) {
  if (!isPlainObject(obj)) {
    return obj;
  }
  const copy: Record<string, any> = { ...obj };
  for (const [k, v] of Object.entries(copy)) {
    if (typeof v === "undefined") delete copy[k];
  }
  return copy;
}
