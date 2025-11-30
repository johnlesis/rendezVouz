<?php

namespace App\Support;

use ReflectionClass;

abstract class ModelMapper
{
    /**
     * Convert camelCase to snake_case
     */
    protected static function toSnakeCase(string $input): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $input));
    }

    /**
     * Convert snake_case to camelCase
     */
    protected static function toCamelCase(string $input): string
    {
        return lcfirst(str_replace('_', '', ucwords($input, '_')));
    }

    /**
     * Convert model object to database array (camelCase -> snake_case)
     */
    public static function toDatabase(object $model): array
    {
        $reflection = new ReflectionClass($model);
        $properties = $reflection->getConstructor()?->getParameters() ?? [];

        $data = [];
        foreach ($properties as $param) {
            $propertyName = $param->getName();
            $value = $model->$propertyName;

            // Skip null id for new records
            if ($propertyName === 'id' && $value === null) {
                continue;
            }

            // Convert DateTimeImmutable to string
            if ($value instanceof \DateTimeImmutable) {
                $value = $value->format('Y-m-d H:i:s');
            }

            $data[self::toSnakeCase($propertyName)] = $value;
        }

        return $data;
    }

    /**
     * Convert database array to constructor arguments (snake_case -> camelCase)
     */
    public static function fromDatabase(array $data, string $modelClass): object
    {
        $reflection = new ReflectionClass($modelClass);
        $constructor = $reflection->getConstructor();

        if (!$constructor) {
            throw new \RuntimeException("Model {$modelClass} has no constructor");
        }

        $args = [];
        foreach ($constructor->getParameters() as $param) {
            $paramName = $param->getName();
            $snakeName = self::toSnakeCase($paramName);

            $value = $data[$snakeName] ?? null;

            // Handle DateTimeImmutable conversion
            $type = $param->getType();
            if ($type && !$type->isBuiltin()) {
                $typeName = $type->getName();
                if ($typeName === \DateTimeImmutable::class && $value !== null) {
                    $value = new \DateTimeImmutable($value);
                }
            }

            // Handle nullable types with defaults
            if ($value === null && $param->isDefaultValueAvailable()) {
                $value = $param->getDefaultValue();
            }

            $args[] = $value;
        }

        return new $modelClass(...$args);
    }
}
