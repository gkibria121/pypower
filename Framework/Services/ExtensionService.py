import os

class ExtensionService:
    def __init__(self, zipfile_module) -> None:
        self.zipfile = zipfile_module

    def register(self, name, manifest_json, background_js, files=[]):
        if not os.path.exists('Extensions'):
            os.makedirs('Extensions')
        
        # Create the zip file
        with self.zipfile.ZipFile(f"Extensions/{name}.zip", 'w') as zp:
            zp.writestr('manifest.json', manifest_json)
            zp.writestr('background.js', background_js)
            for file in files:
                zp.writestr(file['name'], file['content'])
        
        return f"Extensions/{name}.zip"