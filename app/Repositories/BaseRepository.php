<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Support\ModelMapper;
use Illuminate\Support\Facades\DB;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected string $table;
    protected string $modelClass;

    public function __construct(string $table, string $modelClass)
    {
        $this->table = $table;
        $this->modelClass = $modelClass;
    }

    public function all(): array
    {
        $results = DB::table($this->table)->get();

        return $results->map(function ($row) {
            return ModelMapper::fromDatabase((array) $row, $this->modelClass);
        })->toArray();
    }

    public function find(int $id): ?object
    {
        $row = DB::table($this->table)->find($id);

        if (!$row) {
            return null;
        }

        return ModelMapper::fromDatabase((array) $row, $this->modelClass);
    }

    public function create(array $data): object
    {
        $id = DB::table($this->table)->insertGetId($data);

        return $this->find($id);
    }

    public function update(int $id, array $data): bool
    {
        return DB::table($this->table)
            ->where('id', $id)
            ->update($data) > 0;
    }

    public function delete(int $id): bool
    {
        return DB::table($this->table)
            ->where('id', $id)
            ->delete() > 0;
    }
}
