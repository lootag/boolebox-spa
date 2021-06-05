export const pcConfig = {
    'iceServers' : [ {
        'urls' : 'stun:stun1.l.google.com:19302'
    } ]
};

export const sdpConstrains = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false 
};

export const mediaConstraints = {
    video: true,
    audio: true
};

export const localVideoId = "localVideo";

export const websocketUrl = "ws://52.232.122.122:5080/WebRTCAppEE/websocket";

export const debug = true;

export const bandwidth = 1000;
