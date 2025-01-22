from django.db import models

# Create your models here.
class User(models.Model):
    id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    createdAt = models.DateField()
    updatedAt = models.DateField()
    deletedAt = models.DateField()
    email = models.EmailField