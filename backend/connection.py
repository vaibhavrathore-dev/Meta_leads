
class Connections:
    def __init__(self):
        self.active_connections  = []
    async def connect(self, websocket):
       await websocket.accept()
       self.active_connections.append(websocket)
    def disconnect(self,websocket):
        self.active_connections.remove(websocket)
    async def send_data(self,data):
        for connection in self.active_connections:
          await connection.send_json(data)

manager = Connections()
    
