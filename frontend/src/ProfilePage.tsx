

export default function ProfilePage({ user, loggedIn }: {
    loggedIn: boolean,
    user: string,
}) {
    console.log(loggedIn)
    console.log(user)

    return (
        <>
            <p>Hello, {user}!</p>
        </>
    )
}