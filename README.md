# Meta Lead Realtime PoC

## Architecture

Meta Lead Ad
→ Meta Webhook
→ FastAPI Backend
→ Meta Graph API
→ Lead Normalization
→ WebSocket
→ React Native App

## How It Works

1. A test lead is created using Meta's Lead Ads Testing Tool.
2. Meta sends a leadgen webhook event to the FastAPI backend.
3. The webhook contains the leadgen ID.
4. The backend uses that ID and the Meta Graph API to retrieve the lead details.
5. The backend converts the returned fields into a simple lead object.
6. The normalized lead is sent to connected clients through WebSocket.
7. The React Native application receives the message and updates its state.
8. The new lead appears on the screen without requiring a manual refresh.

## Tech Stack

- Python
- FastAPI
- React Native
- TypeScript
- WebSockets
- Meta Graph API
- Meta Webhooks
- Cloudflare Tunnel

## Project Structure


backend/
- main.py — webhook, Graph API request, normalization and WebSocket endpoint
- connection.py — manages connected WebSocket clients

TorvLeads/
- App.tsx — connects to the WebSocket and displays incoming leads

## Running the Project


- activate the Python virtual environment
- start Uvicorn
- start the Cloudflare tunnel
- start Metro
- configure ADB reverse for ports 8081 and 8000
- launch the Android application


## Assumptions and Limitations

- This project is a proof of concept rather than a production system.
- WebSocket connections are maintained in memory.
- The current client implementation focuses on Android.
- A Cloudflare tunnel is used to expose the local webhook endpoint to Meta.
- Lead fields depend on the configured Meta Instant Form.
- Credentials are stored using environment variables and are not committed to the repository.
