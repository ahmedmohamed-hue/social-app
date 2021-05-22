import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Comment = {
  __typename?: 'Comment';
  createdAt: Scalars['DateTime'];
  comment: Scalars['String'];
  userId: Scalars['String'];
  postId: Scalars['Int'];
  id: Scalars['Int'];
  creator: User;
  owner: Scalars['Boolean'];
};

export type CreateUserInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
  sendEmail?: Maybe<Scalars['Boolean']>;
};


export type EditUserInput = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  role?: Maybe<Scalars['String']>;
};

export type LikeResponse = {
  __typename?: 'LikeResponse';
  likes: Array<User>;
  likeStatus: Scalars['Boolean'];
};

export type LoginInput = {
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: Comment;
  removeComment: Scalars['Boolean'];
  createPost: Post;
  deletePost: Scalars['Boolean'];
  like?: Maybe<LikeResponse>;
  login: User;
  logout: Scalars['Boolean'];
  register: User;
  confirmEmail: User;
  forgotPassword: Scalars['Boolean'];
  resetPassword: User;
  createUser: User;
  editUser: User;
  deleteUser: User;
  toggleStatus?: Maybe<ToggleOnline>;
  addAvatar: Scalars['String'];
  addCover: Scalars['String'];
  removeCover: Scalars['Boolean'];
  removeAvatar: Scalars['Boolean'];
};


export type MutationAddCommentArgs = {
  postId: Scalars['Int'];
  commnet: Scalars['String'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['Int'];
};


export type MutationCreatePostArgs = {
  options: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationLikeArgs = {
  postId: Scalars['Float'];
};


export type MutationLoginArgs = {
  options: LoginInput;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateUserArgs = {
  options: CreateUserInput;
};


export type MutationEditUserArgs = {
  data: EditUserInput;
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationAddAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationAddCoverArgs = {
  file: Scalars['Upload'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  users: Array<User>;
  hasMore: Scalars['Boolean'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  title: Scalars['String'];
  body: Scalars['String'];
  creatorId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updateAt: Scalars['DateTime'];
  creator: User;
  likeStatus?: Maybe<Scalars['Boolean']>;
  likes?: Maybe<Array<User>>;
  comments?: Maybe<Array<Comment>>;
  owner: Scalars['Boolean'];
};

export type PostInput = {
  title: Scalars['String'];
  body: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  comments: Array<Comment>;
  paginatedComments: PaginatedComments;
  postByUser: Array<Post>;
  post?: Maybe<Post>;
  paginatedPosts: PaginatedPosts;
  test: TestResponse;
  me?: Maybe<User>;
  isValidResetPasswordToken: Scalars['Boolean'];
  user?: Maybe<User>;
  users: Array<User>;
  paginatedUsers: PaginatedUsers;
};


export type QueryCommentsArgs = {
  postId: Scalars['Int'];
};


export type QueryPaginatedCommentsArgs = {
  cursor?: Maybe<Scalars['String']>;
  postId: Scalars['Int'];
  limit: Scalars['Float'];
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};


export type QueryPaginatedPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Float'];
};


export type QueryIsValidResetPasswordTokenArgs = {
  token: Scalars['String'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};


export type QueryPaginatedUsersArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Float'];
};

export type RegisterInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

export type TestResponse = {
  __typename?: 'TestResponse';
  message: Scalars['String'];
  version: Scalars['String'];
};

export type ToggleOnline = {
  __typename?: 'ToggleOnline';
  onlineStatus: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  displayName: Scalars['String'];
  password: Scalars['String'];
  role: Role;
  onlineStatus: Scalars['Boolean'];
  isVisible: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  avatar_url?: Maybe<Scalars['String']>;
  cover_url?: Maybe<Scalars['String']>;
  isEmailVerfied: Scalars['Boolean'];
  posts: Array<Post>;
};

export type UserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'displayName' | 'role' | 'createdAt' | 'updatedAt' | 'isEmailVerfied'>
);

export type MeFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'displayName' | 'role' | 'isEmailVerfied'>
);

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ConfirmEmailMutation = (
  { __typename?: 'Mutation' }
  & { confirmEmail: (
    { __typename?: 'User' }
    & MeFragment
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type IsValidResetPasswordTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type IsValidResetPasswordTokenQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isValidResetPasswordToken'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'User' }
    & MeFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'User' }
    & MeFragment
  ) }
);

export type CreateUserMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  role?: Maybe<Scalars['String']>;
  sendEmail?: Maybe<Scalars['Boolean']>;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type EditUserMutationVariables = Exact<{
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  role?: Maybe<Scalars['String']>;
  id: Scalars['String'];
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser: (
    { __typename?: 'User' }
    & UserFragment
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & MeFragment
  )> }
);

export type PaginatedUsersQueryVariables = Exact<{
  limit: Scalars['Float'];
  cursor: Scalars['String'];
}>;


export type PaginatedUsersQuery = (
  { __typename?: 'Query' }
  & { paginatedUsers: (
    { __typename?: 'PaginatedUsers' }
    & Pick<PaginatedUsers, 'hasMore'>
    & { users: Array<(
      { __typename?: 'User' }
      & MeFragment
    )> }
  ) }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & UserFragment
  )> }
);

export const UserFragmentDoc = gql`
    fragment User on User {
  id
  email
  firstName
  lastName
  displayName
  role
  createdAt
  updatedAt
  isEmailVerfied
}
    `;
export const MeFragmentDoc = gql`
    fragment Me on User {
  id
  firstName
  lastName
  email
  displayName
  role
  isEmailVerfied
}
    `;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($token: String!) {
  confirmEmail(token: $token) {
    ...Me
  }
}
    ${MeFragmentDoc}`;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const IsValidResetPasswordTokenDocument = gql`
    query IsValidResetPasswordToken($token: String!) {
  isValidResetPasswordToken(token: $token)
}
    `;

/**
 * __useIsValidResetPasswordTokenQuery__
 *
 * To run a query within a React component, call `useIsValidResetPasswordTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsValidResetPasswordTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsValidResetPasswordTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useIsValidResetPasswordTokenQuery(baseOptions: Apollo.QueryHookOptions<IsValidResetPasswordTokenQuery, IsValidResetPasswordTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsValidResetPasswordTokenQuery, IsValidResetPasswordTokenQueryVariables>(IsValidResetPasswordTokenDocument, options);
      }
export function useIsValidResetPasswordTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsValidResetPasswordTokenQuery, IsValidResetPasswordTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsValidResetPasswordTokenQuery, IsValidResetPasswordTokenQueryVariables>(IsValidResetPasswordTokenDocument, options);
        }
export type IsValidResetPasswordTokenQueryHookResult = ReturnType<typeof useIsValidResetPasswordTokenQuery>;
export type IsValidResetPasswordTokenLazyQueryHookResult = ReturnType<typeof useIsValidResetPasswordTokenLazyQuery>;
export type IsValidResetPasswordTokenQueryResult = Apollo.QueryResult<IsValidResetPasswordTokenQuery, IsValidResetPasswordTokenQueryVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(options: {usernameOrEmail: $usernameOrEmail, password: $password}) {
    ...Me
  }
}
    ${MeFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(token: $token, newPassword: $newPassword) {
    ...Me
  }
}
    ${MeFragmentDoc}`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($email: String!, $password: String!, $firstName: String!, $lastName: String!, $displayName: String, $username: String!, $role: String, $sendEmail: Boolean) {
  createUser(
    options: {email: $email, password: $password, firstName: $firstName, lastName: $lastName, displayName: $displayName, role: $role, sendEmail: $sendEmail, username: $username}
  ) {
    ...User
  }
}
    ${UserFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      displayName: // value for 'displayName'
 *      username: // value for 'username'
 *      role: // value for 'role'
 *      sendEmail: // value for 'sendEmail'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: String!) {
  deleteUser(id: $id) {
    ...User
  }
}
    ${UserFragmentDoc}`;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const EditUserDocument = gql`
    mutation EditUser($email: String, $firstName: String, $lastName: String, $displayName: String, $username: String!, $role: String, $id: String!) {
  editUser(
    id: $id
    data: {email: $email, firstName: $firstName, lastName: $lastName, displayName: $displayName, username: $username, role: $role}
  ) {
    ...User
  }
}
    ${UserFragmentDoc}`;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      displayName: // value for 'displayName'
 *      username: // value for 'username'
 *      role: // value for 'role'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...Me
  }
}
    ${MeFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PaginatedUsersDocument = gql`
    query PaginatedUsers($limit: Float!, $cursor: String!) {
  paginatedUsers(limit: $limit, cursor: $cursor) {
    users {
      ...Me
    }
    hasMore
  }
}
    ${MeFragmentDoc}`;

/**
 * __usePaginatedUsersQuery__
 *
 * To run a query within a React component, call `usePaginatedUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaginatedUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaginatedUsersQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePaginatedUsersQuery(baseOptions: Apollo.QueryHookOptions<PaginatedUsersQuery, PaginatedUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PaginatedUsersQuery, PaginatedUsersQueryVariables>(PaginatedUsersDocument, options);
      }
export function usePaginatedUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PaginatedUsersQuery, PaginatedUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PaginatedUsersQuery, PaginatedUsersQueryVariables>(PaginatedUsersDocument, options);
        }
export type PaginatedUsersQueryHookResult = ReturnType<typeof usePaginatedUsersQuery>;
export type PaginatedUsersLazyQueryHookResult = ReturnType<typeof usePaginatedUsersLazyQuery>;
export type PaginatedUsersQueryResult = Apollo.QueryResult<PaginatedUsersQuery, PaginatedUsersQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...User
  }
}
    ${UserFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;