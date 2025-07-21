from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import *


# Register your models here.


class CarAdmin(admin.ModelAdmin):
    """Class for displaying the Car model in the admin panel."""
    list_display = ('id', 'car_name', 'rental_price', 'get_html_photo', 'is_published')
    list_display_links = ('id', 'car_name', 'rental_price', 'get_html_photo', 'is_published')
    fields = ('car_name', 'slug', 'fuel_tank_capacity', 'number_of_rentals', 'category', 
              'engine_fuel_type', 'rental_price', 'text', 'main_photo',
              'inside_photo_one', 'inside_photo_two', 'get_html_photo', 'is_published')
    search_fields = ('car_name',)
    prepopulated_fields = {"slug": ("car_name",)}
    readonly_fields = ('get_html_photo',)
    save_on_top = True

    def get_html_photo(self, object):
        """Method for displaying photo in the admin panel"""
        if object.main_photo:
            print(object.main_photo)
            # return mark_safe(f"<img src='https://morent-backend-xavm.onrender.com/static{object.main_photo.url}'width=50>")
            return mark_safe(f"<img src='{object.main_photo.url}' height=250>")

    get_html_photo.short_description = "Фото"


class CategoryAdmin(admin.ModelAdmin):
    """Class for displaying the categoryegory model in the admin panel."""
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}


class SteeringAdmin(admin.ModelAdmin):
    """Class for displaying the Steering model in the admin panel."""
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}


class number_of_rentalsAdmin(admin.ModelAdmin):
    """Class for displaying the number_of_rentals model in the admin panel."""
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    prepopulated_fields = {"slug": ("name",)}


class OrderAdmin(admin.ModelAdmin):
    """Class for displaying the Order model in the admin panel."""
    list_display = ('id', 'username', 'name', 'adress',
                    'phone_number', 'city', 'pick_up_city',
                    'pick_up_date', 'pick_up_time', 'car',
                    'drop_off_city', 'drop_off_date', 'drop_off_time',)
    fields = ('username', 'name', 'adress',
              'phone_number', 'city', 'pick_up_city',
              'pick_up_date', 'pick_up_time', 'car',
              'drop_off_city', 'drop_off_date', 'drop_off_time',)
    list_display_links = ('id', 'username')


class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'review_text', 'review_time', 'review_score', 'car')
    fields = ('username', 'review_text', 'review_time', 'review_score', 'car')
    list_display_links = ('id', 'car')


class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    fields = ('name', 'slug')
    list_display_links = ('id', 'name')
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Car, CarAdmin)
# admin.site.register(categoryegory, CategoryAdmin)
# admin.site.register(Steering, SteeringAdmin)
# admin.site.register(number_of_rentals, number_of_rentalsAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(City, CityAdmin)
