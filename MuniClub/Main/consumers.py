import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import threading
import random


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
            ids = [
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b0", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b12", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b13",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b14", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b16", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b18", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b19",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b20", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b21",
                "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b22", "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b23"
            ]

            # Selección aleatoria de un ID
            random_id = random.choice(ids)

            # Puedes generar otros campos aquí
            message = {
                'id': random_id,
                'cusip': f'CUSIP-{random.randint(10000, 99999)}',
                'name': f'Bond {random.randint(1, 100)}',
                'maturity': f'{random.randint(2023, 2030)}-12-31',
                'offered': random.choice([True, False]),
                'liquidity': random.choice(['low', 'high']),
                'quantity': random.randint(1, 1000),
                'price': round(random.uniform(50, 150), 2),
                'yield': round(random.uniform(1, 10), 2),
                'avatarUrl': f'/assets/images/avatar/avatar-{random.randint(1, 24)}.webp'
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