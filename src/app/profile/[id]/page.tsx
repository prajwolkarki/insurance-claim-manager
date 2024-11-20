export default async function UserProfile({ params }: { params: { id: string } }) {
    const { id } = await params;

    return (
        <div>
            <h1>User Profile Page</h1>
            <p>User ID: {id}</p>
        </div>
    );
}
