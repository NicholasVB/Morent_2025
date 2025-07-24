from django.contrib.auth import login
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import INTERNAL_RESET_SESSION_TOKEN
from django.core.cache import cache
import redis
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponseNotFound
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# API IMPORT
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView
import django_filters.rest_framework
from rest_framework import generics, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.serializers import *
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer


# Register API
class RegisterAPI(generics.GenericAPIView):
    """
    An endpoint for registration.

    method:
        POST

    request data:
        username, password, email

    response data:
        user:
            id, username, email, first_name, last_name
    """
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })


class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
        An endpoint for user profile.

        method:
            GET
            PUT, PATCH

        headers:
            token

        response data:
            id, username, email,
            first_name, last_name, date_joined

    """

    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        try:
            serializer = self.serializer_class(self.get_object())
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            message = {
                'detail': 'User getting error'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.get_object(), data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def SendChangePasswordEmailView(request):
    """
        An endpoint for sending password reset email.

        request data:
            email

        response data:
            detail

    """

    data = request.data
    email = data['email']
    user_list = User.objects.filter(email=email)
    if User.objects.filter(email=email).exists():
        for user in user_list:
            subject = "Password Reset Requested"
            email_template_name = "password_reset_email.html"
            c = {
                "email": user.email,
                'domain': '127.0.0.1:8000',
                'site_name': 'Morent',
                "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                "user": user,
                'token': default_token_generator.make_token(user),
                'protocol': 'http',
            }
            email = render_to_string(email_template_name, c)
            try:
                send_mail(subject, email, 'dimon22052000@gmail.com', [user.email], fail_silently=False)
            except BadHeaderError:
                message = {
                    'detail': 'Some Error Message'}
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            message = {
                'detail': 'Success Message'}
            return Response(message, status=status.HTTP_200_OK)
    else:
        message = {
            'detail': 'User with this email is not exist'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


class CheckChangePasswordTokenView(generics.GenericAPIView):
    """
        An endpoint for check password reset token.

        kwargs:
            uidb64
            token

        response data:
            pk

    """
    reset_url_token = "set-password"
    token_generator = default_token_generator
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        if kwargs.get("uidb64") is None or kwargs.get("token") is None:
            message = {
                'detail': 'The URL path must contain uidb64 and token parameters.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        user = self.get_user(kwargs.get("uidb64"))
        if user is not None:
            token = kwargs.get("token")
            if token == self.reset_url_token:
                session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(user, session_token):
                    # If the token is valid, display the password reset form.
                    return Response(user.pk, status=status.HTTP_200_OK)
                else:
                    message = {
                        'detail': 'Token check unsuccessful'}
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
            else:
                if self.token_generator.check_token(user, token):
                    return Response(user.pk, status=status.HTTP_200_OK)
                else:
                    message = {
                        'detail': 'Token check unsuccessful'}
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)

    def get_user(self, uidb64):
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (
                TypeError,
                ValueError,
                OverflowError,
                User.DoesNotExist,
                ValidationError,
        ):
            user = None
        return user


class ChangePasswordView(generics.UpdateAPIView):
    """
        An endpoint for changing password.

        kwargs:
            pk

        request data:
            new_password
            new_password_confirm

        response data:
            detail

    """
    serializer_class = ChangePasswordSerializer
    model = User

    def update(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        if pk is not None:
            user = User.objects.get(pk=pk)
            serializer = self.get_serializer(data=request.data)

            if serializer.is_valid():
                # Check if password1 equal to password2
                if serializer.data.get("new_password") is not None:
                    if serializer.data.get("new_password") == serializer.data.get("new_password_confirm"):
                        # set_password also hashes the password that the user will get
                        user.set_password(serializer.data.get("new_password"))
                        user.save()
                        message = {
                            'detail': 'Password updated successfully'}
                        return Response(message, status=status.HTTP_200_OK)
                else:
                    message = {
                        'detail': 'Passwords not equal'}
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            message = {
                'detail': 'User id is None'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)


class CarListAPIView(ListAPIView):
    """
        An endpoint for cars list.

        method:
            GET

        response data:
            id, cat_name, engine_name, capacity_name, title,
            slug, main_photo, is_published, gasoline,
            rent_count, price, cat, engine, capacity
    """
    queryset = Car.objects.filter(is_published=True)
    # .prefetch_related('cat', 'engine', 'capacity')

    def get(self, request, *args, **kwargs):
        cache_key = 'cars'

        if cache_key in cache:
            queryset = cache.get(cache_key)
            return Response(queryset, status=status.HTTP_200_OK)
        else:
            queryset = Car.objects.filter(is_published=True)
            # .prefetch_related('cat', 'engine', 'capacity')
            serializer_class = CarListSerializer(queryset, many=True, context={"request": request})

            cache.set(cache_key, serializer_class.data, timeout=30)
            return Response(serializer_class.data, status=status.HTTP_200_OK)


class CarRetrieveAPIView(RetrieveAPIView):
    """
        An endpoint for one car.

        method:
            GET

        response data:
            id, cat_name, engine_name, capacity_name,
            title, slug, main_photo, inside_photo_one,
            inside_photo_two, is_published, gasoline,
            rent_count, price, cat, engine, capacity,
    """
    queryset = Car.objects.filter(is_published=True)

    def get(self, request, *args, **kwargs):
        first_name = self.kwargs.get("pk")

        if first_name is not None:
            cache_key = 'car' + first_name
        else:
            cache_key = 'car'

        if cache_key in cache:
            queryset = cache.get(cache_key)
            return Response(queryset, status=status.HTTP_200_OK)
        else:
            queryset = Car.objects.filter(is_published=True, pk=kwargs.get("pk"))
            # .prefetch_related('cat', 'engine','capacity')
            serializer_class = CarSerializer(queryset, many=True, context={"request": request})
            cache.set(cache_key, serializer_class.data, timeout=60)
            return Response(serializer_class.data, status=status.HTTP_200_OK)


class CarFilterListAPIView(ListAPIView):
    """
        An endpoint for filtered cars list.

        method:
            GET

        param:
            cat (requirement = False)
            engine (requirement = False)
            capacity (requirement = False)

        response data:
            id, cat_name, engine_name, capacity_name, title,
            slug, main_photo, is_published, gasoline,
            rent_count, price, cat, engine, capacity
    """
    queryset = Car.objects.all()
    serializer_class = CarListSerializer
    # .select_related('cat', 'engine', 'capacity')
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['category', 'engine_fuel_type', 'maximum_passengers']


class AllCategoryListAPIView(ListAPIView):
    """
        An endpoint for all category's list.

        method:
            GET

        response data:
            cat:
                id, name, slug
            engine:
                id, name, slug
            capacity:
                id, name, slug
    """

    def get(self, request, *args, **kwargs):

        # cache_key = 'all_category'

        # if cache_key in cache:
        #     queryset = cache.get(cache_key)
        #     return Response(queryset, status=status.HTTP_200_OK)
        
        category = Car.objects.values_list("category", flat=True).distinct().order_by("category")
        engine_fuel_type = Car.objects.values_list("engine_fuel_type", flat=True).distinct().order_by("engine_fuel_type")
        maximum_passengers = Car.objects.values_list("maximum_passengers", flat=True).distinct().order_by("maximum_passengers")
        
        message = {
            'category': category,
            'engine_fuel_type': engine_fuel_type,
            'maximum_passengers': maximum_passengers,
        }
        # cache.set(cache_key, message, timeout=300)
        return Response(message, status=status.HTTP_200_OK)


class OrdersAPIView(APIView):
    """
        An endpoint for all orders selected user.

        method:
            GET

        kwargs:
            pk

        response data:
            id, car_name, name,
            adress, phone_number, city,
            pick_up_location, pick_up_date, pick_up_time,
            drop_off_location, drop_off_date, drop_off_time,
            status, username, car

    """
    serializer_class = OrderSerializer

    def get_object(self):
        """Retrieve and return authenticated user"""
        return self.request.user

    def get(self, request, *args, **kwargs):

        user = self.get_object()
        if user is None:
            message = {
                'detail': 'User is empty'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        cache_key = 'orders' + str(user)
        if cache_key in cache:
            queryset = cache.get(cache_key)
            return Response(queryset, status=status.HTTP_200_OK)
        else:
            try:
                try:
                    user_u = User.objects.get(pk=user.id)
                except:
                    message = {
                        'detail': 'This user doesnt exist'
                    }
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
                queryset = Order.objects.filter(username=user_u)
                # .prefetch_related('car')
                if queryset.exists() is False:
                    message = {
                        'detail': 'This user dont have orders'
                    }
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
                serializer_class = OrderSerializer(queryset, many=True)
                cache.set(cache_key, serializer_class.data, timeout=30)
            except:
                message = {
                    'detail': 'Serialization error'
                }
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer_class.data, status=status.HTTP_200_OK)


class OrderCreateAPIView(CreateAPIView):
    """
        An endpoint for all orders selected user.

        method:
            POST

        request data:
            name, adress, phone_number, city,
            pick_up_city, pick_up_date, pick_up_time,
            drop_off_city, drop_off_date, drop_off_time,
            username, car

        response data:
            detail

    """

    serializer_class = OrderSerializer

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except:
            message = {
                'detail': 'Serialization error'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        message = {
            'detail': 'Success order creation'
        }
        return Response(message, status=status.HTTP_200_OK)


class ReviewCreateAPIView(CreateAPIView):
    """
        An endpoint for creation review for car.

        method:
            POST

        kwargs:
            pk

        request data:
            username, review_text,
            review_score, car

        response data:
            detail

    """

    serializer_class = ReviewSerializer

    def post(self, request, *args, **kwargs):
        reviewed_car = self.kwargs.get("pk")
        if reviewed_car is None:
            message = {
                'detail': 'Car kwargs is empty'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except:
            message = {
                'detail': 'Serialization error'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        message = {
            'detail': 'Success review creation'
        }
        return Response(message, status=status.HTTP_200_OK)


class ReviewsListAPIView(ListAPIView):
    """
        An endpoint for car reviews list.

        method:
            GET

        kwargs:
            pk

        response data:
            username, review_text,
            review_score, review_time, car

    """

    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def score_avg(self, queryset):
        sum = 0
        for item in queryset:
            sum += item.review_score
        return round((sum / len(queryset)), 0)

    def get(self, request, *args, **kwargs):
        reviewed_car = self.kwargs.get("pk")
        if reviewed_car is None:
            message = {
                'detail': 'Car kwargs is empty'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        cache_key = 'reviews' + reviewed_car
        if cache_key in cache:
            queryset = cache.get(cache_key)
            return Response(queryset, status=status.HTTP_200_OK)
        else:
            try:
                try:
                    car_id = Car.objects.get(pk=reviewed_car)
                except:
                    message = {
                        'detail': 'This car doesnt exist'
                    }
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
                queryset = Review.objects.filter(car=car_id)
                if queryset.exists() is False:
                    message = {
                        'detail': 'This car dont have reviews'
                    }
                    return Response(message, status=status.HTTP_400_BAD_REQUEST)
                serializer_class = ReviewSerializer(queryset, many=True)
                cache.set(cache_key, serializer_class.data, timeout=30)

            except:
                message = {
                    'detail': 'Serialization error'
                }
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            message = {
                'data_set': serializer_class.data,
                'score_svg': self.score_avg(queryset)
            }
            return Response(message, status=status.HTTP_200_OK)


class ReviewDestroyAPIView(DestroyAPIView):
    """
        An endpoint for delete user review.

        method:
            DELETE

        kwargs:
            pk

        response data:
            detail
    """

    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


class CityListAPIView(ListAPIView):
    """
        An endpoint for delete user review.

        method:
            GET

        response data:
            name
    """
    serializer_class = CitySerializer
    queryset = City.objects.all()
