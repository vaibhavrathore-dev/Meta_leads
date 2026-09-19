import os
import httpx
from fastapi import FastAPI,Query,HTTPException,Response,Request,WebSocket,WebSocketDisconnect
from backend.connection import manager
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

META_VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN")
META_ACCESS_TOKEN = os.getenv("META_PAGE_ACCESS_TOKEN")
@app.get("/")
def get_health():
    return {
        "message" : "Moving one step closer"
    }

@app.get("/webhook")
async def verify_token(
    hub_mode : str = Query(None,alias="hub.mode"),
    hub_verify_token : str = Query(None,alias="hub.verify_token"),
    hub_challenge : str =  Query(None,alias="hub.challenge")
):
    if hub_mode == "subscribe" and hub_verify_token == META_VERIFY_TOKEN:
        return Response(content=hub_challenge,media_type="text/plain")
    raise HTTPException(
        status_code=403,
        detail="Invalid Token"
    )

@app.post("/webhook")
async def get_request(request : Request):
    payload = await request.json()
    leadgen_id = payload['entry'][0]['changes'][0]['value']['leadgen_id']
    lead_details = await fetch_details(leadgen_id)
    normal  = normalize_lead(lead_details)
    await manager.send_data(normal)
    return {
        "message" : "Informed the Backend"
    }

async def fetch_details(leadgen_id):
    url = f"https://graph.facebook.com/v26.0/{leadgen_id}"

    params = {
        "fields": "id,created_time,field_data",
        "access_token": META_ACCESS_TOKEN
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url=url,params=params)

        response.raise_for_status()
        data = response.json()
        return data

def normalize_lead(lead_details):
    normalized = {
        "id" : lead_details["id"],
        "created_time" : lead_details["created_time"]
    }
    for field in lead_details["field_data"]:
         field_name = field["name"]
         field_value = field["values"][0]
         normalized[field_name] = field_value

    return normalized

@app.websocket("/ws")
async def websocket_endpoint (websocket : WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
