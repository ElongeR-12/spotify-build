import { atom } from "recoil";
export const currentTrackIdState = atom({
    key: "currentTrackIdState", //unique ID (with respect to ohers atoms selectores)
    default: null,// default value 
})

export const isPlayingState = atom({
    key: "isPlayingState",
    default: false, 
})