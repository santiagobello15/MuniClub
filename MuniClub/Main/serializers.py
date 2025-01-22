from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    firstName = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    createdAt = serializers.DateField()
    updatedAt = serializers.DateField()
    deletedAt = serializers.DateField()
    email = serializers.EmailField