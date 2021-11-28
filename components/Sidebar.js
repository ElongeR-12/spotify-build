import React from 'react'
import {HeartIcon, HomeIcon, LibraryIcon, PlusCircleIcon, RssIcon, SearchIcon} from "@heroicons/react/outline"
import { signOut, useSession } from 'next-auth/react'
const Sidebar = () => {
    const {data:session, status} = useSession()
    console.log("the session",session);
    return (
        <div className="text-gray-500 p-5 text-sm border-gray-900 overflow-y-scroll h-screen scrollbar-hide">
            <div className="space-y-4">
            <button onClick={()=>signOut()} className="flex items-center space-x-2 hover:text-white">
                    <p>Lougout</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HomeIcon
                        className="h-5 w-5"
                    />
                    <p>Home</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <SearchIcon
                        className="h-5 w-5"
                    />
                    <p>Search</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <LibraryIcon
                        className="h-5 w-5"
                    />
                    <p>Your Library</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <button className="flex items-center space-x-2 hover:text-white">
                    <PlusCircleIcon
                        className="h-5 w-5"
                    />
                    <p>Liked songs</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <HeartIcon
                        className="h-5 w-5"
                    />
                    <p>Create playlist</p>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <RssIcon
                        className="h-5 w-5"
                    />
                    <p>Your episodes</p>
                </button>
                <hr className="border-t-[0.1px] border-gray-900"/>
                <p className="cursor-pointer hover:text-white">
                    Playlist
                </p>
                <p className="cursor-pointer hover:text-white">
                    Playlist
                </p>
                <p className="cursor-pointer hover:text-white">
                    Playlist
                </p>
                <p className="cursor-pointer hover:text-white">
                    Playlist
                </p>
                <p className="cursor-pointer hover:text-white">
                    Playlist
                </p>
            </div>
        </div>
    )
}

export default Sidebar
