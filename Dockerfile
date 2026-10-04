FROM php:8.2-apache

RUN docker-php-ext-install mysqli

COPY php.ini /usr/local/etc/php/conf.d/uploads.ini

COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html/backend/uploads

EXPOSE 80