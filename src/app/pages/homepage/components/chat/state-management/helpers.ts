export function distinct<T>(item: T, index: number, array: T[]): boolean { 
    return array.indexOf(item) === index;
}

export function receiveOnlineParticipants() { 

}

export function scrollChatBarToTheBottom() {
    let messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
}


