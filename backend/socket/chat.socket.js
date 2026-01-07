export default (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join_room", (roomId) => {
            socket.join(roomId);
            console.log(`${socket.id} joined room ${roomId}`);
        });

        socket.on("send_message", (data) => {
            socket.to(data.roomId).emit("receive_message", {
                message: data.message,
                sender: socket.id,
                time: new Date().toLocaleTimeString(),
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
