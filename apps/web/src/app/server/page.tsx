import { api } from '~/trpc/server'
// import CreatePost from './create-post'

export const runtime = 'edge'

export default async function Page() {
    // const posts = await api.posts.list()

    return (
        <main>
            <h1>Posts</h1>
            {/* <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.name}</li>
                ))}
            </ul>
            <CreatePost /> */}
        </main>
    )
}
