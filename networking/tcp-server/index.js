import net from "node:net";

const clients = [];
let messageCount;

const server = net.createServer((socket) => {
    console.log("client connected :");

    clients.push(socket);

    console.log(`Total connected client ${clients.length}\n`);

    socket.write("Welcome to the Nikhil TCP chat~ \n");
    socket.write("Type your message and enter to broadcaste \n");

    socket.on("data", (chunk) => {
        const message = chunk.toString().trim();
        messageCount++;
        console.log(`Total number message are: ${messageCount}`);
        

        clients.forEach((client) => {
            client.write(`Clinet Say : ${message}\n`);
        });


        socket.on("end", () => {
            const index = clients.indexOf(socket);
            clients.slice(index, 1);
            console.log("A client Disconnected!");
            console.log(`Total connected client ${clients.length}\n`);
        })


        socket.on("error", (err) => {
            console.log("Err :", err); 
        });
    });
});

server.listen(6969,() => {
    console.log(`Server listing on 6969:`);
})