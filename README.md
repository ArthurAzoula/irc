# 🎮 MyDiscord

MyDiscord is a project aimed at creating an Internet Relay Chat (IRC) server and client using NodeJS + ExpressJS for the server and ReactJS for the client. The server is designed to handle multiple simultaneous connections and support the creation, renaming, and deletion of channels. Users should be able to join multiple channels, with the ability to see when users join or leave a channel. Communication between the client and the server will be facilitated using Socket.IO.

## 🚀 Server Requirements

### 🛠️ Tech Stack
- NodeJS
- ExpressJS
- Socket.IO

### 🎯 Features
- Accepts multiple simultaneous connections.
- Implements channels with the ability to join, create, rename, and delete them.
- Displays messages when a user joins or leaves a channel.
- Allows users to send messages in the channels they have joined.

### 💾 Persistence
- Channels and messages should be persistently preserved.
- Persistence methods can include file storage, a database, etc.

### 👥 User Interaction
- Users must provide a nickname before using the application.
- No authentication system is required but would be a welcome bonus.

## 🖥️ Client Requirements

### 🛠️ Tech Stack
- ReactJS
- Socket.IO Client

### 🎮 User Commands
- `/nick <nickname>`: Set the user's nickname on the server.
- `/list [string]`: List available channels; if a string is specified, display channels containing this string.
- `/create <channel>`: Create a channel with the specified name.
- `/delete <channel>`: Delete the channel with the specified name.
- `/join <channel>`: Join the specified channel.
- `/quit <channel>`: Leave the specified channel.
- `/users`: List the users currently in the channel.
- `/msg <nickname> <message>`: Send a private message to the specified nickname.
- Directly entering a message: Send a message to all users of the channel.

## 📡 Communication Protocol
The client and the server must communicate with each other using a protocol of your choice.

## 📜 Version History
- Version 2.2: [Include specific updates or changes made to this version]

## 🚀 Getting Started
[Provide instructions on setting up and running the IRC server and client.]

## 📦 Dependencies
[Include a list of dependencies and their versions.]

## 👥 Contributors
[List the contributors and their roles in the project.]

## 📄 License
[Specify the project license.]

## 📞 Contact Information
[Provide contact information for questions or support.]

Feel free to modify this template according to the specific details of your project.