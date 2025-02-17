import net from "node:net";

const clients = [];

const server = net.createServer((socket) => {
    console.log("client connected :");

    socket.setEncoding('utf-8');
    socket.authenticated = false;
    socket.joined = false;
    socket.username = '';

    clients.push(socket);

    socket.on('data', (data) => {
        // parse the message

        const parsedMessage = parseMessage(data);

        if (!parseMessage) {
            console.error("Inavalid message format");
            return;
        };

        handleMessage(socket,parsedMessage)

    });

        socket.on('end', () => {
            console.log('Client disconnected!');
        })


        socket.on("error", (err) => {
            console.log("Err :", err); 
        });
});

server.listen(1337, () => {
    console.log(`Server listing on 1337:`);
});


function handleMessage(parseMessage,socket) {
    switch (parseMsg.command) {
        case "AUTH":
            handleAuth(socket, parseMessage);
            break;
        // case "JOIN":
    }
}

function handleAuth(socket, parseMessage) {
    const user = parseMessage.headers['User'];
    const token = parseMessage.headers["Token"];

    // todo:move secert to someWhere in DB , don't hard code
    if (user && token && token === 'secert123') {
        socket.authenticated = true;
        socket.username = user.username;

        socket.write(formatResponse('OK','AUTH',{'content-length' : 0},''));
    }
}

function formatResponse(reponseFor, command, headers, body, user) {
    const startLine = `CHAR/1.0 ${command}`;
    const headerLines = [];
    headerLines.push(`Response-For: ${reponseFor}`);

    if (user) {
        headerLines.push(`User: ${user}`);
    };

    for (const key in headers) {
        headerLines.push(`${key}: ${headers[key]}`);
    };

    return `${startLine}\r\n${headerLines.join('\r\n')}\r\n\r\n${body}`
}


function parseMessage(msg) {
    console.log('msg', msg);
    const parts = msg.split('\r\n\r\n');
    if (parts.length < 2) return null; // Missing body

    const headerPart = parts[0];
    const body = parts[1];

    const headerLine = headerPart.split('\r\n');

    if (headerLine.length === 0) return null;
    const firstLine = headerLine[0].split(' ');
    if (firstLine.length < 2) return null;

    const protocolVersion = firstLine[0];
    const command = firstLine[1];

    const headers = {};
    const contentLength = 0;

    for (let i = 1; i < headerLine.length; i++){
        const line = headerLine[i];
        const pair = line.split(":");
        headers[pair[0].trim()] = pair[1].trim();

        if (pair[0].trim().toLowerCase() === 'content-length') {
            contentLength = parseInt(pair[1].trim(), 10);
        };

        // optional check

        if (body.length !== contentLength) {
            console.warn(`Warning body length ${body.length} does not mach content length headers`);
        };

        return {protocolVersion,command,headers,body}
    }




}