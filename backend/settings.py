import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
import re # ¡Nueva importación necesaria para las expresiones regulares!

# Cargar variables del archivo .env (para desarrollo local)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------- Seguridad ----------------
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
# DEBUG debe ser un booleano, y '1' o 'True' se considera True
DEBUG = os.getenv('DEBUG', '0').lower() in ('true', '1')

# Permite hosts de Render y la cadena vacía si no está definida (para evitar errores)
# Nota: La configuración en Render tiene ALLOWED_HOSTS=crosspay-test-13.onrender.com
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',') 
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = []

# ---------------- Aplicaciones instaladas ----------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders', 

    # local apps
    'backend.transactions',
]

# ---------------- Middleware ----------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # whitenoise debe ir antes de CorsMiddleware para servir archivos estáticos
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware', # Debe estar lo más alto posible
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# ---------------- Templates ----------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ---------------- Base de datos (Optimizado para Render) ----------------
DATABASES = {
    # dj_database_url.config() lee DATABASE_URL automáticamente
    'default': dj_database_url.config(
        conn_max_age=600,   # Mejora el rendimiento de la DB
        ssl_require=True    # Requisito para PostgreSQL en Render
    )
}

# Configuración de fallback (solo para desarrollo local si no hay DATABASE_URL)
if not os.getenv('DATABASE_URL'):
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }

# ---------------- Autenticación ----------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# ---------------- Internacionalización ----------------
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# ---------------- Archivos estáticos ----------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ====================================================================
# ---------------- CORS (Sección Corregida) ----------------
# ====================================================================

# Lee la variable de entorno para saber si se permite TODO
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL', '0') == '1'
frontend_base_url = os.getenv('FRONTEND_BASE_URL') # Tu URL principal de Vercel

# Si se usa autenticación (TokenAuthentication en tu caso), se requieren credenciales.
CORS_ALLOW_CREDENTIALS = True 

if CORS_ALLOW_ALL_ORIGINS:
    # Si CORS_ALLOW_ALL es True (Valor 1), se permite todo origen.
    CORS_ALLOWED_ORIGINS = []
    CORS_ALLOWED_ORIGIN_REGEXES = []
else:
    # Si CORS_ALLOW_ALL es False (Valor 0), configuramos orígenes específicos.
    
    # 1. CORS_ALLOWED_ORIGINS: Para el dominio principal exacto
    CORS_ALLOWED_ORIGINS = []
    if frontend_base_url:
        CORS_ALLOWED_ORIGINS.append(frontend_base_url)
        
    # 2. CORS_ALLOWED_ORIGIN_REGEXES: Para permitir los subdominios de preview de Vercel.
    # El patrón r"^https://[a-zA-Z0-9-]+\.vercel\.app$" permite cualquier subdominio
    # que termine en .vercel.app, cubriendo los dominios de preview.
    CORS_ALLOWED_ORIGIN_REGEXES = [
        r"^https://[a-zA-Z0-9-]+\.vercel\.app$",
    ]

# ---------------- DRF ----------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

# ---------------- Logging ----------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {'format': '{levelname} {message}', 'style': '{'},
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'simple'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}