<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \App\Contracts\Repositories\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\ServiceRepositoryInterface::class,
            \App\Repositories\ServiceRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\AppointmentRepositoryInterface::class,
            \App\Repositories\AppointmentRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\TechnicianRepositoryInterface::class,
            \App\Repositories\TechnicianRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\WorkingHoursRepositoryInterface::class,
            \App\Repositories\WorkingHoursRepository::class
        );

        $this->app->bind(
            \App\Contracts\Repositories\TechnicianScheduleRepositoryInterface::class,
            \App\Repositories\TechnicianScheduleRepository::class
        );
    }

    public function boot(): void
    {
    }
}
