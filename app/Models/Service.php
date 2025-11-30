<?php

namespace App\Models;

use DateTimeImmutable;

final readonly class Service
{
    public function __construct(
        public ?int $id,
        public string $name,
        public ?string $description,
        public float $price,
        public int $duration,
        public bool $isActive,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
    ) {}
}
