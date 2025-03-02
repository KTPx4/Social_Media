# Social Media Platform

## Description
This project is a Social Media platform built with ASP.NET Core API and ReactJS. It provides features like posting, commenting, real-time chat, friend management, and an admin panel for moderation.

## Features
### User Features
- **Post Management**: Create, edit, and track update history of posts. Users can comment and reply to comments. Posts can also be reported.
- **Profile & Friend System**: Users can manage their profiles, send friend requests, and block other users.
- **Notifications**: Users receive notifications when someone comments on their posts.
- **Chat System**: Real-time chat with friends or in group conversations. Users can reply to and react to messages.

### Admin Panel
- **User & Role Management**: Admin can manage users and their roles. Only one admin exists, but multiple moderators can help manage content.
- **Report Management**: Moderators can review reported posts and take action accordingly.

## Installation & Setup
### Prerequisites
- .NET SDK
- Node.js & npm
- SQL Server

### Backend Setup (ASP.NET Core API)
```sh
# Clone the repository
git clone https://github.com/your-repo/social-media.git
cd social-media/server

# Configure appsettings.json (not included in the repo for security reasons)
# Example structure:
```
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "MSSQL": "Server=YOUR_SERVER;Database=SocialMedia;Trusted_connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "https://localhost:7000",
    "Audience": "https://localhost:7000"
  },
  "GmailSettings": {
    "ApplicationName": "API Social Media",
    "ClientId": "your-client-id",
    "ClientSecret": "your-client-secret",
    "RefreshToken": "your-refresh-token",
    "MyEmail": "your-email",
    "NameEmail": "Social Media"
  },
  "ClientSettings": {
    "HostName": "http://localhost:3000",
    "ResetUrl": "http://localhost:3000/account/reset"
  },
  "ServerSettings": {
    "TimelifeResetMinute": 5,
    "HostName": "https://localhost:7000",
    "RootImgAccount": "wwwroot/public/account",
    "AccessImgHost": "public/account",
    "RootImgPost": "wwwroot/post",
    "RootImgGroup": "wwwroot/group",
    "AccesImgPost": "post"

  }
}
```
```sh
# Restore and run the backend
dotnet restore
dotnet run
```

### Database Setup
```sh
# Update database migrations
dotnet ef database update

# Run the SQL script to populate initial data with file 'database.sql'

```

### Frontend Setup (ReactJS)
```sh
cd ../client

# Install dependencies
npm install

# Start the React application
npm start
```

## Test Account
```sh
# Admin Account:
Username: admin
Password: admin
```

## API Endpoints
The backend exposes several endpoints for authentication, posts, users, and chat. API documentation can be accessed via Swagger at:
```
https://localhost:7000/swagger/index.html
```


