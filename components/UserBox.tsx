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
        <button className="bg-gray-200 px-3 py-1 flex gap-3 items-center rounded-lg hover:bg-blue-400" onClick={handleClick}>
            <img src={picture} className='rounded-full object-fill w-7 h-7' alt="profile" />
            <span>
                <p className="font-medium text-lg capitalize">{name || 'John Doe'}</p>
                <p className={isOnline ? 'text-green-500 -mt-1 text-sm font-mono font-semibold' : ''}>{isOnline ? 'Online' : ''}</p>
            </span>
        </button>
    )
}

export default UserBox