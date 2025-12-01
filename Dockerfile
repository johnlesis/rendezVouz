FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y ca-certificates

# Ensure storage, bootstrap/cache, and public are writable
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    public \
    && chmod -R 777 storage bootstrap/cache public

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Cache Laravel config (optional but recommended)
RUN php artisan config:cache || true
RUN php artisan route:cache || true

# Expose a port (optional — Render ignores the number)
EXPOSE 8000

# Start Laravel using the Render-assigned port
CMD ["sh", "-c", "php artisan serve --host 0.0.0.0 --port $PORT"]
