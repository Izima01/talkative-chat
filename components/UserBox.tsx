import OnlineIndicator from "./OnlineIndicator";

type propTypes = {
    picture?: string,
    name?: string,
    isOnline?: boolean,
    id: string,
    handleClick?: (user?: Record<string, any>) => void
}

const UserBox = (props: propTypes) => {
    const { picture, isOnline, name, handleClick } = props;

    return (
        <button className="bg-gray-200 px-3 py-1.5 flex gap-4 items-center rounded-lg hover:bg-blue-400" onClick={handleClick}>
            <img src={picture} className='rounded-full object-fill w-10 h-10' alt="profile" />
            <span>
                <p className="font-medium text-lg capitalize">{name || 'John Doe'}</p>
                <p className={isOnline ? 'text-green-500 -mt-1 text-sm font-mono font-semibold' : ''}>{isOnline ? 'Online' : ''}</p>
            </span>
            { isOnline && <OnlineIndicator /> }
        </button>
    )
}

export default UserBox