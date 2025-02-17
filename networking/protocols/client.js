import readline from "node:readline/promises";
import net from "node:net";



const HOST = 'localhost';
const PORT = 1337;

async function startChat() {
    // User Interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ">"
    });

    const client = net.createServer({
        host: HOST,
        port: PORT
    }, () => {
        console.log("Connection create!");
    });

    // Auth

    // Get username
    const username = await rl.question("Enter usernamr: ");

    // Get Token
    const token = await rl.question("Enter Token: ");

    // Prepare auth command 
    const authCommand = buildCommand('AUTH', { User: username, Token: token, 'content-length': 0 }, '');

    client.write(authCommand);

    client.on('data', (data) => {
        console.log("Received:",data.toString());
    })
};

function buildCommand(command, headers, body) {
    const startLine = `CHAT/1.0 ${command}`;
    
    const headersLine = [];

    for (const key in headers) {
        const header = `${key}:${headers[key]}`;
        headersLine.push(header);
    };

    return `${startLine}\r\n${headersLine.join('\r\n')}\r\n\r\n${body}`;
}

startChat();