'use client'
// import CreatePost from '~/app/client/create-post'
import { api } from '~/trpc/react'

export const runtime = 'edge'

export default function Page() {
    // const { data: posts, isLoading } = api.posts.list.useQuery(undefined)

    return (
        <main>
            <h1>Posts</h1>
            {/* {isLoading && <p>Loading...</p>}
            <ul>
                {posts?.map((post) => (
                    <li key={post.id}>{post.name}</li>
                ))}
            </ul>
            <CreatePost /> */}
        </main>
    )
}
