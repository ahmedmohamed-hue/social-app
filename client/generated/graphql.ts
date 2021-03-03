import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

export type Query = {
  __typename?: 'Query';
  postByUser: Array<Post>;
  post?: Maybe<Post>;
  paginatedPosts: PaginatedPosts;
  user?: Maybe<User>;
  users: Array<User>;
  comments: Array<Comment>;
  paginatedComments: PaginatedComments;
  currentUser?: Maybe<User>;
  isValidRestoreToken: Scalars['Boolean'];
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};


export type QueryPaginatedPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Float'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};


export type QueryCommentsArgs = {
  postId: Scalars['Int'];
};


export type QueryPaginatedCommentsArgs = {
  cursor?: Maybe<Scalars['String']>;
  postId: Scalars['Int'];
  limit: Scalars['Float'];
};


export type QueryIsValidRestoreTokenArgs = {
  token: Scalars['String'];
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


export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  role: Scalars['String'];
  onlineStatus: Scalars['Boolean'];
  isVisible: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  avatar_url?: Maybe<Scalars['String']>;
  cover_url?: Maybe<Scalars['String']>;
  isEmailVerfied: Scalars['Boolean'];
  posts: Array<Post>;
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

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  posts: Array<Post>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedComments = {
  __typename?: 'PaginatedComments';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deletePost: Scalars['Boolean'];
  like?: Maybe<LikeResponse>;
  toggleStatus?: Maybe<ToggleOnline>;
  addAvatar: Scalars['String'];
  addCover: Scalars['String'];
  removeCover: Scalars['Boolean'];
  removeAvatar: Scalars['Boolean'];
  addComment: Comment;
  removeComment: Scalars['Boolean'];
  register: User;
  login?: Maybe<User>;
  logout: Scalars['Boolean'];
  confirmEmail: User;
  forgotPassword: Scalars['Boolean'];
  changePassword: User;
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


export type MutationAddAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationAddCoverArgs = {
  file: Scalars['Upload'];
};


export type MutationAddCommentArgs = {
  postId: Scalars['Int'];
  commnet: Scalars['String'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['Int'];
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type PostInput = {
  title: Scalars['String'];
  body: Scalars['String'];
};

export type LikeResponse = {
  __typename?: 'LikeResponse';
  likes: Array<User>;
  likeStatus: Scalars['Boolean'];
};

export type ToggleOnline = {
  __typename?: 'ToggleOnline';
  onlineStatus: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
};


export type RegisterInput = {
  email: Scalars['String'];
  username: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type CurrentUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'username' | 'onlineStatus' | 'lastSeen' | 'avatar_url' | 'cover_url'>
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'firstName' | 'lastName' | 'username' | 'onlineStatus' | 'lastSeen' | 'avatar_url' | 'cover_url'>
);

export type AddAvatarMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type AddAvatarMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addAvatar'>
);

export type AddCommentMutationVariables = Exact<{
  postId: Scalars['Int'];
  comment: Scalars['String'];
}>;


export type AddCommentMutation = (
  { __typename?: 'Mutation' }
  & { addComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'comment' | 'createdAt' | 'owner'>
    & { creator: (
      { __typename?: 'User' }
      & RegularUserFragment
    ) }
  ) }
);

export type AddCoverMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type AddCoverMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addCover'>
);

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  body: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'title' | 'createdAt' | 'creatorId' | 'owner' | 'likeStatus'>
    & { likes?: Maybe<Array<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>>, creator: (
      { __typename?: 'User' }
      & Pick<User, 'username' | 'firstName' | 'lastName'>
    ) }
  ) }
);

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type LikeMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type LikeMutation = (
  { __typename?: 'Mutation' }
  & { like?: Maybe<(
    { __typename?: 'LikeResponse' }
    & Pick<LikeResponse, 'likeStatus'>
    & { likes: Array<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  )> }
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'username' | 'onlineStatus' | 'lastSeen' | 'avatar_url'>
  )> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'username' | 'onlineStatus' | 'lastSeen' | 'avatar_url'>
  ) }
);

export type RemoveAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveAvatarMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeAvatar'>
);

export type RemoveCommentMutationVariables = Exact<{
  commentId: Scalars['Int'];
}>;


export type RemoveCommentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeComment'>
);

export type RemoveCoverMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveCoverMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeCover'>
);

export type ToggleStatusMutationVariables = Exact<{ [key: string]: never; }>;


export type ToggleStatusMutation = (
  { __typename?: 'Mutation' }
  & { toggleStatus?: Maybe<(
    { __typename?: 'ToggleOnline' }
    & Pick<ToggleOnline, 'onlineStatus' | 'lastSeen'>
  )> }
);

export type CommentsQueryVariables = Exact<{
  limit: Scalars['Float'];
  cursor?: Maybe<Scalars['String']>;
  postId: Scalars['Int'];
}>;


export type CommentsQuery = (
  { __typename?: 'Query' }
  & { paginatedComments: (
    { __typename?: 'PaginatedComments' }
    & Pick<PaginatedComments, 'hasMore'>
    & { comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'comment' | 'createdAt' | 'id' | 'owner'>
      & { creator: (
        { __typename?: 'User' }
        & RegularUserFragment
      ) }
    )> }
  ) }
);

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & CurrentUserFragment
  )> }
);

export type IsValidRestoreTokenQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type IsValidRestoreTokenQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'isValidRestoreToken'>
);

export type PostQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { post?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'title' | 'createdAt' | 'creatorId' | 'owner' | 'likeStatus'>
    & { likes?: Maybe<Array<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>>, creator: (
      { __typename?: 'User' }
      & RegularUserFragment
    ), comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'comment' | 'createdAt' | 'owner'>
      & { creator: (
        { __typename?: 'User' }
        & RegularUserFragment
      ) }
    )>> }
  )> }
);

export type PostsQueryVariables = Exact<{
  limit: Scalars['Float'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { paginatedPosts: (
    { __typename?: 'PaginatedPosts' }
    & Pick<PaginatedPosts, 'hasMore'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'body' | 'title' | 'createdAt' | 'creatorId' | 'owner' | 'likeStatus'>
      & { likes?: Maybe<Array<(
        { __typename?: 'User' }
        & RegularUserFragment
      )>>, creator: (
        { __typename?: 'User' }
        & RegularUserFragment
      ), comments?: Maybe<Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'id' | 'comment' | 'createdAt' | 'owner'>
        & { creator: (
          { __typename?: 'User' }
          & RegularUserFragment
        ) }
      )>> }
    )> }
  ) }
);

export type UserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & { posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'body' | 'title' | 'createdAt' | 'creatorId' | 'owner' | 'likeStatus'>
      & { likes?: Maybe<Array<(
        { __typename?: 'User' }
        & RegularUserFragment
      )>>, creator: (
        { __typename?: 'User' }
        & RegularUserFragment
      ), comments?: Maybe<Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'comment' | 'createdAt'>
        & { creator: (
          { __typename?: 'User' }
          & RegularUserFragment
        ) }
      )>> }
    )> }
    & RegularUserFragment
  )> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export const CurrentUserFragmentDoc = gql`
    fragment CurrentUser on User {
  id
  firstName
  lastName
  email
  username
  onlineStatus
  lastSeen
  avatar_url
  cover_url
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  firstName
  lastName
  username
  onlineStatus
  lastSeen
  avatar_url
  cover_url
}
    `;
export const AddAvatarDocument = gql`
    mutation addAvatar($file: Upload!) {
  addAvatar(file: $file)
}
    `;
export type AddAvatarMutationFn = Apollo.MutationFunction<AddAvatarMutation, AddAvatarMutationVariables>;

/**
 * __useAddAvatarMutation__
 *
 * To run a mutation, you first call `useAddAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAvatarMutation, { data, loading, error }] = useAddAvatarMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useAddAvatarMutation(baseOptions?: Apollo.MutationHookOptions<AddAvatarMutation, AddAvatarMutationVariables>) {
        return Apollo.useMutation<AddAvatarMutation, AddAvatarMutationVariables>(AddAvatarDocument, baseOptions);
      }
export type AddAvatarMutationHookResult = ReturnType<typeof useAddAvatarMutation>;
export type AddAvatarMutationResult = Apollo.MutationResult<AddAvatarMutation>;
export type AddAvatarMutationOptions = Apollo.BaseMutationOptions<AddAvatarMutation, AddAvatarMutationVariables>;
export const AddCommentDocument = gql`
    mutation addComment($postId: Int!, $comment: String!) {
  addComment(postId: $postId, commnet: $comment) {
    id
    comment
    createdAt
    owner
    creator {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type AddCommentMutationFn = Apollo.MutationFunction<AddCommentMutation, AddCommentMutationVariables>;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCommentMutation, { data, loading, error }] = useAddCommentMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useAddCommentMutation(baseOptions?: Apollo.MutationHookOptions<AddCommentMutation, AddCommentMutationVariables>) {
        return Apollo.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, baseOptions);
      }
export type AddCommentMutationHookResult = ReturnType<typeof useAddCommentMutation>;
export type AddCommentMutationResult = Apollo.MutationResult<AddCommentMutation>;
export type AddCommentMutationOptions = Apollo.BaseMutationOptions<AddCommentMutation, AddCommentMutationVariables>;
export const AddCoverDocument = gql`
    mutation addCover($file: Upload!) {
  addCover(file: $file)
}
    `;
export type AddCoverMutationFn = Apollo.MutationFunction<AddCoverMutation, AddCoverMutationVariables>;

/**
 * __useAddCoverMutation__
 *
 * To run a mutation, you first call `useAddCoverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCoverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCoverMutation, { data, loading, error }] = useAddCoverMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useAddCoverMutation(baseOptions?: Apollo.MutationHookOptions<AddCoverMutation, AddCoverMutationVariables>) {
        return Apollo.useMutation<AddCoverMutation, AddCoverMutationVariables>(AddCoverDocument, baseOptions);
      }
export type AddCoverMutationHookResult = ReturnType<typeof useAddCoverMutation>;
export type AddCoverMutationResult = Apollo.MutationResult<AddCoverMutation>;
export type AddCoverMutationOptions = Apollo.BaseMutationOptions<AddCoverMutation, AddCoverMutationVariables>;
export const CreatePostDocument = gql`
    mutation createPost($title: String!, $body: String!) {
  createPost(options: {title: $title, body: $body}) {
    id
    body
    title
    createdAt
    creatorId
    owner
    likes {
      ...RegularUser
    }
    likeStatus
    creator {
      username
      firstName
      lastName
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      title: // value for 'title'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, baseOptions);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation deletePost($id: Int!) {
  deletePost(id: $id)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, baseOptions);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const LikeDocument = gql`
    mutation like($postId: Float!) {
  like(postId: $postId) {
    likeStatus
    likes {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type LikeMutationFn = Apollo.MutationFunction<LikeMutation, LikeMutationVariables>;

/**
 * __useLikeMutation__
 *
 * To run a mutation, you first call `useLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMutation, { data, loading, error }] = useLikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useLikeMutation(baseOptions?: Apollo.MutationHookOptions<LikeMutation, LikeMutationVariables>) {
        return Apollo.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument, baseOptions);
      }
export type LikeMutationHookResult = ReturnType<typeof useLikeMutation>;
export type LikeMutationResult = Apollo.MutationResult<LikeMutation>;
export type LikeMutationOptions = Apollo.BaseMutationOptions<LikeMutation, LikeMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    id
    firstName
    lastName
    email
    username
    onlineStatus
    lastSeen
    avatar_url
  }
}
    `;
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
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
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
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation register($firstName: String!, $lastName: String!, $username: String!, $password: String!, $email: String!) {
  register(
    options: {firstName: $firstName, lastName: $lastName, username: $username, password: $password, email: $email}
  ) {
    id
    firstName
    lastName
    email
    username
    onlineStatus
    lastSeen
    avatar_url
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RemoveAvatarDocument = gql`
    mutation removeAvatar {
  removeAvatar
}
    `;
export type RemoveAvatarMutationFn = Apollo.MutationFunction<RemoveAvatarMutation, RemoveAvatarMutationVariables>;

/**
 * __useRemoveAvatarMutation__
 *
 * To run a mutation, you first call `useRemoveAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAvatarMutation, { data, loading, error }] = useRemoveAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveAvatarMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAvatarMutation, RemoveAvatarMutationVariables>) {
        return Apollo.useMutation<RemoveAvatarMutation, RemoveAvatarMutationVariables>(RemoveAvatarDocument, baseOptions);
      }
export type RemoveAvatarMutationHookResult = ReturnType<typeof useRemoveAvatarMutation>;
export type RemoveAvatarMutationResult = Apollo.MutationResult<RemoveAvatarMutation>;
export type RemoveAvatarMutationOptions = Apollo.BaseMutationOptions<RemoveAvatarMutation, RemoveAvatarMutationVariables>;
export const RemoveCommentDocument = gql`
    mutation RemoveComment($commentId: Int!) {
  removeComment(commentId: $commentId)
}
    `;
export type RemoveCommentMutationFn = Apollo.MutationFunction<RemoveCommentMutation, RemoveCommentMutationVariables>;

/**
 * __useRemoveCommentMutation__
 *
 * To run a mutation, you first call `useRemoveCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCommentMutation, { data, loading, error }] = useRemoveCommentMutation({
 *   variables: {
 *      commentId: // value for 'commentId'
 *   },
 * });
 */
export function useRemoveCommentMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCommentMutation, RemoveCommentMutationVariables>) {
        return Apollo.useMutation<RemoveCommentMutation, RemoveCommentMutationVariables>(RemoveCommentDocument, baseOptions);
      }
export type RemoveCommentMutationHookResult = ReturnType<typeof useRemoveCommentMutation>;
export type RemoveCommentMutationResult = Apollo.MutationResult<RemoveCommentMutation>;
export type RemoveCommentMutationOptions = Apollo.BaseMutationOptions<RemoveCommentMutation, RemoveCommentMutationVariables>;
export const RemoveCoverDocument = gql`
    mutation removeCover {
  removeCover
}
    `;
export type RemoveCoverMutationFn = Apollo.MutationFunction<RemoveCoverMutation, RemoveCoverMutationVariables>;

/**
 * __useRemoveCoverMutation__
 *
 * To run a mutation, you first call `useRemoveCoverMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveCoverMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeCoverMutation, { data, loading, error }] = useRemoveCoverMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveCoverMutation(baseOptions?: Apollo.MutationHookOptions<RemoveCoverMutation, RemoveCoverMutationVariables>) {
        return Apollo.useMutation<RemoveCoverMutation, RemoveCoverMutationVariables>(RemoveCoverDocument, baseOptions);
      }
export type RemoveCoverMutationHookResult = ReturnType<typeof useRemoveCoverMutation>;
export type RemoveCoverMutationResult = Apollo.MutationResult<RemoveCoverMutation>;
export type RemoveCoverMutationOptions = Apollo.BaseMutationOptions<RemoveCoverMutation, RemoveCoverMutationVariables>;
export const ToggleStatusDocument = gql`
    mutation toggleStatus {
  toggleStatus {
    onlineStatus
    lastSeen
  }
}
    `;
export type ToggleStatusMutationFn = Apollo.MutationFunction<ToggleStatusMutation, ToggleStatusMutationVariables>;

/**
 * __useToggleStatusMutation__
 *
 * To run a mutation, you first call `useToggleStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleStatusMutation, { data, loading, error }] = useToggleStatusMutation({
 *   variables: {
 *   },
 * });
 */
export function useToggleStatusMutation(baseOptions?: Apollo.MutationHookOptions<ToggleStatusMutation, ToggleStatusMutationVariables>) {
        return Apollo.useMutation<ToggleStatusMutation, ToggleStatusMutationVariables>(ToggleStatusDocument, baseOptions);
      }
export type ToggleStatusMutationHookResult = ReturnType<typeof useToggleStatusMutation>;
export type ToggleStatusMutationResult = Apollo.MutationResult<ToggleStatusMutation>;
export type ToggleStatusMutationOptions = Apollo.BaseMutationOptions<ToggleStatusMutation, ToggleStatusMutationVariables>;
export const CommentsDocument = gql`
    query Comments($limit: Float!, $cursor: String, $postId: Int!) {
  paginatedComments(limit: $limit, cursor: $cursor, postId: $postId) {
    comments {
      comment
      createdAt
      id
      owner
      creator {
        ...RegularUser
      }
    }
    hasMore
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useCommentsQuery__
 *
 * To run a query within a React component, call `useCommentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCommentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCommentsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useCommentsQuery(baseOptions: Apollo.QueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
        return Apollo.useQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
      }
export function useCommentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CommentsQuery, CommentsQueryVariables>) {
          return Apollo.useLazyQuery<CommentsQuery, CommentsQueryVariables>(CommentsDocument, baseOptions);
        }
export type CommentsQueryHookResult = ReturnType<typeof useCommentsQuery>;
export type CommentsLazyQueryHookResult = ReturnType<typeof useCommentsLazyQuery>;
export type CommentsQueryResult = Apollo.QueryResult<CommentsQuery, CommentsQueryVariables>;
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    ...CurrentUser
  }
}
    ${CurrentUserFragmentDoc}`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, baseOptions);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const IsValidRestoreTokenDocument = gql`
    query isValidRestoreToken($token: String!) {
  isValidRestoreToken(token: $token)
}
    `;

/**
 * __useIsValidRestoreTokenQuery__
 *
 * To run a query within a React component, call `useIsValidRestoreTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsValidRestoreTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsValidRestoreTokenQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useIsValidRestoreTokenQuery(baseOptions: Apollo.QueryHookOptions<IsValidRestoreTokenQuery, IsValidRestoreTokenQueryVariables>) {
        return Apollo.useQuery<IsValidRestoreTokenQuery, IsValidRestoreTokenQueryVariables>(IsValidRestoreTokenDocument, baseOptions);
      }
export function useIsValidRestoreTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsValidRestoreTokenQuery, IsValidRestoreTokenQueryVariables>) {
          return Apollo.useLazyQuery<IsValidRestoreTokenQuery, IsValidRestoreTokenQueryVariables>(IsValidRestoreTokenDocument, baseOptions);
        }
export type IsValidRestoreTokenQueryHookResult = ReturnType<typeof useIsValidRestoreTokenQuery>;
export type IsValidRestoreTokenLazyQueryHookResult = ReturnType<typeof useIsValidRestoreTokenLazyQuery>;
export type IsValidRestoreTokenQueryResult = Apollo.QueryResult<IsValidRestoreTokenQuery, IsValidRestoreTokenQueryVariables>;
export const PostDocument = gql`
    query Post($id: Float!) {
  post(id: $id) {
    id
    body
    title
    createdAt
    creatorId
    owner
    likeStatus
    likes {
      ...RegularUser
    }
    creator {
      ...RegularUser
    }
    comments {
      id
      comment
      createdAt
      owner
      creator {
        ...RegularUser
      }
    }
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePostQuery(baseOptions: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>) {
        return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, baseOptions);
      }
export function usePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, baseOptions);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const PostsDocument = gql`
    query Posts($limit: Float!, $cursor: String) {
  paginatedPosts(limit: $limit, cursor: $cursor) {
    posts {
      id
      body
      title
      createdAt
      creatorId
      owner
      likeStatus
      likes {
        ...RegularUser
      }
      creator {
        ...RegularUser
      }
      comments {
        id
        comment
        createdAt
        owner
        creator {
          ...RegularUser
        }
      }
    }
    hasMore
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function usePostsQuery(baseOptions: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, baseOptions);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, baseOptions);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const UserDocument = gql`
    query User($username: String!) {
  user(username: $username) {
    ...RegularUser
    posts {
      id
      body
      title
      createdAt
      creatorId
      owner
      likeStatus
      likes {
        ...RegularUser
      }
      creator {
        ...RegularUser
      }
      comments {
        comment
        createdAt
        creator {
          ...RegularUser
        }
      }
    }
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

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
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;