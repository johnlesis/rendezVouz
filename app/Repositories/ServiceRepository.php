<?php

namespace App\Repositories;

use App\Contracts\Repositories\ServiceRepositoryInterface;
use App\Models\Service;

class ServiceRepository extends BaseRepository implements ServiceRepositoryInterface
{
    public function __construct()
    {
        parent::__construct('services', Service::class);
    }
}
