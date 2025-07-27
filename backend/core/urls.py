from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenBlacklistView

from core.views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # API
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='login'),
    path('api/login/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/password_reset/<pk>', ChangePasswordView.as_view(), name='password_reset'),
    path('api/send_password_reset_email/', SendChangePasswordEmailView,
         name='send_password_resel_email'),
    path('api/check_password_reset_token/<uidb64>/<token>', CheckChangePasswordTokenView.as_view(),
         name='check_password_reset_token'),
    path('api/profile/', UserRetrieveUpdateAPIView.as_view(), name='profile'),
    path('api/', CarListAPIView.as_view(), name='home'),
    path('api/car/<pk>', CarRetrieveAPIView.as_view(), name='home'),
    path('api/filter/', CarFilterListAPIView.as_view(), name='filter'),
    path('api/profile/orders', OrdersAPIView.as_view(), name='orders'),
    path('api/payment/', OrderCreateAPIView.as_view(), name='payment'),
    path('api/all_category/', AllCategoryListAPIView.as_view(), name='all_category'),
    path('api/car/<pk>/reviews/', ReviewsListAPIView.as_view(), name='car_reviews'),
    path('api/car/<pk>/create_review/', ReviewCreateAPIView.as_view(), name='create_review_for_car'),
    path('api/reviews/<pk>/delete', ReviewDestroyAPIView.as_view(), name='delete_user_review'),
    path('api/city', CityListAPIView.as_view(), name='citys')
]

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
