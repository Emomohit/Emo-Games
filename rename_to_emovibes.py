import os
import shutil

def deep_rename(project_dir):
    exclude_dirs = {'.git', '.gradle', 'build', '.idea', 'node_modules'}
    exclude_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.keystore', '.jar', '.aar', '.so'}

    # 1. Rename directories
    print("Renaming directories...")
    for root, dirs, files in os.walk(project_dir, topdown=False):
        for d in list(dirs):
            if d in exclude_dirs:
                continue
            
            if 'emotune' in d.lower():
                new_dir_name = d.replace('emotune', 'emovibes').replace('EmoTune', 'EMOVibes')
                old_dir_path = os.path.join(root, d)
                new_dir_path = os.path.join(root, new_dir_name)
                
                if new_dir_name != d:
                    print(f"Renaming directory: {old_dir_path} -> {new_dir_path}")
                    try:
                        os.rename(old_dir_path, new_dir_path)
                    except Exception as e:
                        print(f"Error renaming {old_dir_path}: {e}")

    # 2. Rename files
    print("Renaming files...")
    for root, dirs, files in os.walk(project_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            if 'emotune' in f.lower():
                new_file_name = f.replace('emotune', 'emovibes').replace('EmoTune', 'EMOVibes')
                old_file_path = os.path.join(root, f)
                new_file_path = os.path.join(root, new_file_name)
                
                if new_file_name != f:
                    print(f"Renaming file: {old_file_path} -> {new_file_path}")
                    try:
                        os.rename(old_file_path, new_file_path)
                    except Exception as e:
                        print(f"Error renaming {old_file_path}: {e}")

    # 3. Text Replacement
    print("Replacing text inside files...")
    for root, dirs, files in os.walk(project_dir):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for f in files:
            _, ext = os.path.splitext(f)
            if ext.lower() in exclude_extensions:
                continue
            
            file_path = os.path.join(root, f)
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                new_content = content.replace('emotune', 'emovibes').replace('EmoTune', 'EMOVibes')
                # Also fix the debug name if it exists
                new_content = new_content.replace('EMOVibes Debug', 'EMOVibes')
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated content in: {file_path}")
            except UnicodeDecodeError:
                pass
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    project_dir = r"E:\Emo Games\EmoTune"
    deep_rename(project_dir)
    print("Deep rename complete!")
