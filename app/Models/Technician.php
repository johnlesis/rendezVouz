<?php

namespace App\Models;

use DateTimeImmutable;

final readonly class Technician
{
    public function __construct(
        public ?int $id,
        public int $userId,
        public string $specialization,
        public ?string $bio,
        public bool $isAvailable,
        public ?DateTimeImmutable $createdAt = null,
        public ?DateTimeImmutable $updatedAt = null,
    ) {}
}
