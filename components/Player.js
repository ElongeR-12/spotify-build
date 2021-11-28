import {PauseIcon, VolumeOffIcon,  VolumeUpIcon, FastForwardIcon, ReplyIcon, PlayIcon, SwitchHorizontalIcon, RewindIcon } from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'

const Player = () => {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying]= useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);
    const songInfo = useSongInfo();
    const fetchCurrentSong = () =>{
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data=>{
                // console.log("now playing>>>>", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then(data=>{
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }
    const handlePlayPause = () =>{
        spotifyApi.getMyCurrentPlaybackState().then(data=>{
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else{
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }
    useEffect(()=>{
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong(); 
            setVolume(50) 
        }
    },[currentTrackId, spotifyApi, session])

    useEffect(()=>{
        if(volume  > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }
    },[volume])
    const debouncedAdjustVolume = useCallback(
        debounce(volume=>{
            spotifyApi.setVolume(volume).catch((err)=>{})
        }, 500),[])
    return (
        <div className="grid grid-cols-3 h24 bg-gradient-to-b from-black to-gray-900 text-white text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                {
                    songInfo && (
                        <>
                            <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0].url} alt="" />
                            <div>
                                <h3>{songInfo?.name}</h3>
                                <p>{songInfo?.artists?.[0]?.name}</p>
                            </div>
                        </>
                    )
                }
            </div>
            <div className="flex justify-evenly items-center">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon className="button"/>
                {
                    isPlaying ? (
                        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                    ) : (
                        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                    )
                }
                <FastForwardIcon className="button"/>
                <ReplyIcon className="button"/>
            </div>
            <div className="flex justify-end items-center pr-5">
                <VolumeOffIcon onClick={()=> volume > 0 && setVolume(volume - 10)} className="button"/>
                <input 
                    className="w-14 md:w-20" 
                    type="range" 
                    min={0} 
                    max={100}
                    value={volume}
                    onChange={e=> setVolume(Number(e.target.value))}
                />
                <VolumeUpIcon onClick={()=> volume < 100 && setVolume(volume + 10)} className="button"/>
            </div>
        </div>
    )
}

export default Player
