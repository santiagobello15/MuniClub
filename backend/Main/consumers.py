import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import threading
import random
from backend.mock_data import inventoryMock


class MainConsumer(WebsocketConsumer):
    def connect(self):
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        self.startSendingMsgs()

    def receiveMsg(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    def chat_message(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message
        }))

    def startSendingMsgs(self):
        # Esta función se ejecuta cada 5 segundos
        def sendPeriodicMessage():
            # Selección aleatoria de un ID
            randomItem = random.choice(inventoryMock)

            # Puedes generar otros campos aquí
            message = {
                **randomItem,
                'quantity': random.randint(1, 1000),
                'price': round(random.uniform(50, 150), 2),
                'yield': round(random.uniform(1, 10), 2),

            }


            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )
            # Vuelve a llamar la función después de 5 segundos
            threading.Timer(5.0, sendPeriodicMessage).start()

        # Llamamos a la función para empezar
        sendPeriodicMessage()
