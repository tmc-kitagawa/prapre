import type { FC } from 'react'

const Signout: FC = () => {
    return (
        <>
            <form action="/logout" method="post">
                <button>signout</button>
            </form>
        </>
    )
}
export default Signout;