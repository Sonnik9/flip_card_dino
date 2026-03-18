import os

# Путь к папке с динозаврами
folder_path = 'assets/dino'

def rename_images():
    if not os.path.exists(folder_path):
        print(f"Ошибка: Папка '{folder_path}' не найдена.")
        return

    # Получаем список файлов
    files = os.listdir(folder_path)
    
    # Отфильтруем нужные файлы: убираем рубашку и скрытые файлы (типа .DS_Store)
    images_to_rename = [
        f for f in files 
        if os.path.isfile(os.path.join(folder_path, f)) 
        and 'back-face-img' not in f 
        and not f.startswith('.')
    ]

    counter = 1
    for filename in images_to_rename:
        # Извлекаем расширение (например, .png или .jpg)
        _, ext = os.path.splitext(filename)
        
        # Формируем новое имя
        new_name = f"{counter}dino{ext}"
        
        old_file_path = os.path.join(folder_path, filename)
        new_file_path = os.path.join(folder_path, new_name)
        
        # Защита от перезаписи: если имя уже такое, как надо, просто идем дальше
        if old_file_path != new_file_path:
            # Если целевой файл случайно уже существует (например, старая нумерация пересекается),
            # скрипт может упасть. В идеале исходные файлы должны иметь другие имена.
            try:
                os.rename(old_file_path, new_file_path)
                print(f"Переименовано: {filename} -> {new_name}")
            except FileExistsError:
                print(f"Пропуск: файл {new_name} уже существует.")
        
        counter += 1

    print("\nПереименование завершено!")

if __name__ == "__main__":
    rename_images()