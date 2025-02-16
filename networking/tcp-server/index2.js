import net from "node:net";

const clients = new Map();
let messageCount = 0;
const MAX_MESSAGE_LENGTH = 200; 

const server = net.createServer((socket) => {
    console.log("client connected :");
    console.log(`Total connected client ${clients.sizen}\n`);

    socket.write("Welcome to the Nikhil TCP chat~ \n");
    socket.write("Please enter you Name: \n");

    let userName = '';

    socket.on("data", (chunk) => {
        const message = chunk.toString().trim();

        if (!userName) {
            userName = message;
            clients.set(socket, userName);
            console.log(`User connected as: ${userName}`);
            socket.write(`Hello ${userName}, you can now send messages!\n`);
            return;
        }
        
        if (message.length > MAX_MESSAGE_LENGTH) {
            socket.write("Error: Message is too long. Limit is 200 characters.\n");
            return;
        }

        messageCount++;
        console.log(`Total messages sent: ${messageCount}`);


        clients.forEach((name, client) => {
            if (client !== socket) {
                client.write(`${userName}: ${message}\n`);
            }
        });


        socket.on("end", () => {
        console.log(`${userName} disconnected.`);
        clients.delete(socket);
        console.log(`Total connected clients: ${clients.size}`);
        })


        socket.on("error", (err) => {
            console.log("Err :", err); 
        });
    });
});

server.listen(6969,() => {
    console.log(`Server listing on 6969:`);
})