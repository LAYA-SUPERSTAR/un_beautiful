from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), '..', '.env'))
    
    PORT: int = 3001
    HOST: str = "0.0.0.0"
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024
    ALLOWED_EXTENSIONS: str = "jpg,jpeg,png"
    
    @property
    def allowed_extensions_list(self):
        return [ext.strip().lower() for ext in self.ALLOWED_EXTENSIONS.split(",")]

settings = Settings()
