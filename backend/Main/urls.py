from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.user_list, name='user_list'),
    path('users/<int:pk>/', views.user_detail, name='user_detail'),
]
