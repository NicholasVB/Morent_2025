from django.core.management.base import BaseCommand
from core.models import Car
from django.core.files import File
from django.conf import settings
from django.utils.text import slugify
import os
import shutil
from random import choice, randint
from cloudinary.uploader import upload
from cloudinary.exceptions import Error as CloudinaryError

import django
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

def compress_image(file_path, ext: str):
    try:
        img = Image.open(file_path)
        img = img.convert("RGB")
        ext = ext.lstrip(".").upper()
        if ext == "JPG": ext = "JPEG"
        max_size = 9.5 * 1024 * 1024
        quality = 100
        while quality >= 20:
            buffer = BytesIO()
            img.save(buffer, format=ext, quality=quality)
            curent_image_size = buffer.tell()
            if curent_image_size < max_size:
                return ContentFile(buffer.getvalue())   
            quality -= 5
    except Exception as error:
        print("error with image: ", error)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Morent.settings')
django.setup()


class Command(BaseCommand):
    help = "init and fill the core.car table"
    
    FILE = "cars_descriptions.txt"
    SPECS_FILE = "specs.txt"
    WORKING_DIRECTORY = os.path.abspath(__file__ + "/..")
    BASE_DIR = settings.BASE_DIR
    
    def handle(self, *args, **options):
        if options["clear"]:
            Car.objects.all().delete()
            
        if options["rm_mediafold"]:
            try:
                shutil.rmtree(settings.MEDIA_ROOT)
            except FileNotFoundError:
                print(f"Error: Folder '{settings.MEDIA_ROOT}' was not found.")
            except OSError as e:
                print(f"Error: While deleting folder '{settings.MEDIA_ROOT}': {e}")

        if options["fill"]:
            print("settings.MEDIA_ROOT", settings.MEDIA_ROOT, "\n\n")
            car_photo_name_translator = {
                "inside-1": "inside_photo_one",
                "inside-2": "inside_photo_two",
                "out-1": "main_photo",
            }
            try:
                with open(os.path.join(self.WORKING_DIRECTORY, self.FILE), "r", encoding="utf-8") as file:
                    for line in file:
                        if not line.strip():
                            continue

                        car_name, car_description = list(map(lambda text: text.strip(), line.split(":")))
                        car_name_with_underscore = car_name.replace(" ", "_")
                        car_folder = self.find_car_folder(car_name_with_underscore, self.WORKING_DIRECTORY)

                        if car_folder:
                            car_category = os.path.basename(os.path.dirname(car_folder))
                            car_photos = {car_photo_name_translator[photo_name.split(".")[0]]: photo_name for photo_name in os.listdir(car_folder)}
                            specs_folder = os.path.join(car_folder, os.path.pardir)
                            specs = self.parse_specs(specs_folder, car_name)
                            
                            obj = {
                                "slug": slugify(car_name.lower()),
                                "is_published": True,
                                "number_of_rentals": randint(0, 7),
                                "rental_price": randint(4, 22) * 5,
                                "category": car_category,
                                "text": car_description,
                                **car_photos,
                                **specs
                            }
                            DB_car_instance = Car(**obj)

                            car_photos_full_path = [os.path.join(os.path.relpath(car_folder, self.WORKING_DIRECTORY), photo_name) for photo_name in os.listdir(car_folder)]
                            photo_prefixs = ["inside_photo_one", "inside_photo_two", 'main_photo']
                            couples = list(zip(photo_prefixs, car_photos_full_path))
                            for photo_prefix, photo_full_path in couples:
                                path_ = os.path.join(self.WORKING_DIRECTORY, photo_full_path)
                                with open(path_, 'rb') as f:
                                    field = getattr(DB_car_instance, photo_prefix)
                                    ext = os.path.splitext(photo_full_path)[1]
                                    print("Сохраняем фото:", photo_prefix, "из", path_)
                                    compressed_image = compress_image(path_, ext)
                                    field.save(f"{photo_prefix}{ext}", compressed_image, save=False)
                            DB_car_instance.save()
            except Exception as error:
                print(error)
 
    def add_arguments(self, parser):
        parser.add_argument("--clear", action="store_true")
        parser.add_argument("--fill", action="store_true")
        parser.add_argument("--rm_mediafold", action="store_true")
    
    def has_more_than_one_type_of_fuel(self, characteristic):
        return True if "," in characteristic else False
    
    def parse_car_line(self, line: str):
        fields = [field.strip() for field in line.strip().split("\t") if field.strip()]
        if len(fields) != 4:
            raise ValueError(f"Cannot parse car: {fields[0]}")
        
        return {
            "car_name": fields[0],
            "maximum_passengers": fields[1][0],
            "engine_fuel_type": fields[2],
            "fuel_tank_capacity": fields[3],
        }
    
    def parse_specs(self, path_to_specs_file, target_car_name):
        """
        Parse txt file with specifications.
        
        return dict(car_name, maximum_passengers, engine_fuel_type, fuel_tank_capacity).
        """
        with open(os.path.join(path_to_specs_file, self.SPECS_FILE), 'r', encoding="utf-8") as file:
            _ = file.readline().strip()
            for line in file:
                if not line.strip():
                    continue

                car = self.parse_car_line(line)
                if car["car_name"] != target_car_name:
                    continue

                if self.has_more_than_one_type_of_fuel(car["engine_fuel_type"]):
                    engine_fuel_type = choice(car["engine_fuel_type"].split(','))
                    fuel_tank_capacity = choice(car["fuel_tank_capacity"].split(','))[0:3].strip()
                else:
                    engine_fuel_type = car["engine_fuel_type"]
                    fuel_tank_capacity = car["fuel_tank_capacity"][0:3].strip()

                return {
                    "car_name": car["car_name"],
                    "maximum_passengers": car["maximum_passengers"],
                    "engine_fuel_type": engine_fuel_type,
                    "fuel_tank_capacity": fuel_tank_capacity,
                }

    def find_car_folder(self, car_name, WORKING_DIRECTORY) -> str | None:
        for file_or_folder_name in os.listdir(WORKING_DIRECTORY):
            if os.path.isdir(os.path.abspath(os.path.join(WORKING_DIRECTORY, file_or_folder_name))):
                if car_name == file_or_folder_name:
                    return os.path.join(WORKING_DIRECTORY, file_or_folder_name)
                
                path = self.find_car_folder(car_name, os.path.abspath(os.path.join(WORKING_DIRECTORY, file_or_folder_name)))
                if path:
                    return path
        return None