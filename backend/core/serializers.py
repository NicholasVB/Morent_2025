from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.models import User

from core.models import *


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    """
        Serializer for user
    """
    date_joined = serializers.DateTimeField(format='%Y-%m-%d')
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')

    def update(self, instance, validated_data):
        for (key, value) in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])
        return user


class LoginSerializer(serializers.Serializer):
    """serializer for the user authentication object"""
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Incorrect Credentials Passed.')


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    model = User

    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)


class CarListSerializer(serializers.ModelSerializer):
    # cat_name = serializers.CharField(source='category.name')
    # engine_name = serializers.CharField(source='engine.name')
    # capacity_name = serializers.CharField(source='capacity.name')

    class Meta:
        model = Car
        exclude = ('inside_photo_one', 'inside_photo_two')


class CarSerializer(serializers.ModelSerializer):
    # cat_name = serializers.CharField(source='cat.name')
    # engine_name = serializers.CharField(source='engine.name')
    # capacity_name = serializers.CharField(source='capacity.name')

    class Meta:
        model = Car
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SteeringSerializer(serializers.ModelSerializer):
    class Meta:
        model = Steering
        fields = "__all__"


class CapacitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Capacity
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    car_name = serializers.CharField(source='car.title', required=False)

    class Meta:
        model = Order
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ('name',)
